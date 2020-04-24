import {
  observable,
  action,
  computed,
  runInAction,
  reaction,
  toJS
} from 'mobx';
import { SyntheticEvent } from 'react';
import { IActivity } from '../Models/activity';
import agent from '../api/agent';
import { history } from '../../index';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { setActivityProps, createAttendee } from '../common/util/util';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel
} from '@microsoft/signalr';

const LIMIT = 2;

export default class ActivityStore {
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.predicate.keys(),
      () => {
        this.page = 0;
        this.activityRegistry.clear();

        console.log('Reaction here');

        this.loadActivities();
      }
    );
  }

  rootStore: RootStore;

  @observable activityRegistry = new Map();
  @observable loadingInitial = false;
  @observable activity: IActivity | null = null;
  @observable submitting = false;
  @observable target = '';
  @observable loading = false;
  @observable.ref hubConnection: HubConnection | null = null;
  @observable activityCount = 0;
  @observable page = 0;
  @observable predicate = new Map();

  @action setPredicate = (predicate: string, value: string | Date) => {
    this.predicate.clear();

    if (predicate !== 'all') {
      this.predicate.set(predicate, value);
    }
  };

  @computed get axiosParams() {
    const params = new URLSearchParams();

    params.append('limit', LIMIT.toString());
    params.append('offset', `${this.page ? this.page * LIMIT : 0}`);

    this.predicate.forEach((value, key) => {
      if (key === 'startDate') params.append(key, value.toISOString());
      else params.append(key, value);
    });

    return params;
  }

  @computed get totalPages() {
    return Math.ceil(this.activityCount / LIMIT);
  }

  @action setPage = (page: number) => {
    this.page = page;
  };

  @action createHubConnection = (activityId: string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_API_CHAT_URL!, {
        accessTokenFactory: () => this.rootStore.commonStore.token!
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log(this.hubConnection!.state))
      .then(() => {
        console.log('Attempting to joing group');

        if (this.hubConnection!.state === 'Connected')
          this.hubConnection!.invoke('AddToGroup', activityId);
      })
      .catch(error => console.log('Error establishing connection: ', error));

    this.hubConnection.on('ReceiveComment', comment => {
      runInAction(() => {
        this.activity!.comments.push(comment);
      });
    });

    this.hubConnection.on('Send', message => {
      console.log(message);
    });
  };

  @action stopHubConnection = () => {
    this.hubConnection!.invoke('RemoveFromGroup', this.activity!.id)
      .then(() => {
        this.hubConnection!.stop();
      })
      .then(() => console.log('Connection has stopped'))
      .catch(err => console.log(err));
  };

  @action addComment = async (values: any) => {
    try {
      values.activityId = this.activity!.id;

      await this.hubConnection!.invoke('SendComment', values);
    } catch (error) {
      console.log(error);
    }
  };

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split('T')[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];

        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  @action loadActivities = async () => {
    try {
      this.loadingInitial = true;

      const { activities, activityCount } = await agent.Activities.list(
        this.axiosParams
      );

      runInAction('loading activities', () => {
        activities.forEach(activity => {
          activity = setActivityProps(activity, this.rootStore.userStore.user!);

          this.activityRegistry.set(activity.id, activity);
          this.activityCount = activityCount;
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction('loading activities cleanup', () => {
        this.loadingInitial = false;
      });
    }
  };

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);

    if (activity) {
      this.activity = activity;
      return toJS(activity);
    } else {
      try {
        this.loadingInitial = true;
        activity = await agent.Activities.details(id);

        runInAction('getting activity', () => {
          activity = setActivityProps(activity, this.rootStore.userStore.user!);

          this.activity = activity;
          this.activityRegistry.set(activity.id, activity);
          this.loadingInitial = false;
        });

        return activity;
      } catch (error) {
        console.log(error);
        runInAction('get activity error', () => {
          this.loadingInitial = false;
        });
      }
    }
  };

  @action clearActivity = () => {
    this.activity = null;
  };

  @action attendActivity = async () => {
    try {
      this.loading = true;

      const attendee = createAttendee(this.rootStore.userStore.user!);

      console.log('user is', attendee);

      await agent.Activities.attend(this.activity!.id);

      runInAction(() => {
        if (this.activity) {
          console.log('Activity is', this.activity.description);
          this.activity.attendees.push(attendee);
          this.activity.isGoing = true;
          this.activityRegistry.set(this.activity.id, this.activity);
        }
      });
    } catch (error) {
      console.log(error);
      toast.error('Problem signing up to activity');
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action cancelAttendance = async () => {
    try {
      this.loading = true;

      await agent.Activities.unattend(this.activity!.id);

      runInAction(() => {
        if (this.activity) {
          this.activity.attendees = this.activity.attendees.filter(
            a => a.username !== this.rootStore.userStore.user!.username
          );
          this.activity.isGoing = false;
          this.activityRegistry.set(this.activity.id, this.activity);
        }
      });
    } catch (error) {
      console.log(error);
      toast.error('Problem canceling attendance');
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action createActivity = async (activity: IActivity) => {
    try {
      this.submitting = true;
      await agent.Activities.create(activity);

      const attendee = createAttendee(this.rootStore.userStore.user!);

      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      activity.attendees = attendees;
      activity.isHost = true;
      activity.comments = [];

      runInAction('creating activity', () => {
        this.activityRegistry.set(activity.id, activity);
      });

      history.push(`/activities/${activity.id}`);
    } catch (error) {
      console.log(error.response);
      toast.error('Problem submitting data');
    } finally {
      runInAction('creating activity cleanup', () => {
        this.submitting = false;
      });
    }
  };

  @action editActivity = async (activity: IActivity) => {
    try {
      this.submitting = true;
      await agent.Activities.update(activity);

      runInAction('editing activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
      });

      history.push(`/activities/${activity.id}`);
    } catch (error) {
      console.log(error.response);
      toast.error('Problem submitting data');
    } finally {
      runInAction('editing activity cleanup', () => {
        this.submitting = false;
      });
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    try {
      this.submitting = true;
      this.target = event.currentTarget.name;

      await agent.Activities.delete(id);

      runInAction('deleting activity', () => {
        this.activityRegistry.delete(id);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction('deleting activity cleanup', () => {
        this.submitting = false;
        this.target = '';
      });
    }
  };
}

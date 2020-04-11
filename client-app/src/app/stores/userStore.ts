import { observable, computed, action, runInAction, configure } from 'mobx';
import { IUser, IUserFormValues } from '../Models/user';
import agent from '../api/agent';
import { RootStore } from './rootStore';
import { history } from '../..';

configure({ enforceActions: 'observed' });

export default class UserStore {
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  rootStore: RootStore;

  @observable user: IUser | null = null;

  @computed get isLoggedIn() {
    return !!this.user;
  }

  @action login = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.login(values);

      runInAction(() => {
        this.user = user;
      });

      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();

      history.push('/activities');
    } catch (error) {
      throw error;
    }
  };

  @action register = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.register(values);

      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();

      runInAction(() => {
        this.user = user;
      });
      history.push('/activities');
    } catch (error) {
      throw error;
    }
  };

  @action getUser = async () => {
    try {
      const user = await agent.User.current();

      runInAction(() => {
        this.user = user;
      });
    } catch (error) {
      console.log(error);
    }
  };

  @action logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;

    history.push('/');
  };
}

import React, { useContext } from 'react';
import { Item, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';
import { ActivityListItem } from './ActivityListItem';

const ActivityList = () => {
  const activityStore = useContext(ActivityStore);
  const { activitiesByDate } = activityStore;

  return (
    <React.Fragment>
      {activitiesByDate.map(([group, activities]) => {
        return (
          <React.Fragment key={group}>
            <Label size="large" color="blue">
              {group}
            </Label>
            <Item.Group divided>
              {activities.map(activity => (
                <ActivityListItem key={activity.id} activity={activity} />
              ))}
            </Item.Group>
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
};

export default observer(ActivityList);

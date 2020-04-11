import React, { useContext } from 'react';
import { Item, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { ActivityListItem } from './ActivityListItem';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { format } from 'date-fns';

const ActivityList = () => {
  const {
    activityStore: { activitiesByDate }
  } = useContext(RootStoreContext);

  return (
    <React.Fragment>
      {activitiesByDate.map(([group, activities]) => {
        return (
          <React.Fragment key={group}>
            <Label size="large" color="blue">
              {format(group, 'eeee do MMMM')}
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

import React from 'react';
import { IActivity } from '../../../app/Models/activity';
import { Item, Button, Label, Segment } from 'semantic-ui-react';

interface IProps {
  activities: IActivity[];
  selectActivity: (id: string) => void;
  deleteActivity: (id: string) => void;
}

export const ActivityList: React.FC<IProps> = ({
  activities,
  selectActivity,
  deleteActivity
}) => {
  return (
    <Segment clearing>
      <Item.Group divided>
        {activities.map(
          ({ id, title, date, description, city, venue, category }) => (
            <Item key={id}>
              <Item.Content>
                <Item.Content>
                  <Item.Header as="a">{title}</Item.Header>
                  <Item.Meta>{date}</Item.Meta>
                  <Item.Description>
                    <div>{description}</div>
                    <div>
                      {city}, {venue}
                    </div>
                  </Item.Description>
                  <Item.Extra>
                    <Button
                      floated="right"
                      content="View"
                      color="blue"
                      onClick={() => selectActivity(id)}
                    />
                    <Button
                      floated="right"
                      content="Delete"
                      color="red"
                      onClick={() => deleteActivity(id)}
                    />
                    <Label basic content={category} />
                  </Item.Extra>
                </Item.Content>
              </Item.Content>
            </Item>
          )
        )}
      </Item.Group>
    </Segment>
  );
};

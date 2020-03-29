import React, { SyntheticEvent } from 'react';
import { IActivity } from '../../../app/Models/activity';
import { Item, Button, Label, Segment } from 'semantic-ui-react';

interface IProps {
  activities: IActivity[];
  selectActivity: (id: string) => void;
  deleteActivity: (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => void;
  submitting: boolean;
  target: string;
}

export const ActivityList: React.FC<IProps> = ({
  activities,
  selectActivity,
  deleteActivity,
  submitting,
  target
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
                      name={id}
                      loading={target === id && submitting}
                      floated="right"
                      content="Delete"
                      color="red"
                      onClick={e => deleteActivity(e, id)}
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

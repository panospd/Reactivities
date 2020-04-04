import React from 'react';
import { Item, Button, Segment, Icon } from 'semantic-ui-react';
import { IActivity } from '../../../app/Models/activity';
import { Link } from 'react-router-dom';

export const ActivityListItem: React.FC<{ activity: IActivity }> = ({
  activity
}) => {
  const { id, title } = activity;

  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item key={id}>
            <Item.Image size="tiny" circular src="/assets/user.png" />
            <Item.Content>
              <Item.Content>
                <Item.Header as="a">{title}</Item.Header>
                <Item.Description>Hosted by Bob</Item.Description>
              </Item.Content>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Icon name="clock" /> {activity.date}
        <Icon name="marker" /> {activity.venue}, {activity.city}
      </Segment>
      <Segment secondary>Attendees will go here</Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          floated="right"
          content="View"
          color="blue"
          as={Link}
          to={`/activities/${id}`}
        />
      </Segment>
    </Segment.Group>
  );
};

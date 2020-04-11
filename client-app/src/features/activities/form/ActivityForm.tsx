import React, { useState, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { ActivityFormValues } from '../../../app/Models/activity';
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import { TextInput } from '../../../app/common/form/TextInput';
import { TextAreaInput } from '../../../app/common/form/TextAreaInput';
import { SelectInput } from '../../../app/common/form/SelectInput';
import { category } from '../../../app/common/options/CategoryOptions';
import { DateInput } from '../../../app/common/form/DateInput';
import { combineDateAndTime } from '../../../app/common/util/util';
import {
  combineValidators,
  isRequired,
  composeValidators,
  hasLengthGreaterThan
} from 'revalidate';
import { RootStoreContext } from '../../../app/stores/rootStore';

const validate = combineValidators({
  title: isRequired({ message: 'The event title is required' }),
  category: isRequired('Category'),
  description: composeValidators(
    isRequired('Description'),
    hasLengthGreaterThan(4)({
      message: 'Description needs to be at least 5 characters'
    })
  )(),
  city: isRequired('City'),
  venue: isRequired('Venue'),
  date: isRequired('Date'),
  time: isRequired('Time')
});

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history
}) => {
  const [activity, setActivity] = useState(new ActivityFormValues());
  const [loading, setLoading] = useState(false);

  const {
    activityStore: { createActivity, editActivity, submitting, loadActivity }
  } = useContext(RootStoreContext);

  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadActivity(match.params.id)
        .then(activity => setActivity(new ActivityFormValues(activity)))
        .finally(() => setLoading(false));
    }
  }, [loadActivity, match.params.id]);

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);

    const { date, time, ...activity } = values;

    activity.date = dateAndTime;

    if (!activity.id) {
      let newActivity = {
        ...activity,
        id: uuid()
      };

      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            validate={validate}
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => {
              return (
                <Form loading={loading}>
                  <Field
                    placeholder="Title"
                    name="title"
                    value={activity.title}
                    render={props => <TextInput {...props} />}
                  />
                  <Field
                    placeholder="Description"
                    name="description"
                    rows={3}
                    value={activity.description}
                    render={props => <TextAreaInput {...props} />}
                  />
                  <Field
                    render={props => <SelectInput {...props} />}
                    placeholder="Category"
                    options={category}
                    name="category"
                    value={activity.category}
                  />
                  <Form.Group widths="equal">
                    <Field
                      placeholder="Date"
                      name="date"
                      date={true}
                      value={activity.date}
                      render={props => <DateInput {...props} />}
                    />
                    <Field
                      placeholder="Time"
                      time={true}
                      name="time"
                      value={activity.date}
                      render={props => <DateInput {...props} />}
                    />
                  </Form.Group>

                  <Field
                    placeholder="City"
                    name="city"
                    value={activity.city}
                    render={props => <TextInput {...props} />}
                  />
                  <Field
                    placeholder="Venue"
                    name="venue"
                    value={activity.venue}
                    render={props => <TextInput {...props} />}
                  />
                  <Button
                    loading={submitting}
                    disabled={loading || invalid || pristine}
                    floated="right"
                    positive
                    type="submit"
                    content="Submit"
                    onClick={handleSubmit}
                  />
                  <Button
                    floated="right"
                    disabled={loading}
                    type="button"
                    content="Cancel"
                    onClick={
                      activity.id
                        ? () => history.push(`/activities/${activity.id}`)
                        : () => history.push('/activities')
                    }
                  />
                </Form>
              );
            }}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);

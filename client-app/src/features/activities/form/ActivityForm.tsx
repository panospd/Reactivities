import React, { useState, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { IActivity } from '../../../app/Models/activity';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import { TextInput } from '../../../app/common/form/TextInput';
import { TextAreaInput } from '../../../app/common/form/TextAreaInput';
import { SelectInput } from '../../../app/common/form/SelectInput';
import { category } from '../../../app/common/options/CategoryOptions';

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history
}) => {
  const [activity, setActivity] = useState<IActivity>({
    id: '',
    title: '',
    category: '',
    description: '',
    date: '',
    city: '',
    venue: ''
  });

  const {
    activity: initialFormState,
    createActivity,
    editActivity,
    submitting,
    loadActivity,
    clearActivity
  } = useContext(ActivityStore);

  useEffect(() => {
    if (match.params.id && activity.id.length === 0) {
      loadActivity(match.params.id).then(() => {
        console.log('Initial form state', initialFormState);
        initialFormState && setActivity(initialFormState);
      });
    }

    return () => {
      clearActivity();
    };
  }, [
    loadActivity,
    match.params.id,
    clearActivity,
    initialFormState,
    activity.id.length
  ]);

  const handleFinalFormSubmit = (values: any) => {
    console.log(values);
  };

  // const handleSubmit = () => {
  //   if (activity.id.length === 0) {
  //     let newActivity = {
  //       ...activity,
  //       id: uuid()
  //     };

  //     createActivity(newActivity).then(() =>
  //       history.push(`/activities/${newActivity.id}`)
  //     );
  //   } else {
  //     editActivity(activity).then(() =>
  //       history.push(`/activities/${activity.id}`)
  //     );
  //   }
  // };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit }) => {
              return (
                <Form>
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
                  <Field
                    placeholder="Date"
                    name="date"
                    value={activity.date}
                    render={props => <TextInput {...props} />}
                  />
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
                    floated="right"
                    positive
                    type="submit"
                    content="Submit"
                    onClick={handleSubmit}
                  />
                  <Button
                    floated="right"
                    type="button"
                    content="Cancel"
                    onClick={() => history.push('/activities')}
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

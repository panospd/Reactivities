import React from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { observer } from 'mobx-react-lite';
import { IProfile } from '../../app/Models/profile';
import { combineValidators, isRequired } from 'revalidate';
import { Form, Button } from 'semantic-ui-react';
import { TextInput } from '../../app/common/form/TextInput';
import { TextAreaInput } from '../../app/common/form/TextAreaInput';

const validate = combineValidators({
  displayName: isRequired('Display name')
});

interface IProps {
  editProfile: (profile: IProfile) => void;
  profile: IProfile;
}

const ProfileEditForm: React.FC<IProps> = ({ editProfile, profile }) => {
  return (
    <FinalForm
      onSubmit={editProfile}
      validate={validate}
      initialValues={profile!}
      render={({ handleSubmit, submitting, invalid, pristine }) => (
        <Form onSubmit={handleSubmit} error>
          <Field
            name="displayName"
            value={profile.displayName}
            render={props => <TextInput {...props} />}
            placeholder="Display name"
          />
          <Field
            name="bio"
            value={profile.bio}
            rows={3}
            render={props => <TextAreaInput {...props} />}
            placeholder="Bio"
          />
          <Button
            disabled={invalid || pristine}
            loading={submitting}
            color="teal"
            content="Update profile"
            floated="right"
          />
        </Form>
      )}
    />
  );
};

export default observer(ProfileEditForm);

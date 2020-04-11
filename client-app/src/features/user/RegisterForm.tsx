import React, { useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { IUserFormValues } from '../../app/Models/user';
import { Form, Button, Header } from 'semantic-ui-react';
import { TextInput } from '../../app/common/form/TextInput';
import { RootStoreContext } from '../../app/stores/rootStore';
import { FORM_ERROR } from 'final-form';
import { isRequired, combineValidators } from 'revalidate';
import ErrorMessage from '../../app/common/form/ErrorMessage';

const validate = combineValidators({
  email: isRequired('email'),
  username: isRequired('username'),
  displayName: isRequired('display name'),
  password: isRequired('password')
});

export const RegisterForm = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    userStore: { register }
  } = rootStore;

  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        register(values).catch(error => ({
          [FORM_ERROR]: error
        }))
      }
      validate={validate}
      render={({
        handleSubmit,
        submitting,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header
            as="h2"
            content="Sign up to Reactivities"
            color="teal"
            textAlign="center"
          />
          <Field
            name="username"
            render={props => <TextInput {...props} />}
            placeholder="Username"
          />
          <Field
            name="displayName"
            render={props => <TextInput {...props} />}
            placeholder="Display name"
          />
          <Field
            name="email"
            render={props => <TextInput {...props} />}
            placeholder="Email"
          />
          <Field
            name="password"
            type="password"
            render={props => <TextInput {...props} />}
            placeholder="Password"
          />

          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage error={submitError} />
          )}

          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            color="teal"
            content="Register"
            fluid
          />
        </Form>
      )}
    />
  );
};

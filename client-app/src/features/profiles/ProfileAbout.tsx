import React, { useContext, useState } from 'react';
import { Tab, Header, Button, Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileEditForm from './ProfileEditForm';

const ProfileAbout = () => {
  const rootStore = useContext(RootStoreContext);
  const { profile, isCurrentUser, editProfile } = rootStore.profileStore;

  const [editProfileMode, setEditProfileMode] = useState(false);

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header
            floated="left"
            icon="image"
            content={`About ${profile?.displayName}`}
          />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={editProfileMode ? 'Cancel' : 'Edit Profile'}
              onClick={() => setEditProfileMode(!editProfileMode)}
            />
          )}
        </Grid.Column>

        <Grid.Column width={16}>
          {!editProfileMode ? (
            <div>{profile?.bio}</div>
          ) : (
            <ProfileEditForm editProfile={editProfile} profile={profile!} />
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileAbout);

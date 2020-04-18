import { RootStore } from './rootStore';
import { observable, action, runInAction, computed } from 'mobx';
import { IProfile, IPhoto, IProfileFormValues } from '../Models/profile';
import agent from '../api/agent';
import { toast } from 'react-toastify';

export default class ProfileStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile = true;
  @observable uploadingPhoto = false;
  @observable loading = false;

  @computed get isCurrentUser() {
    const { user } = this.rootStore.userStore;
    return user && this.profile && user.username === this.profile.username;
  }

  @action loadProfile = async (username: string) => {
    try {
      this.loadingProfile = true;

      const profile = await agent.Profiles.get(username);

      runInAction(() => (this.profile = profile));
      console.log('From profile', profile);
      return profile;
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loadingProfile = false));
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    try {
      this.uploadingPhoto = true;

      const photo = await agent.Profiles.uploadPhoto(file);

      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
          }
        }
      });
    } catch (error) {
      console.log(error);
      toast.error('Problem uploading photo');
    } finally {
      runInAction(() => {
        this.uploadingPhoto = false;
      });
    }
  };

  @action setMainPhoto = async (photo: IPhoto) => {
    try {
      this.loading = true;

      await agent.Profiles.setMainPhoto(photo.id);

      runInAction(() => {
        this.rootStore.userStore.user!.image = photo.url;
        this.profile!.photos.find(a => a.isMain)!.isMain = false;
        this.profile!.photos.find(a => a.id === photo.id)!.isMain = true;
        this.profile!.image = photo.url;
      });
    } catch (error) {
      console.log(error);
      toast.error('Problem setting photo as main');
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action deletePhoto = async (photo: IPhoto) => {
    try {
      this.loading = true;

      await agent.Profiles.deletePhoto(photo.id);

      runInAction(() => {
        this.profile!.photos = this.profile!.photos.filter(
          a => a.id !== photo.id
        );
      });
    } catch (error) {
      console.log(error);
      toast.error('Problem deleting the photo');
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action editProfile = async (profile: Partial<IProfile>) => {
    try {
      await agent.Profiles.editProfile(profile);

      runInAction(() => {
        if (profile.displayName !== this.rootStore.userStore.user!.displayName)
          this.rootStore.userStore.user!.displayName = profile.displayName!;

        this.profile = { ...this.profile!, ...profile };
      });
    } catch (error) {
      console.log(error);
      toast.error('Problem editing profile');
    }
  };
}

import { RootStore } from './rootStore';
import { observable, action, runInAction, computed } from 'mobx';
import { IProfile } from '../Models/profile';
import agent from '../api/agent';

export default class ProfileStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile = true;

  @computed get isCurrentUser() {
    const { user } = this.rootStore.userStore;
    return user && this.profile && user.username === this.profile.username;
  }

  @action loadProfile = async (username: string) => {
    try {
      this.loadingProfile = true;

      const profile = await agent.Profiles.get(username);

      runInAction(() => (this.profile = profile));
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loadingProfile = false));
    }
  };
}

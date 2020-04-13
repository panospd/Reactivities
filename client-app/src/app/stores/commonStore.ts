import { RootStore } from './rootStore';
import { observable, action, reaction } from 'mobx';

export default class CommonStore {
  @observable token: string | null = window.localStorage.getItem('jwt');
  @observable appLoaded: boolean = false;

  rootStore: RootStore;

  constructor(rootstore: RootStore) {
    this.rootStore = rootstore;

    reaction(
      () => this.token,
      token => {
        if (token) {
          window.localStorage.setItem('jwt', token);
        } else {
          window.localStorage.removeItem('jwt');
        }
      }
    );
  }

  @action setToken = (token: string | null) => {
    this.token = token;
  };

  @action setAppLoaded = () => {
    this.appLoaded = true;
  };
}

import { types } from 'mobx-state-tree';
import isBrowser from 'is-browser';
import UserEffects from './userEffects';
import { JWTPaylodeDecode } from '../../utils/jwtUtils';
import getCookie from '../../utils/getCookie';

const defaultState = {
  userRole: '',
  isLoggedIn: false,
  uuid: '',
  isAdminOwner: false,
};

const userRoles = [
  types.literal('super-admin'),
  types.literal('admin'),
  types.literal('agent'),
  types.literal('customer'),
  types.literal(''),
];

const UserStore = types
  .model('User', {
    userRole: types.union(...userRoles),
    isLoggedIn: types.boolean,
    uuid: types.string,
    serverJWTData: types.optional(types.frozen, null),
    isAdminOwner: types.boolean,
  })
  .actions(self => ({
    setUser: userObject => {
      if (!userObject) return;
      self.isLoggedIn = true;
      self.userRole = userObject.role;
      self.uuid = userObject.uuid;
      self.isAdminOwner = userObject.isAdminOwner || false;
    },
    unsetUser: () => {
      self.isLoggedIn = false;
      self.userRole = '';
      self.uuid = '';
      self.isAdminOwner = false;
    },
    afterCreate: async () => {
      let JWTData;
      if (isBrowser && !self.isLoggedIn) {
        const encodedJWTData = getCookie('jwtData');
        if (!encodedJWTData) return;

        try {
          JWTData = JWTPaylodeDecode(encodedJWTData);
        } catch (err) {
          console.log(err);
        }

        self.setUser(JWTData);
      } else if (!isBrowser) {
        if (!self.serverJWTData) return;
        self.setUser(self.serverJWTData);
      }
    },
  }))
  .views(self => ({}));

const Store = types.compose(
  'Store',
  UserStore,
  UserEffects
);

function createStore(cookieJWTData) {
  if (!isBrowser && cookieJWTData) {
    defaultState.serverJWTData = JWTPaylodeDecode(cookieJWTData);
  }

  return Store.create(defaultState);
}

export default createStore;

import { notificationReducer } from './notifications/Reducer';
import { combineReducers } from 'redux';
import { UserReducer } from './user/Reducer';
import { CompanyReducer } from './company/Reducer';
import { RoomReducer } from './room/Reducer';
import { LayoutReducer } from './layout/Reducer';
import { BoardIndexReducer } from './boardIndexReducer';
import { AssociateReducer } from './associate/Reducer';
import { ProjectReducer } from './project/Reducer';
import { PusherReducer } from './pusher/Reducer';
import { SubscriptionReducer } from './subscriptionBilling/Reducer';
<<<<<<< HEAD
<<<<<<< HEAD
import { AssociateModel } from './associate/Reducer';
import { videoConferencesReducers } from './videoConferences/Reducer';
import toasterReducer from './toast/Reducer';
export interface AppState {
  layoutReducer: any;
  roomReducer: any;
  userReducer: any;
  companyReducer: any;
  boardIndexReducer: any;
  associateReducer: AssociateModel;
  projectReducer: any;
  notificationReducer: any;
  pusherReducer: any;
  SubscriptionReducer: any;
  videoConferencesReducers: any;
  toasterReducer: any;
}

import { AssociateModel } from './associate/Reducer';

export interface AppState {
  layoutReducer: any;
  roomReducer: any;
  userReducer: any;
  companyReducer: any;
  boardIndexReducer: any;
  associateReducer: AssociateModel;
  projectReducer: any;
  notificationReducer: any;
  pusherReducer: any;
}
=======
>>>>>>> cdf1363f... Feature/tig 224 (#231)

=======
>>>>>>> 8c1bc264... Bugfix/refactor saga (#267)
import { AssociateModel } from './associate/Reducer';
import { videoConferencesReducers } from './videoConferences/Reducer';
import toasterReducer from './toast/Reducer';
export interface AppState {
  layoutReducer: any;
  roomReducer: any;
  userReducer: any;
  companyReducer: any;
  boardIndexReducer: any;
  associateReducer: AssociateModel;
  projectReducer: any;
  notificationReducer: any;
  pusherReducer: any;
  SubscriptionReducer: any;
  videoConferencesReducers: any;
  toasterReducer: any;
}

export const rootReducer = combineReducers({
  layoutReducer: LayoutReducer,
  roomReducer: RoomReducer,
  userReducer: UserReducer,
  companyReducer: CompanyReducer,
  boardIndexReducer: BoardIndexReducer,
  associateReducer: AssociateReducer,
  projectReducer: ProjectReducer,
  notificationReducer,
  pusherReducer: PusherReducer,
  subscriptionReducer: SubscriptionReducer,
<<<<<<< HEAD
<<<<<<< HEAD
  videoConferencesReducers: videoConferencesReducers,
  toasterReducer: toasterReducer,
=======
>>>>>>> cdf1363f... Feature/tig 224 (#231)
=======
  videoConferencesReducers: videoConferencesReducers,
  toasterReducer: toasterReducer,
>>>>>>> 8c1bc264... Bugfix/refactor saga (#267)
});

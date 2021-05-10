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
import { AssociateModel } from './associate/Reducer';
import { videoConferencesReducers } from './videoConferences/Reducer';
import toasterReducer from './toast/Reducer';
import { LandingReducer } from './landing/Reducer';
import { CommentReducer } from './comment/Reducer';
import { TaskMembersReducer } from './taskMembers/Reducer';

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
  landingReducer: any;
  commentReducer: any;
  taskMembersReducer: any;
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
  videoConferencesReducers,
  toasterReducer,
  landingReducer: LandingReducer,
  commentReducer: CommentReducer,
  taskMembersReducer: TaskMembersReducer,
});

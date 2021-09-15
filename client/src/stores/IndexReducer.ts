import { EduDetailsFormReducer } from './EduDetailsFrom/Reducer';
import { JobDetailsFormReducer } from './jobDetailsForm/Reducer';
import { notificationReducer } from './notifications/Reducer';
import { combineReducers } from 'redux';
import { UserReducer } from './user/Reducer';
import { CompanyReducer } from './company/Reducer';
import { RoomReducer } from './room/Reducer';
import { LayoutReducer } from './layout/Reducer';
import { TaskIndexReducer } from './taskIndexReducer';
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
import { TimeTrackerReducer } from './time-tracker/Reducer';
import { ReportFormReducer } from './reportForm/Reducer';
import { ProjectFormReducer } from './projectForm/Reducer';
import { TaskFormReducer } from './taskForm/Reducer';
import { UserBasicInfoFormReducer } from './UserBasicInfoDetailsForm/Reducer';
import { CompanyBasicInfoFormReducer } from './companyBasicInfoForm/Reducer';

import { loadingBarReducer } from 'react-redux-loading-bar';

export interface AppState {
  layoutReducer: any;
  roomReducer: any;
  userReducer: any;
  companyReducer: any;
  taskIndexReducer: any;
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
  reportFormReducer: any;
  projectFormReducer: any;
  taskFormReducer: any;
  userBasicInfoFormReducer: any;
  jobDetailsFormReducer: any;
  eduDetailsFormReducer: any;
  companyBasicInfoFormReducer: any;
}

export const rootReducer = combineReducers({
  layoutReducer: LayoutReducer,
  roomReducer: RoomReducer,
  userReducer: UserReducer,
  companyReducer: CompanyReducer,
  taskIndexReducer: TaskIndexReducer,
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
  timeTrackerReducer: TimeTrackerReducer,
  loadingBar: loadingBarReducer,
  reportFormReducer: ReportFormReducer,
  projectFormReducer: ProjectFormReducer,
  taskFormReducer: TaskFormReducer,
  userBasicInfoFormReducer: UserBasicInfoFormReducer,
  jobDetailsFormReducer: JobDetailsFormReducer,
  eduDetailsFormReducer: EduDetailsFormReducer,
  companyBasicInfoFormReducer: CompanyBasicInfoFormReducer,
});

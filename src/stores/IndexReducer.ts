import { notificationReducer } from './notifications/Reducer';
import { combineReducers } from 'redux';
import { UserReducer } from './user/Reducer';
import { CompanyReducer } from './company/Reducer';
import { RoomReducer } from './room/Reducer';
import { LayoutReducer } from './layout/Reducer';
import { BoardIndexReducer } from './boardIndexReducer';
import { AssociateReducer } from './associate/Reducer';
import { ProjectReducer } from './project/Reducer';

export const rootReducer = combineReducers({
  layoutReducer: LayoutReducer,
  roomReducer: RoomReducer,
  userReducer: UserReducer,
  companyReducer: CompanyReducer,
  boardIndexReducer: BoardIndexReducer,
  associateReducer: AssociateReducer,
  projectReducer: ProjectReducer,
  notificationReducer
});

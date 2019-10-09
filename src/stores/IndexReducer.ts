import { combineReducers } from "redux";
import { AuthReducer } from "./auth/Reducer";
import { UserReducer } from './user/Reducer';
import { CompanyReducer } from './company/Reducer';
import { RoomReducer } from './room/RoomReducer';

export const RootReducer = combineReducers({
	authReducer: AuthReducer,
	roomReducer: RoomReducer,
	userReducer: UserReducer,
	companyReducer: CompanyReducer
});

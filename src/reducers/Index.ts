import { combineReducers } from "redux";
import { AuthReducer } from "./AuthReducer";
import { UserReducer } from './UserReducer';
import { CompanyReducer } from './company/CompanyReducer';
import { ChatkitReducer } from "./ChatkitReducer";
import { RoomReducer } from './company/RoomReducer';

export const RootReducer = combineReducers({
	authReducer: AuthReducer,
	roomReducer: RoomReducer,
	userReducer: UserReducer,
	companyReducer: CompanyReducer,
	chatkitReducer: ChatkitReducer
});

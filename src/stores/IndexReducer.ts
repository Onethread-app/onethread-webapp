import { combineReducers } from "redux";
import { UserReducer } from "./user/Reducer";
import { CompanyReducer } from "./company/Reducer";
import { RoomReducer } from "./room/Reducer";
import { TaskManagementReducer } from "./TaskManagementReducer";

export const RootReducer = combineReducers({
	roomReducer: RoomReducer,
	userReducer: UserReducer,
	companyReducer: CompanyReducer,
	taskManagementReducer: TaskManagementReducer
});

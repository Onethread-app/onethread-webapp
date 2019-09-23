import { combineReducers } from "redux";
import { AuthReducer } from "./AuthReducer";
import { WorkplaceReducer } from "./workplace";
import { InfoReducer } from './InfoReducer';

export const RootReducer = combineReducers({
	auth: AuthReducer,
	workplace: WorkplaceReducer,
	info: InfoReducer
});

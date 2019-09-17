import { combineReducers } from "redux";
import { AuthReducer } from "./AuthReducer";
import { WorkplaceReducer } from "./workplace";

export const RootReducer = combineReducers({
	auth: AuthReducer,
	workplace: WorkplaceReducer
});

import { combineReducers } from "redux";
import { AuthReducer } from "./AuthReducer";
import { WorkplaceReducer } from "./workplace";
import { ChatkitReducer } from "./ChatkitReducer";

export const RootReducer = combineReducers({
	auth: AuthReducer,
	workplace: WorkplaceReducer,
	chatkit: ChatkitReducer
});

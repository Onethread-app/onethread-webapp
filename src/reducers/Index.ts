import { combineReducers } from "redux";
import { AuthReducer } from "./AuthReducer";
import { WorkplaceReducer } from "./workplace";
import { InfoReducer } from './InfoReducer';
import { CompanyReducer } from './CompanyReducer';
import { ChatkitReducer } from "./ChatkitReducer";

export const RootReducer = combineReducers({
	auth: AuthReducer,
	workplace: WorkplaceReducer,
	info: InfoReducer,
	company: CompanyReducer,
	chatkit: ChatkitReducer
});

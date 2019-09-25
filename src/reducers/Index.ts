import { combineReducers } from "redux";
import { AuthReducer } from "./AuthReducer";
import { WorkplaceReducer } from "./company/workplace";
import { UserReducer } from './UserReducer';
import { CompanyReducer } from './CompanyReducer';
import { ChatkitReducer } from "./ChatkitReducer";

export const RootReducer = combineReducers({
	authReducer: AuthReducer,
	workplaceReducer: WorkplaceReducer,
	userReducer: UserReducer,
	companyReducer: CompanyReducer,
	chatkitReducer: ChatkitReducer
});

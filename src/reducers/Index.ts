import { combineReducers } from "redux";
import { AuthReducer, LoginErrorReducer } from './AuthReducer';

export const RootReducer = combineReducers({
  auth: AuthReducer,
  loginError: LoginErrorReducer
});
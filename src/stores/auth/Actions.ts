import {
	USER_LOGIN,
	USER_LOGIN_ERROR,
	USER_SIGNUP_LOADING,
	USER_LOGOUT,
	CLEAR_AUTH_REDUCER_STATE,
	USER_SIGNUP
} from "./Types";
import tigrowApi from "tigrowApi";
import { AxiosRequestConfig } from "axios";
import { History } from "history";
import { UserModel } from "stores/auth/Reducer";
import { isEqual } from "lodash";
import { tokenConfig } from "../UtilsActions";
import { BASIC_INFO, USER_FETCH_LOADING, FETCH_USER, USER_FETCH_ERROR, CLEAR_USER_REDUCER_STATE } from 'stores/user/Types';
import { CLEAR_ROOMS_REDUCER_STATE } from 'stores/room/Types';
import { CLEAR_COMPANY_REDUCER_STATE } from 'stores/company/Types';


export const userSignupAction = (
	newUser: UserModel,
	routeHistory: History
) => async (dispatch: any) => {
	try {
		dispatch({ type: USER_SIGNUP_LOADING });
		const user = {
			...newUser,
			contactNo: `880${newUser.contactNo}`
		};
		const response = await tigrowApi.post("account/signup", user, {
			"Content-Type": "application/json"
		} as AxiosRequestConfig);
		console.log(response.data);
		localStorage.setItem("token", JSON.stringify(response.data.token));
		await dispatch({ type: USER_SIGNUP, payload: response.data });
		await dispatch({ type: BASIC_INFO, payload: response.data });
		console.log(response.data)
		routeHistory.push(`/${response.data.user.name}`);
	} catch (error) {
		console.log(error)
		if (isEqual(error.message, "Network Error")) {
			dispatch({
				type: USER_LOGIN_ERROR,
				payload: {
					message: "Network error",
					email: false,
					network: true
				}
			});
		} else if (error.response.status === 409) {
			dispatch({
				type: USER_LOGIN_ERROR,
				payload: {
					message: "Email has been already registered",
					email: true,
					network: false
				}
			});
		} else {
			console.log(error.response);
		}
	}
};

export const loginAction = (
	loginUser: UserModel,
	routeHistory: History
) => async (dispatch: any) => {
	try {
		dispatch({ type: USER_SIGNUP_LOADING });
		const response = await tigrowApi.post("account/login", loginUser, {
			"Content-Type": "application/json"
		} as AxiosRequestConfig);
		localStorage.setItem("token", JSON.stringify(response.data.token));
		dispatch({ type: USER_LOGIN, payload: response.data });
		dispatch({ type: BASIC_INFO, payload: response.data });
		routeHistory.push(`/${response.data.user.name}`);
	} catch (error) {
		if (isEqual(error.message, "Network Error")) {
			dispatch({
				type: USER_LOGIN_ERROR,
				payload: {
					message: "Network Error",
					email: false,
					password: false,
					network: true
				}
			});
		} else if (error.response && error.response.status === 401) {
			dispatch({
				type: USER_LOGIN_ERROR,
				payload: {
					message: "Unauthorized user. please enter valid email and password.",
					email: true,
					password: true,
					network: false
				}
			});
		} else {
			console.log(error.response);
		}
	}
};


export const fetchUserAction = () => async (dispatch: any, getState: any) => {
	try {
		const headers = tokenConfig(getState);
		if ((headers as any).headers.Authorization) {
			dispatch({ type: USER_FETCH_LOADING });
			const response = await tigrowApi.get(`/account`, headers);
			dispatch({ type: FETCH_USER, payload: response.data.user });
		} else {
			dispatch({ type: USER_FETCH_ERROR, payload: "error in user fetching" });
		}
	} catch (error) {
		console.log(error);
	}
};

export const logoutAction = (routeHistory: History) => async (
	dispatch: any,
	getState: any
) => {
	try {
		const headers = tokenConfig(getState);
		if ((headers as any).headers.Authorization) {
			const response = await tigrowApi.get(`/account/logout`, headers);
			if (isEqual(response.status, 200)) {
				await localStorage.removeItem("token");
				await dispatch({ type: USER_LOGOUT });
				await dispatch({ type: CLEAR_AUTH_REDUCER_STATE });
				await dispatch({ type: CLEAR_COMPANY_REDUCER_STATE });
				await dispatch({ type: CLEAR_ROOMS_REDUCER_STATE });
				await dispatch({ type: CLEAR_USER_REDUCER_STATE });
				routeHistory.push("/signin");
			}
		} else {
			console.log("No token found in logout action");
		}
	} catch (error) {
		console.log("error in logout", error);
	}
};
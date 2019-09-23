import {
	USER_SIGNUP,
	USER_LOGIN,
	USER_LOGIN_ERROR,
	FETCH_USER,
	USER_SIGNUP_LOADING,
	USER_LOGOUT,
	BASIC_INFO
} from "./Types";
import tigrowApi from "tigrowApi";
import { AxiosRequestConfig } from "axios";
import { History } from "history";
import { UserModel } from "reducers/AuthReducer";
import { isEqual } from "lodash";
import { tokenConfig } from "./UtilsActions";

export const userSignupAction = (
	newUser: UserModel,
	routeHistory: History
) => async (dispatch: any) => {
	try {
		dispatch({ type: USER_SIGNUP_LOADING });
		const response = await tigrowApi.post("account/signup", newUser, {
			"Content-Type": "application/json"
		} as AxiosRequestConfig);
		localStorage.setItem("token", JSON.stringify(response.data.token));
		routeHistory.push("/");
		dispatch({ type: USER_SIGNUP, payload: response.data });
		dispatch({ type: BASIC_INFO, payload: response.data });
	} catch (error) {
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
		routeHistory.push("/");
		dispatch({ type: USER_LOGIN, payload: response.data });
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
			dispatch({ type: USER_SIGNUP_LOADING });
			const response = await tigrowApi.get(`/account`, headers);
			dispatch({ type: FETCH_USER, payload: response.data });
		} else {
			dispatch({ type: USER_LOGIN_ERROR, payload: "error in fetching" });
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
			localStorage.removeItem("token");
			await tigrowApi.get(`/account/logout`);
			routeHistory.push("/signin");
			dispatch({ type: USER_LOGOUT });
		} else {
			console.log("No token found in logout action");
		}
	} catch (error) {
		console.log("error in logout", error);
	}
};

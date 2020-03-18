import { AxiosRequestConfig } from 'axios';
import { History } from 'history';
import { isEqual } from 'lodash';
import { tokenConfig, parseJwt } from '../UtilsActions';
import { FETCH_USER, USER_FETCH_ERROR, CLEAR_USER_REDUCER_STATE } from 'stores/user/Types';
import { CLEAR_ROOMS_REDUCER_STATE } from 'stores/room/Types';
import { CLEAR_COMPANY_REDUCER_STATE } from 'stores/company/Types';
import { errorMessgeHandler } from 'components/final-form/utils';
import { createBrowserHistory } from 'history';
import { tigrowApi } from 'config';
import { Toaster } from '@blueprintjs/core';
import { CLEAR_PROJECT_REDUCER_STATE } from 'stores/project/Types';

export interface UserModel {
	firstName: string;
	lastName: string;
	contactNo: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export interface LoginModel {
	email: string;
	password: string;
}

const RouteHistory = createBrowserHistory();

const resfreshApiAction = async () => {
	let accessToken = typeof window !== undefined && localStorage.getItem('tigrow_acc_id') ?
		JSON.parse(localStorage.getItem('tigrow_acc_id')!) : null;
	const refreshToken = typeof window !== undefined && localStorage.getItem('tigrow_real_id') ?
		JSON.parse(localStorage.getItem('tigrow_real_id')!) : null;
	if (localStorage.getItem('tigrow_acc_id') && localStorage.getItem('tigrow_real_id')) {
		try {
			const response = await tigrowApi.post('accounts/refresh', {
				accessToken,
				refreshToken,
			});
			if (response.status === 200) {
				localStorage.setItem('tigrow_acc_id', JSON.stringify(response.data.accessToken));
				localStorage.setItem('tigrow_real_id', JSON.stringify(response.data.refreshToken));
				accessToken = localStorage.getItem('tigrow_acc_id');
				const accessTokenExpiredTime = (parseJwt(accessToken) * 1000) - 1000;
				const accessTokenRemainingTime = accessTokenExpiredTime - Date.now();
				setTimeout(resfreshApiAction, accessTokenRemainingTime);
			}
			return errorMessgeHandler(response);
		} catch (error) {
			return errorMessgeHandler(error);
		}
	} else {
		localStorage.removeItem('tigrow_acc_id');
		localStorage.removeItem('tigrow_real_id');
		Toaster.create().show({ message: 'Token is invalid. Please sign in.', intent: 'danger' });
		RouteHistory.push('/signin');
		window.location.reload(false);
		return;
	}
};

export const userSignupAction = (
	newUser: UserModel
) => async (dispatch: any) => {
	try {
		const user = {
			...newUser,
			contactNo: `+88${newUser.contactNo}`
		};
		const response = await tigrowApi.post('accounts/signup', user, {
			'Content-Type': 'application/json'
		} as AxiosRequestConfig);
		if (response.status === 201) {
			localStorage.setItem('email', JSON.stringify(newUser.email));
		}
		return errorMessgeHandler(response);
	} catch (error) {
		return errorMessgeHandler(error);
	}
};

export const loginAction = (loginUser: LoginModel) => async (dispatch: any) => {
	try {
		const response = await tigrowApi.post('accounts/login', loginUser, {
			'Content-Type': 'application/json'
		} as AxiosRequestConfig);
		if (response.status === 200) {
			localStorage.setItem('tigrow_acc_id', JSON.stringify(response.data.accessToken));
			localStorage.setItem('tigrow_real_id', JSON.stringify(response.data.refreshToken));
			if (localStorage.getItem('email')) {
				localStorage.removeItem('email');
			}
		}
		return errorMessgeHandler(response);
	} catch (error) {
		return errorMessgeHandler(error);
	}
};

export const fetchUserAction = () => async (dispatch: any) => {
	let accessToken = localStorage.getItem('tigrow_acc_id');
	let accessTokenExpiredTime = (parseJwt(accessToken) * 1000) - 1000;
	const refreshToken = localStorage.getItem('tigrow_real_id');
	const refreshTokenExpiredTime = (parseJwt(refreshToken) * 1000);
	// when refresh token is expired
	if (refreshTokenExpiredTime < Date.now()) {
		localStorage.removeItem('tigrow_acc_id');
		localStorage.removeItem('tigrow_real_id');
	} else if (accessTokenExpiredTime < Date.now()) {
		// when access token is expired
		await resfreshApiAction();
	}
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			let response;
			let timeline;
			response = await tigrowApi.get(`accounts`, headers);
			try {
				timeline = await tigrowApi.get(`accounts/timeline`, headers);
				timeline = timeline.data.user.timeline;
			} catch (error) {
				// tslint:disable-next-line: no-console
				console.log(error);
			}
			response = { ...response.data.user, timeline };
			accessToken = localStorage.getItem('tigrow_acc_id');
			accessTokenExpiredTime = (parseJwt(accessToken) * 1000) - 1000;
			const accessTokenRemainingTime = accessTokenExpiredTime - Date.now();
			setTimeout(resfreshApiAction, accessTokenRemainingTime);
			dispatch({ type: FETCH_USER, payload: response });
		} else {
			dispatch({ type: USER_FETCH_ERROR, payload: 'error in user fetching' });
		}
	} catch (error) {
		// tslint:disable-next-line: no-console
		console.log(error);
	}
};

export const logoutAction = (routeHistory: History) => async (dispatch: any) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			const refreshToken = typeof window !== undefined && localStorage.getItem('tigrow_real_id') ?
				JSON.parse(localStorage.getItem('tigrow_real_id')!) : null;
			const response = await tigrowApi.post(`accounts/logout`, {
				refreshToken
			}, headers);
			if (isEqual(response.status, 200)) {
				localStorage.removeItem('tigrow_acc_id');
				localStorage.removeItem('tigrow_real_id');
				await dispatch({ type: CLEAR_COMPANY_REDUCER_STATE });
				await dispatch({ type: CLEAR_ROOMS_REDUCER_STATE });
				await dispatch({ type: CLEAR_PROJECT_REDUCER_STATE });
				await dispatch({ type: CLEAR_USER_REDUCER_STATE });
				routeHistory.push('/signin');
			}
		} else {
			// tslint:disable-next-line: no-console
			console.log('No token found in logout action');
		}
	} catch (error) {
		// tslint:disable-next-line: no-console
		console.log('error in logout', error);
	}
};

export const resendMailForSignup = async (email?: string) => {
	try {
		const requestData = {
			email: email ? email : JSON.parse(localStorage.getItem('email')!),
			resentType: 'verify-account'
		};
		const response = await tigrowApi.post('accounts/resend-email', requestData, {
			'Content-Type': 'application/json'
		} as AxiosRequestConfig);
		return errorMessgeHandler(response);
	} catch (error) {
		return errorMessgeHandler(error);
	}
};
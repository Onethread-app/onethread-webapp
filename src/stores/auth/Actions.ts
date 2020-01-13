import tigrowApi from 'tigrowApi';
import { AxiosRequestConfig } from 'axios';
import { History } from 'history';
import { isEqual } from 'lodash';
import { tokenConfig, awsImageOption } from '../UtilsActions';
import { FETCH_USER, USER_FETCH_ERROR, CLEAR_USER_REDUCER_STATE } from 'stores/user/Types';
import { CLEAR_ROOMS_REDUCER_STATE } from 'stores/room/Types';
import { CLEAR_COMPANY_REDUCER_STATE } from 'stores/company/Types';
import { errorMessgeHandler } from 'components/final-form/utils';

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
		localStorage.setItem('token', JSON.stringify(response.data.token));
		return	errorMessgeHandler(response);
	} catch (error) {
		return	errorMessgeHandler(error);
	}
};

export const loginAction = (loginUser: LoginModel) => async (dispatch: any) => {
	try {
		const response = await tigrowApi.post('accounts/login', loginUser, {
			'Content-Type': 'application/json'
		} as AxiosRequestConfig);
		await localStorage.setItem('token', JSON.stringify(response.data.token));
		return	errorMessgeHandler(response);
	} catch (error) {
		return	errorMessgeHandler(error);
	}
};

export const fetchUserAction = () => async (dispatch: any) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			const response = await tigrowApi.get(`accounts`, headers);
			let updatedUserInfo = response.data.user;
			if (updatedUserInfo.profileImage) {
				const awsOptions = awsImageOption(updatedUserInfo.profileImage);
				const imgRes = await tigrowApi.get(`files/show-file`, awsOptions);
				updatedUserInfo = {
					...updatedUserInfo,
					profileImage: {
						...updatedUserInfo.profileImage,
						imageSource: imgRes.data
					}
				};
			}
			dispatch({ type: FETCH_USER, payload: updatedUserInfo });
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
			const response = await tigrowApi.get(`accounts/logout`, headers);
			if (isEqual(response.status, 200)) {
				await localStorage.removeItem('token');
				await dispatch({ type: CLEAR_COMPANY_REDUCER_STATE });
				await dispatch({ type: CLEAR_ROOMS_REDUCER_STATE });
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
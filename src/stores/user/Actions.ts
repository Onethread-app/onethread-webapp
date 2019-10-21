import { USER_FETCH_LOADING, USER_FETCH_ERROR, EDIT_BASIC_INFO, ADD_EXPERIENCE, EDIT_BASIC_INFO_ERROR } from './Types';
import { tokenConfig } from 'stores/UtilsActions';
import { isEqual } from "lodash";
import tigrowApi from 'tigrowApi';

export const editUserInfoAction = (basicInfo: any) => async (dispatch: any, getState: any) => {
	try {
		console.log(basicInfo)
		const headers = tokenConfig(getState);
		if ((headers as any).headers.Authorization) {
			dispatch({ type: USER_FETCH_LOADING });
			await tigrowApi.put(`/account/update`, basicInfo, headers);
			dispatch({ type: EDIT_BASIC_INFO, payload: basicInfo });
		} else {
			dispatch({ type: USER_FETCH_ERROR, payload: "error in user fetching" });
		}
	} catch (error) {
		if (isEqual(error.message, 'Network Error')) {
			dispatch({ type: EDIT_BASIC_INFO_ERROR, payload: 'Network error' });
		} else if (error.response.status === 401) {
			dispatch({ type: EDIT_BASIC_INFO_ERROR, payload: 'Unauthorized user. Please enter valid email and password.' });
		} else {
			console.log(error.response);
		}
	}
};

export const addJobExperienceAction = (jobExperienceInfo: any) => async (dispatch: any, getState: any) => {
	console.log('ex', jobExperienceInfo);
	try {
		const headers = tokenConfig(getState);
		if ((headers as any).headers.Authorization) {
			const response = await tigrowApi.post(
				"job/create-job-experience",
				jobExperienceInfo,
				headers
			);
			console.log('exp-job', response.data);
			dispatch({ type: ADD_EXPERIENCE, payload: response.data.data });
		} else {
			console.log("token error")
		}
	} catch (error) {
		console.log(error.response)
	}
}

export const addEducationExperienceAction = (educationExperienceInfo: any) => async (dispatch: any, getState: any) => {
	console.log('ex', educationExperienceInfo);
	try {
		const headers = tokenConfig(getState);
		if ((headers as any).headers.Authorization) {
			const response = await tigrowApi.post(
				"education/add-education",
				educationExperienceInfo,
				headers
			);
			console.log('exp-edu', response.data.data);
			dispatch({ type: ADD_EXPERIENCE, payload: response.data.data });
		} else {
			console.log("token error")
		}
	} catch (error) {
		console.log(error.response)
	}
}

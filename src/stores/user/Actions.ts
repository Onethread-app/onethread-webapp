import { USER_FETCH_LOADING, USER_FETCH_ERROR, EDIT_BASIC_INFO, ADD_EXPERIENCE, EDIT_BASIC_INFO_ERROR, USER_COMPANIES_UPDATE, ADD_SKILL } from './Types';
import { tokenConfig } from 'stores/UtilsActions';
import { isEqual } from "lodash";
import tigrowApi from 'tigrowApi';
import { User } from './Reducer';

export const editUserInfoAction = (basicInfo: User) => async (dispatch: any, getState: any) => {
	try {
		const headers = tokenConfig(getState);
		if ((headers as any).headers.Authorization) {
			dispatch({ type: USER_FETCH_LOADING });
			let user = {};
			if (basicInfo.contactNo) {
				user = {
					...basicInfo,
					contactNo: `880${basicInfo.contactNo}`
				};
			} else {
				user = basicInfo
			}
			await tigrowApi.put(`/account/update`, user, headers);
			dispatch({ type: EDIT_BASIC_INFO, payload: user });
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

export const addSkillAction = (skill: User) => async (dispatch: any, getState: any) => {
	try {
		const headers = tokenConfig(getState);
		if ((headers as any).headers.Authorization) {
			const response = await tigrowApi.put(`/skill/update-skill`, skill, headers);
			dispatch({ type: ADD_SKILL, payload: response.data.skillList });
		} else {
			console.log("error in user fetching");
		}
	} catch (error) {
		if (isEqual(error.message, 'Network Error')) {
			console.log('Network error');
		} else {
			console.log(error.response);
		}
	}
};

export const addJobExperienceAction = (jobExperienceInfo: any) => async (dispatch: any, getState: any) => {
	try {
		const headers = tokenConfig(getState);
		if ((headers as any).headers.Authorization) {
			const response = await tigrowApi.post(
				"job/create-job-experience",
				jobExperienceInfo,
				headers
			);
			const timelineResponse = response.data.data;
			const timeline = getState().userReducer.user.timeline;
			timeline.push(timelineResponse)
			const timelineSort = timeline.sort((a: any, b: any) =>
				a.startYear < b.startYear ? 1 : -1,
			);
			dispatch({ type: ADD_EXPERIENCE, payload: timelineSort });
		} else {
			console.log("token error")
		}
	} catch (error) {
		console.log(error.response)
	}
}

export const addEducationExperienceAction = (educationExperienceInfo: any) => async (dispatch: any, getState: any) => {
	try {
		const headers = tokenConfig(getState);
		if ((headers as any).headers.Authorization) {
			const response = await tigrowApi.post(
				"education/add-education",
				educationExperienceInfo,
				headers
			);
			const timelineResponse = response.data.data;
			const timeline = getState().userReducer.user.timeline;
			timeline.push(timelineResponse)
			const timelineSort = timeline.sort((a: any, b: any) =>
				a.startYear < b.startYear ? 1 : -1,
			);
			dispatch({ type: ADD_EXPERIENCE, payload: timelineSort });
		} else {
			console.log("token error")
		}
	} catch (error) {
		console.log(error.response)
	}
}

export const getAllCompaniesByUserId = (userId: string) => async (dispatch: any, getState: any) => {
	try {
		const headers = tokenConfig(getState);
		if ((headers as any).headers.Authorization) {
			const response = await tigrowApi.get(`/company/individual/${userId}`, headers);
			dispatch({ type: USER_COMPANIES_UPDATE, payload: response.data });
		} else {
			console.log("error in get company list by user")
		}
	} catch (error) {
		console.log(error.response);
	}
}

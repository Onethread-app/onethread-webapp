import { isEqual } from 'lodash';
import { History } from 'history';
import { tokenConfig } from '../UtilsActions';
import { CompanyModel } from 'stores/company/Reducer';
import {
	CREATE_COMPANY,
	CREATE_COMPANY_ERROR,
	GET_COMPANY_DETAILS,
	ADD_TEAM_MEMBERS_ERROR,
	ADD_DEPARTMENT,
	ADD_DEPARTMENT_ERROR,
	COMPANY_DEPARTMENT_LOADING,
	GET_ALL_COMPANY_MEMBERS,
	COMPANY_REDUCER_LOADING,
	COMPANY_REDUCER_LOADING_FALSE,
	GET_ALL_DEPARTMENT,
	EDIT_COMPANY_INFO,
	CHANGE_COMPANY_NAME_ERROR,
	CHANGE_COMPANY_NAME,
	CLEAR_CHANGE_COMPANY_NAME_ERROR,
	CHANGE_COMPANY_NAME_LOADING,
	CLEAR_ADD_DEPARTMENT_ERROR,
	ADD_DEPARTMENT_LOADING,
	COMPANY_DESIGNATION_LOADING,
	ADD_DESIGNATION,
	ADD_DESIGNATION_ERROR,
	EDIT_DESIGNATION,
	EDIT_DESIGNATION_ERROR,
	LOGO_UPLOAD,
	CHANGE_MEMBER_ROLE,
	CHANGE_MEMBER_ROLE_ERROR
} from './Types';
import { CLEAR_ROOMS_REDUCER_STATE } from 'stores/room/Types';
import { errorMessgeHandler } from 'components/final-form/utils';
import { tigrowApi } from 'config';
import { ItemEntityProps } from 'components/fields/SuggestField';

export const getCompanyDetails = (name: string) => async (dispatch: any, getState: any) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			const response = await tigrowApi.get(`company/${name}`, headers);
			dispatch({ type: GET_COMPANY_DETAILS, payload: response.data.company });
			dispatch({ type: CLEAR_ROOMS_REDUCER_STATE });
			return response;
		} else {
			// tslint:disable-next-line: no-console
			console.log('error in selection of company fetching');
		}
	} catch (error) {
		if (isEqual(error.message, 'Network Error')) {
			dispatch({ type: CREATE_COMPANY_ERROR, payload: 'Network error' });
			// tslint:disable-next-line: no-console
			console.log('network error');
		} else {
			// tslint:disable-next-line: no-console
			console.log(error.response);
			return error.response;

		}
	}
};

export const createCompanyAction = (
	companyData: CompanyModel,
	routeHistory: History
) => async (dispatch: any, getState: any) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			const response = await tigrowApi.post(`company`, companyData, headers);
			dispatch({ type: CLEAR_ROOMS_REDUCER_STATE });
			dispatch({ type: CREATE_COMPANY, payload: response.data });
			routeHistory.push(`/company/${response.data.company.name}`);
			return response.data;
		} else {
			// tslint:disable-next-line: no-console
			console.log('error in creation of company');
		}
	} catch (error) {
		if (isEqual(error.message, 'Network Error')) {
			dispatch({
				type: CREATE_COMPANY_ERROR,
				payload: {
					message: 'Network error',
					network: true
				}
			});
		} else if (error.response.status === 409) {
			dispatch({
				type: CREATE_COMPANY_ERROR,
				payload: {
					message: 'Duplicate Company Name',
					network: false
				}
			});
		} else {
			// tslint:disable-next-line: no-console
			console.log(error.response);
		}
	}
};

export const getCompanyMembers = () => async (dispatch: any, getState: any) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			const companyName = getState().companyReducer.currentCompany.name;
			dispatch({ type: COMPANY_REDUCER_LOADING });
			const response = await tigrowApi.get(
				`company/${companyName}/members?limit=100`,
				headers
			);
			dispatch({ type: GET_ALL_COMPANY_MEMBERS, payload: response.data });
		} else {
			// tslint:disable-next-line: no-console
			console.log('error in selection of company fetching');
		}
	} catch (error) {
		if (isEqual(error.message, 'Network Error')) {
			dispatch({ type: ADD_TEAM_MEMBERS_ERROR, payload: 'Network error' });
		} else {
			// tslint:disable-next-line: no-console
			console.log(error.response);
		}
	}
};

export const addTeamMembers =
	(members: any, newTeamMembers: string[], companyName: string) => async (
		dispatch: any,
		getState: any
	) => {
		try {
			const headers = tokenConfig();
			if ((headers as any).headers.Authorization) {
				dispatch({ type: COMPANY_REDUCER_LOADING });
				console.log('req', { members, newTeamMembers });
				const response = await tigrowApi.post(
					`company/${companyName}/members`,
					{ members, newTeamMembers },
					headers
				);
				console.log('response', response);
				dispatch({ type: COMPANY_REDUCER_LOADING_FALSE });
				// dispatch({ type: ADD_TEAM_MEMBERS, payload: response.data });
			} else {
				// tslint:disable-next-line: no-console
				console.log('error in selection of company fetching');
			}
		} catch (error) {
			if (isEqual(error.message, 'Network Error')) {
				dispatch({ type: ADD_TEAM_MEMBERS_ERROR, payload: 'Network error' });
			} else {
				// tslint:disable-next-line: no-console
				console.log(error.response);
			}
		}
	};

export const addDepartment = (name: string) => async (
	dispatch: any,
	getState: any
) => {
	try {
		const headers = tokenConfig();
		let response;
		if ((headers as any).headers.Authorization) {
			dispatch({ type: ADD_DEPARTMENT_LOADING });
			const company = getState().companyReducer.currentCompany.name;
			response = await tigrowApi.post(
				`company/${company}/departments`,
				{ name },
				headers
			);
			dispatch({ type: ADD_DEPARTMENT, payload: response.data });
		} else {
			// tslint:disable-next-line: no-console
			console.log('error in adding department');
		}
		return errorMessgeHandler(response);
	} catch (error) {
		return errorMessgeHandler(error);
	}
};

export const clearAddDepartmentError = () => async (dispatch: any) => {
	dispatch({ type: CLEAR_ADD_DEPARTMENT_ERROR });
};

export const getAllDepartments = () => async (dispatch: any, getState: any) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			dispatch({ type: COMPANY_DEPARTMENT_LOADING });
			const company = getState().companyReducer.currentCompany.name;
			const response = await tigrowApi.get(
				`company/${company}/departments`,
				headers
			);
			dispatch({ type: GET_ALL_DEPARTMENT, payload: response.data });
		} else {
			// tslint:disable-next-line: no-console
			console.log('error in adding department');
		}
	} catch (error) {
		if (isEqual(error.message, 'Network Error')) {
			dispatch({ type: ADD_DEPARTMENT_ERROR, payload: 'Network error' });
		} else if (error.response.status === 401) {
			dispatch({ type: ADD_DEPARTMENT_ERROR, payload: 'Unauthorized user.' });
		} else {
			// tslint:disable-next-line: no-console
			console.log(error.response);
		}
	}
};

export const editCompanyInfoAction = (companyInfo: CompanyModel) => async (
	dispatch: any,
	getState: any
) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			const company = getState().companyReducer.currentCompany.name;
			await tigrowApi.put(`company/${company}/basic`, companyInfo, headers);
			dispatch({ type: EDIT_COMPANY_INFO, payload: companyInfo });
		} else {
			// tslint:disable-next-line: no-console
			console.log('error in user fetching');
		}
	} catch (error) {
		// tslint:disable-next-line: no-console
		console.log(error);
		if (isEqual(error.message, 'Network Error')) {
			// tslint:disable-next-line: no-console
			console.log('Network error');
		} else {
			// tslint:disable-next-line: no-console
			console.log(error.response);
		}
	}
};

export const editCompanyAboutAction = (companyAbout: string) => async (
	dispatch: any,
	getState: any
) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			const company = getState().companyReducer.currentCompany.name;
			await tigrowApi.put(
				`company/${company}/about`,
				{ about: companyAbout },
				headers
			);
			dispatch({ type: EDIT_COMPANY_INFO, payload: { about: companyAbout } });
		} else {
			// tslint:disable-next-line: no-console
			console.log('error in user fetching');
		}
	} catch (error) {
		if (isEqual(error.message, 'Network Error')) {
			// tslint:disable-next-line: no-console
			console.log('Network error');
		} else {
			// tslint:disable-next-line: no-console
			console.log(error.response);
		}
	}
};

export const changeCompanyName = (companyName: string) => async (
	dispatch: any,
	getState: any
) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			dispatch({ type: CHANGE_COMPANY_NAME_LOADING });
			const company = getState().companyReducer.currentCompany.name;
			const response = await tigrowApi.put(
				`company/${company}/changeName`,
				{ name: companyName },
				headers
			);
			if (isEqual(response.status, 200)) {
				dispatch({ type: CHANGE_COMPANY_NAME, payload: companyName });
				return response.data;
			}
		} else {
			// tslint:disable-next-line: no-console
			console.log('error in changing Company Name');
		}
	} catch (error) {
		if (isEqual(error.message, 'Network Error')) {
			// tslint:disable-next-line: no-console
			console.log('Network error');
		} else if (error.response.status === 409) {
			dispatch({
				type: CHANGE_COMPANY_NAME_ERROR,
				payload: 'Name already exist'
			});
		} else {
			// tslint:disable-next-line: no-console
			console.log(error.response);
		}
	}
};

export const clearChangeCompanyNameError = () => async (dispatch: any) => {
	dispatch({ type: CLEAR_CHANGE_COMPANY_NAME_ERROR });
};

export const companyLogoUploadAction = (imageSelected: any) => async (dispatch: any, getState: any) => {
	try {
		const headers = tokenConfig();
		const companyId = getState().companyReducer.currentCompany._id;
		if ((headers as any).headers.Authorization) {
			const response = await tigrowApi.post(`files/company-logo?cid=${companyId}`, imageSelected, headers);
			dispatch({ type: LOGO_UPLOAD, payload: { ...response.data, link: response.data.link } });
			return response.data;
		} else {
			// tslint:disable-next-line: no-console
			console.log('no headers');
		}
	} catch (error) {
		if (isEqual(error.message, 'Network Error')) {
			// tslint:disable-next-line: no-console
			console.log('network error');
		} else {
			// tslint:disable-next-line: no-console
			console.log(error.response);
		}
	}
};

export const addDesignation = (values: any, memberId: string) => async (
	dispatch: any,
	getState: any
) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			dispatch({ type: COMPANY_DESIGNATION_LOADING });
			const company = getState().companyReducer.currentCompany.name;
			const response = await tigrowApi.post(
				`company/${company}/designations/${memberId}`,
				values,
				headers
			);
			dispatch({ type: ADD_DESIGNATION });
			return response.status;
		} else {
			// tslint:disable-next-line: no-console
			console.log('error in adding designation');
		}
	} catch (error) {
		if (isEqual(error.message, 'Network Error')) {
			dispatch({ type: ADD_DESIGNATION_ERROR, payload: 'Network error' });
		} else if (error.response.status === 401) {
			dispatch({ type: ADD_DESIGNATION_ERROR, payload: 'Unauthorized user.' });
		} else {
			// tslint:disable-next-line: no-console
			console.log(error.response);
		}
		return error.response.status;
	}
};

export const editDesignation = (values: any, memberId: string) => async (
	dispatch: any,
	getState: any
) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			dispatch({ type: COMPANY_DESIGNATION_LOADING });
			const company = getState().companyReducer.currentCompany.name;
			const response = await tigrowApi.put(
				`company/${company}/designations/${memberId}`,
				values,
				headers
			);
			dispatch({ type: EDIT_DESIGNATION });
			return response.status;
		} else {
			// tslint:disable-next-line: no-console
			console.log('error in adding designation');
		}
	} catch (error) {
		if (isEqual(error.message, 'Network Error')) {
			dispatch({ type: EDIT_DESIGNATION_ERROR, payload: 'Network error' });
		} else if (error.response.status === 401) {
			dispatch({ type: EDIT_DESIGNATION_ERROR, payload: 'Unauthorized user.' });
		} else {
			// tslint:disable-next-line: no-console
			console.log(error.response);
		}
		return error.response.status;
	}
};

export const changeMemberRole = (values: { role: string }, memberId: string) => async (
	dispatch: any,
	getState: any
) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			const company = getState().companyReducer.currentCompany.name;
			const response = await tigrowApi.put(
				`/company/${company}/members/${memberId}/changeRole`,
				values,
				headers
			);
			dispatch({ type: CHANGE_MEMBER_ROLE, payload: { memberId, role: values.role } });
			return response.status;
		} else {
			// tslint:disable-next-line: no-console
			console.log('error in changing member role');
		}
	} catch (error) {
		if (isEqual(error.message, 'Network Error')) {
			dispatch({ type: CHANGE_MEMBER_ROLE_ERROR, payload: 'Network error' });
		} else if (error.response.status === 401) {
			dispatch({ type: CHANGE_MEMBER_ROLE_ERROR, payload: 'Unauthorized user.' });
		} else {
			// tslint:disable-next-line: no-console
			console.log(error.response);
		}
		return error.response.status;
	}
};
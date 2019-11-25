import tigrowApi from "tigrowApi";
import { isEqual } from "lodash";
import { History } from "history";
import { tokenConfig, awsImageOption } from "../UtilsActions";
import { CompanyModel } from "stores/company/Reducer";
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
	LOGO_UPLOAD
} from "./Types";
import { CLEAR_ROOMS_REDUCER_STATE } from "stores/room/Types";

export const getCompanyDetails = (name: string) => async (dispatch: any, getState: any) => {
	try {
		const headers = tokenConfig(getState);
		if ((headers as any).headers.Authorization) {
			const response = await tigrowApi.get(`/company/${name}`, headers);
			dispatch({ type: GET_COMPANY_DETAILS, payload: response.data });
			dispatch({ type: CLEAR_ROOMS_REDUCER_STATE });
			const storeObject = getState();
			if (storeObject.companyReducer.currentCompany.logo) {
				const awsOptions = awsImageOption(storeObject.companyReducer.currentCompany.logo)
				const imgRes = await tigrowApi.get(`files/show-file`, awsOptions);
				dispatch({ type: LOGO_UPLOAD, payload: { imageSource: imgRes.data } })
			}
			return response.data;
		} else {
			console.log("error in slection of company fetching")
		}
	} catch (error) {
		if (isEqual(error.message, "Network Error")) {
			dispatch({ type: CREATE_COMPANY_ERROR, payload: "Network error" });
		} else {
			console.log(error.response);
		}
	}
}

export const createCompanyAction = (
	companyData: CompanyModel,
	routeHistory: History
) => async (dispatch: any, getState: any) => {
	try {
		const headers = tokenConfig(getState);
		if ((headers as any).headers.Authorization) {
			const response = await tigrowApi.post(`/company`, companyData, headers);
			dispatch({ type: CREATE_COMPANY, payload: response.data });
			routeHistory.push(`/company/${response.data.company.name}`);
			return response.data;
		} else {
			console.log("error in creation of company");
		}
	} catch (error) {
		if (isEqual(error.message, "Network Error")) {
			dispatch({
				type: CREATE_COMPANY_ERROR,
				payload: {
					message: "Network error",
					network: true
				}
			});
		} else if (error.response.status === 409) {
			dispatch({
				type: CREATE_COMPANY_ERROR,
				payload: {
					message: "Duplicate Company Name",
					network: false
				}
			});
		} else {
			console.log(error.response);
		}
	}
};

export const getCompanyMembers = () => async (dispatch: any, getState: any) => {
	try {
		const headers = tokenConfig(getState);
		if ((headers as any).headers.Authorization) {
			let companyName = getState().companyReducer.currentCompany.name;
			dispatch({ type: COMPANY_REDUCER_LOADING });
			const response = await tigrowApi.get(
				`company/${companyName}/members?limit=100`,
				headers
			);
			dispatch({ type: GET_ALL_COMPANY_MEMBERS, payload: response.data });
		} else {
			console.log("error in selection of company fetching");
		}
	} catch (error) {
		if (isEqual(error.message, "Network Error")) {
			dispatch({ type: ADD_TEAM_MEMBERS_ERROR, payload: "Network error" });
		} else {
			console.log(error.response);
		}
	}
};

export const addTeamMembers = (members: any, companyName: string) => async (
	dispatch: any,
	getState: any
) => {
	try {
		const headers = tokenConfig(getState);
		if ((headers as any).headers.Authorization) {
			dispatch({ type: COMPANY_REDUCER_LOADING });
			await tigrowApi.post(
				`company/${companyName}/members`,
				{ members },
				headers
			);
			dispatch({ type: COMPANY_REDUCER_LOADING_FALSE });
			// dispatch({ type: ADD_TEAM_MEMBERS, payload: response.data });
		} else {
			console.log("error in selection of company fetching");
		}
	} catch (error) {
		if (isEqual(error.message, "Network Error")) {
			dispatch({ type: ADD_TEAM_MEMBERS_ERROR, payload: "Network error" });
		} else {
			console.log(error.response);
		}
	}
};

export const addDepartment = (name: string) => async (
	dispatch: any,
	getState: any
) => {
	try {
		const headers = tokenConfig(getState);
		if ((headers as any).headers.Authorization) {
			dispatch({ type: ADD_DEPARTMENT_LOADING });
			let company = getState().companyReducer.currentCompany.name;
			const response = await tigrowApi.post(
				`/company/${company}/departments`,
				{ name },
				headers
			);
			dispatch({ type: ADD_DEPARTMENT, payload: response.data });
			return response.data;
		} else {
			console.log("error in adding department");
		}
	} catch (error) {
		if (isEqual(error.message, "Network Error")) {
			console.log("Network error");
		} else if (error.response.status === 401) {
			dispatch({ type: ADD_DEPARTMENT_ERROR, payload: "Unauthorized user." });
		} else if (error.response.status === 409) {
			dispatch({
				type: ADD_DEPARTMENT_ERROR,
				payload: "Department already exists"
			});
		} else {
			console.log(error.response);
		}
	}
};

export const clearAddDepartmentError = () => async (dispatch: any) => {
	dispatch({ type: CLEAR_ADD_DEPARTMENT_ERROR });
};

export const getAllDepartments = () => async (dispatch: any, getState: any) => {
	try {
		const headers = tokenConfig(getState);
		if ((headers as any).headers.Authorization) {
			dispatch({ type: COMPANY_DEPARTMENT_LOADING });
			let company = getState().companyReducer.currentCompany.name;
			const response = await tigrowApi.get(
				`/company/${company}/departments`,
				headers
			);
			dispatch({ type: GET_ALL_DEPARTMENT, payload: response.data });
		} else {
			console.log("error in adding department");
		}
	} catch (error) {
		if (isEqual(error.message, "Network Error")) {
			dispatch({ type: ADD_DEPARTMENT_ERROR, payload: "Network error" });
		} else if (error.response.status === 401) {
			dispatch({ type: ADD_DEPARTMENT_ERROR, payload: "Unauthorized user." });
		} else {
			console.log(error.response);
		}
	}
};

export const editCompanyInfoAction = (companyInfo: CompanyModel) => async (
	dispatch: any,
	getState: any
) => {
	try {
		const headers = tokenConfig(getState);
		if ((headers as any).headers.Authorization) {
			let company = getState().companyReducer.currentCompany.name;
			await tigrowApi.put(`company/${company}/basic`, companyInfo, headers);
			dispatch({ type: EDIT_COMPANY_INFO, payload: companyInfo });
		} else {
			console.log("error in user fetching");
		}
	} catch (error) {
		console.log(error);
		if (isEqual(error.message, "Network Error")) {
			console.log("Network error");
		} else {
			console.log(error.response);
		}
	}
};

export const editCompanyAboutAction = (companyAbout: string) => async (
	dispatch: any,
	getState: any
) => {
	try {
		const headers = tokenConfig(getState);
		if ((headers as any).headers.Authorization) {
			let company = getState().companyReducer.currentCompany.name;
			await tigrowApi.put(
				`company/${company}/about`,
				{ about: companyAbout },
				headers
			);
			dispatch({ type: EDIT_COMPANY_INFO, payload: { about: companyAbout } });
		} else {
			console.log("error in user fetching");
		}
	} catch (error) {
		console.log(error);
		if (isEqual(error.message, "Network Error")) {
			console.log("Network error");
		} else {
			console.log(error.response);
		}
	}
};

export const changeCompanyName = (companyName: string) => async (
	dispatch: any,
	getState: any
) => {
	try {
		const headers = tokenConfig(getState);
		if ((headers as any).headers.Authorization) {
			dispatch({ type: CHANGE_COMPANY_NAME_LOADING });
			let company = getState().companyReducer.currentCompany.name;
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
			console.log("error in changing Company Name");
		}
	} catch (error) {
		if (isEqual(error.message, "Network Error")) {
			console.log("Network error");
		} else if (error.response.status === 409) {
			dispatch({
				type: CHANGE_COMPANY_NAME_ERROR,
				payload: "Name already exist"
			});
		} else {
			console.log(error.response);
		}
	}
};

export const clearChangeCompanyNameError = () => async (dispatch: any) => {
	dispatch({ type: CLEAR_CHANGE_COMPANY_NAME_ERROR });
}

export const companyLogoUploadAction = (imageSelected: any) => async (dispatch: any, getState: any) => {
	try {
		const headers = tokenConfig(getState);
		const companyId = getState().companyReducer.currentCompany._id;
		if ((headers as any).headers.Authorization) {
			const response = await tigrowApi.post(`files/company-logo?cid=${companyId}`, imageSelected, headers);
			const awsOptions = awsImageOption(response.data);
			const imgRes = await tigrowApi.get(`files/show-file`, awsOptions);
			dispatch({ type: LOGO_UPLOAD, payload: { imageSource: imgRes.data } })
			return imgRes.data;
		} else {
			console.log('no headers')
		}
	} catch (error) {
		if (isEqual(error.message, 'Network Error')) {
			console.log('network error')
		}
		else {
			console.log(error.response);
		}
	}
}

export const addDesignation = (values: any, memberId: string) => async (
	dispatch: any,
	getState: any
) => {
	try {
		const headers = tokenConfig(getState);
		if ((headers as any).headers.Authorization) {
			dispatch({ type: COMPANY_DESIGNATION_LOADING });
			let company = getState().companyReducer.currentCompany.name;
			const response = await tigrowApi.post(
				`/company/${company}/designations/${memberId}`,
				values,
				headers
			);
			dispatch({ type: ADD_DESIGNATION });
			return response.status;
		} else {
			console.log("error in adding designation");
		}
	} catch (error) {
		if (isEqual(error.message, "Network Error")) {
			dispatch({ type: ADD_DESIGNATION_ERROR, payload: "Network error" });
		} else if (error.response.status === 401) {
			dispatch({ type: ADD_DESIGNATION_ERROR, payload: "Unauthorized user." });
		} else {
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
		const headers = tokenConfig(getState);
		if ((headers as any).headers.Authorization) {
			dispatch({ type: COMPANY_DESIGNATION_LOADING });
			let company = getState().companyReducer.currentCompany.name;
			const response = await tigrowApi.put(
				`/company/${company}/designations/${memberId}`,
				values,
				headers
			);
			dispatch({ type: EDIT_DESIGNATION });
			return response.status;
		} else {
			console.log("error in adding designation");
		}
	} catch (error) {
		if (isEqual(error.message, "Network Error")) {
			dispatch({ type: EDIT_DESIGNATION_ERROR, payload: "Network error" });
		} else if (error.response.status === 401) {
			dispatch({ type: EDIT_DESIGNATION_ERROR, payload: "Unauthorized user." });
		} else {
			console.log(error.response);
		}
		return error.response.status;
	}
};
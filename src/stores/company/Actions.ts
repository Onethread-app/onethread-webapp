
import tigrowApi from 'tigrowApi';
import { isEqual } from 'lodash';
import { History } from 'history';
import { tokenConfig, Entity } from '../UtilsActions';
import { CompanyModel } from 'stores/company/Reducer';
import { CREATE_COMPANY, CREATE_COMPANY_ERROR, GET_COMPANY_DETAILS, ADD_TEAM_MEMBERS_ERROR, ADD_DIVISION, ADD_DIVISION_ERROR, ADD_DEPARTMENT, ADD_DIVISION_LOADING, ADD_DEPARTMENT_ERROR, ADD_DEPARTMENT_LOADING } from './Types';
import { USER_COMPANIES_UPDATE } from 'stores/user/Types';

export const createCompanyAction = (companyData: CompanyModel, routeHistory: History) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig(getState);
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.post(`/company`, companyData, headers);
      dispatch({ type: CREATE_COMPANY, payload: response.data });
      dispatch({
        type: USER_COMPANIES_UPDATE, payload: {
          _id: response.data.company._id,
          name: response.data.company.name
        }
      });
      routeHistory.push(`/company/${response.data.company.name}`);
    } else {
      console.log("error in creation of company")
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({ type: CREATE_COMPANY_ERROR, payload: 'Network error' });
    } else if (error.response.status === 401) {
      dispatch({ type: CREATE_COMPANY_ERROR, payload: 'Unauthorized user. Please enter valid email and password.' });
    } else {
      console.log(error.response);
    }
  }
}


export const getCompanyDetails = (name: string) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig(getState);
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.get(`/company/${name}`, headers);
      dispatch({ type: GET_COMPANY_DETAILS, payload: response.data });
      return response.data;
    } else {
      console.log("error in slection of company fetching")
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({ type: CREATE_COMPANY_ERROR, payload: 'Network error' });
    } else {
      console.log(error.response);
    }
  }
}

export const addTeamMembers = (user: (string | undefined)[], name: string) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig(getState);
    let body = {
      "employees": user
    }
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.put(`company/${name}/employees`, body, headers);
      return response.data;
      // dispatch({ type: ADD_TEAM_MEMBERS, payload: response.data });
    } else {
      console.log("error in slection of company fetching")
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({ type: ADD_TEAM_MEMBERS_ERROR, payload: 'Network error' });
    } else {
      console.log(error.response);
    }
  }
}

export const addDivisionAction = (name: Entity) => async (dispatch: any, getState: any) => {

  try {
    const headers = tokenConfig(getState);
    if ((headers as any).headers.Authorization) {
      dispatch({ type: ADD_DIVISION_LOADING });
      let company = getState().companyReducer.currentCompany.name;
      const response = await tigrowApi.post(`/company/${company}/divisions`, name, headers);
      dispatch({ type: ADD_DIVISION, payload: response.data });
    } else {
      console.log("error in adding division")
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({ type: ADD_DIVISION_ERROR, payload: 'Network error' });
    } else if (error.response.status === 401) {
      dispatch({ type: ADD_DIVISION_ERROR, payload: 'Unauthorized user.' });
    } else {
      console.log(error.response);
    }
  }
}

export const addDepartmentAction = (name: Entity) => async (dispatch: any, getState: any) => {

  try {
    console.log(name)
    const headers = tokenConfig(getState);
    if ((headers as any).headers.Authorization) {
      dispatch({ type: ADD_DEPARTMENT_LOADING });
      let company = getState().companyReducer.currentCompany.name;
      const response = await tigrowApi.post(`/company/${company}/departments`, name, headers);
      dispatch({ type: ADD_DEPARTMENT, payload: response.data });
    } else {
      console.log("error in adding department")
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({ type: ADD_DEPARTMENT_ERROR, payload: 'Network error' });
    } else if (error.response.status === 401) {
      dispatch({ type: ADD_DEPARTMENT_ERROR, payload: 'Unauthorized user.' });
    } else {
      console.log(error.response);
    }
  }
}
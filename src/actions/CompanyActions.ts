
import tigrowApi from 'tigrowApi';
import { isEqual } from 'lodash';
import { CREATE_COMPANY, CREATE_COMPANY_ERROR, USER_COMPANIES_UPDATE, SELECT_COMPANY } from './Types';
import { History } from 'history';
import { tokenConfig } from './UtilsActions';
import { CompanyModel } from 'reducers/company/CompanyReducer';

export const createCompanyAction = (companyData: CompanyModel, routeHistory: History) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig(getState);
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.post(`/company`, companyData, headers);
      dispatch({ type: CREATE_COMPANY, payload: response.data });
      dispatch({ type: USER_COMPANIES_UPDATE, payload: { 
        _id: response.data.company._id, 
        name: response.data.company.name 
      }});
      routeHistory.push("/company");
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


export const selectCompanyAction = (id: string, routeHistory: History) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig(getState);
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.get(`/company/${id}`, headers);
      dispatch({ type: SELECT_COMPANY, payload: response.data });
      routeHistory.push("/company");
    } else {
      console.log("error in slection of company fetching")
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
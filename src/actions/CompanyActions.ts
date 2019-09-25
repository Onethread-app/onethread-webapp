
import tigrowApi from 'tigrowApi';
import { isEqual } from 'lodash';
import { CREATE_COMPANY, CREATE_COMPANY_ERROR } from './Types';
import { History } from 'history';
import { tokenConfig } from './UtilsActions';
import { CopmpanyModel } from 'reducers/CompanyReducer';

export const createCompanyAction = (companyData: CopmpanyModel, routeHistory: History) => async (dispatch: any, getState: any) => {
  try {
		const headers = tokenConfig(getState);
		if ((headers as any).headers.Authorization) {
			const response = await tigrowApi.post(`/company`,companyData, headers);
      routeHistory.push("/profile");
      dispatch({ type: CREATE_COMPANY, payload: response.data });
		} else {
      console.log("error in fetching")
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({ type: CREATE_COMPANY_ERROR, payload: 'Network error' });
    } else if (error.response.status === 401) {
      dispatch({ type:  CREATE_COMPANY_ERROR, payload: 'Unauthorized user. Please enter valid email and password.' });
    } else {
      console.log( error.response);
    }
  }
}

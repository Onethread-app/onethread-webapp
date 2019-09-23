// import { CompanyModel } from 'reducers/CompanyReducer';
// import tigrowApi from 'tigrowApi';
// import { AxiosRequestConfig } from 'axios';
import { EDIT_BASIC_INFO } from './Types';
// import { isEqual } from 'lodash';
// import { CREATE_COMPANY, CREATE_COMPANY_ERROR } from './Types';
// import { History } from 'history';

export const editInfoAction = (basicInfo: any) => async (dispatch: any) => {
  try {
    // const response = await tigrowApi.post(
    //   "account/login",
    //   companyData,
    //   {
    //     "Content-Type": "application/json",
    //   } as AxiosRequestConfig
    // );
    dispatch({ type: EDIT_BASIC_INFO, payload: basicInfo });
  } catch (error) {
  //   if (isEqual(error.message, 'Network Error')) {
  //     dispatch({ type: CREATE_COMPANY_ERROR, payload: 'Network error' });
  //   } else if (error.response.status === 401) {
  //     dispatch({ type:  CREATE_COMPANY_ERROR, payload: 'Unauthorized user. Please enter valid email and password.' });
  //   } else {
  //     console.log( error.response);
  //   }
  // }
  console.log(error.response)
}
}

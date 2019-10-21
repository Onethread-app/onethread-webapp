import { EDIT_BASIC_INFO, ADD_EXPERIENCE } from './Types';
import tigrowApi from 'tigrowApi';
import { tokenConfig } from 'stores/UtilsActions';

export const editUserInfoAction = (basicInfo: any) => async (dispatch: any) => {
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

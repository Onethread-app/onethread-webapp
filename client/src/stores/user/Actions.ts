import {
  USER_FETCH_ERROR,
  EDIT_BASIC_INFO,
  ADD_EXPERIENCE,
  USER_COMPANIES_UPDATE,
  ADD_SKILL,
  DELETE_SKILL,
  PROFILE_IMAGE_UPLOAD,
  COVER_IMAGE_UPLOAD,
  VIDEO_CONFERENCE,
  REFRESH_USER_INFO_START,
  REFRESH_USER_TOKEN_START,
  REFRESH_USER_INFO_FAILURE,
  REFRESH_USER_INFO_SUCCESS,
  TOKEN_VERIFY_START,
  TOKEN_VERIFY_SUCCESS,
  TOKEN_VERIFY_FAILURE,
  SAVE_USER_AUTHENTICATION_INFO_START,
  SAVE_USER_AUTHENTICATION_INFO_SUCCESS,
  SAVE_USER_AUTHENTICATION_INFO_FAILURE,
  REFRESH_USER_TOKEN_SUCCESS,
  REFRESH_USER_TOKEN_FAILURE,
  CLEAR_USER_REDUCER_STATE,
  USER_COMPANIES,
  UPDATE_USER_COMPANY_PROJECT_COUNT,
} from './Types';
import { tokenConfig } from 'stores/UtilsActions';
import { isEqual } from 'lodash';
import { User } from './Reducer';
import { errorMessgeHandler } from 'components/final-form/utils';
import { tigrowApi } from 'config';
import { SET_INITIAL_CURRENT_COMPANY } from 'stores/company/Types';
import { returnErrorText } from 'helpers/HandleSagaErrors';
import { UPDATE_USER_COMPANY_TASK_COUNT } from 'stores/user/Types';

export const editUserInfoAction =
  (basicInfo: User) => async (dispatch: any, getState: any) => {
    try {
      const headers = tokenConfig();
      let response;
      if ((headers as any).headers.Authorization) {
        let user = {};
        if (basicInfo.contactNo) {
          user = {
            ...basicInfo,
            contactNo: `+88${basicInfo.contactNo}`,
          };
        } else {
          user = basicInfo;
        }
        response = await tigrowApi.put(
          `accounts/update`,
          user,
          headers,
        );
        dispatch({ type: EDIT_BASIC_INFO, payload: user });
      } else {
        dispatch({
          type: USER_FETCH_ERROR,
          payload: 'error in user fetching',
        });
      }
      return errorMessgeHandler(response);
    } catch (error) {
      return errorMessgeHandler(error);
    }
  };

export const addSkillAction =
  (skillSet: string[]) => async (dispatch: any, getState: any) => {
    try {
      const headers = tokenConfig();
      if ((headers as any).headers.Authorization) {
        const req = { skillArea: skillSet };
        const response = await tigrowApi.put(
          `skills/update-skill`,
          req,
          headers,
        );
        dispatch({
          type: ADD_SKILL,
          payload: response.data.skillList,
        });
      } else {
        // tslint:disable-next-line: no-console
      }
    } catch (error: any) {
      if (isEqual(error.message, 'Network Error')) {
        // tslint:disable-next-line: no-console
      } else {
        // tslint:disable-next-line: no-console
      }
    }
  };

export const addJobExperienceAction =
  (jobExperienceInfo: any) =>
  async (dispatch: any, getState: any) => {
    try {
      const headers = tokenConfig();
      let response;
      if ((headers as any).headers.Authorization) {
        response = await tigrowApi.post(
          'jobs/create-job-experience',
          jobExperienceInfo,
          headers,
        );
        const timelineResponse = response.data.data;
        const timeline = getState().userReducer.user.timeline;
        timeline.push(timelineResponse);
        const timelineSort = timeline.sort((a: any, b: any) =>
          a.startYear < b.startYear ? 1 : -1,
        );
        dispatch({ type: ADD_EXPERIENCE, payload: timelineSort });
      } else {
        // tslint:disable-next-line: no-console
      }
      return errorMessgeHandler(response);
    } catch (error) {
      return errorMessgeHandler(error);
    }
  };

export const addEducationExperienceAction =
  (educationExperienceInfo: any) =>
  async (dispatch: any, getState: any) => {
    try {
      const headers = tokenConfig();
      let response;
      if ((headers as any).headers.Authorization) {
        response = await tigrowApi.post(
          'educations/add-education',
          educationExperienceInfo,
          headers,
        );
        const timelineResponse = response.data.data;
        const timeline = getState().userReducer.user.timeline;
        timeline.push(timelineResponse);
        const timelineSort = timeline.sort((a: any, b: any) =>
          a.startYear < b.startYear ? 1 : -1,
        );
        dispatch({ type: ADD_EXPERIENCE, payload: timelineSort });
      } else {
        // tslint:disable-next-line: no-console
      }
      return errorMessgeHandler(response);
    } catch (error) {
      return errorMessgeHandler(error);
    }
  };

export const getAllCompaniesByUserId =
  (userId: string, type?: string) =>
  async (dispatch: any, getState: any) => {
    try {
      dispatch({ type: USER_COMPANIES });
      const headers = tokenConfig();
      if ((headers as any).headers.Authorization) {
        const response = await tigrowApi.get(
          `company/individual`,
          headers,
        );
        dispatch({
          type: USER_COMPANIES_UPDATE,
          payload: response.data,
        });
        if (isEqual(type, 'home')) {
          dispatch({
            type: SET_INITIAL_CURRENT_COMPANY,
            payload:
              response.data.companies.length > 0
                ? response.data.companies[0]
                : null,
          });
        }
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      //
    }
  };
export const deleteSkillAction =
  (skill: string) => async (dispatch: any, getState: any) => {
    try {
      const headers = tokenConfig();
      if ((headers as any).headers.Authorization) {
        const response = await tigrowApi.delete(
          `skills/delete-skill?skillId=${skill}`,
          headers,
        );
        dispatch({
          type: DELETE_SKILL,
          payload: response.data.skillArea,
        });
      } else {
        // tslint:disable-next-line: no-console
      }
    } catch (error: any) {
      if (isEqual(error.message, 'Network Error')) {
        // tslint:disable-next-line: no-console
      } else {
        // tslint:disable-next-line: no-console
      }
    }
  };

export const editJobExperienceAction =
  (jobExperienceInfo: any, jobexperienceid: any) =>
  async (dispatch: any, getState: any) => {
    try {
      const headers = tokenConfig();
      let response;
      if ((headers as any).headers.Authorization) {
        response = await tigrowApi.put(
          `jobs/job-experience-update?jobexperienceid=${jobexperienceid}`,
          jobExperienceInfo,
          headers,
        );
        const timelineResponse = response.data.data;
        const timeline = getState().userReducer.user.timeline;
        const filteredTimeline = timeline.filter(
          (exp: any) => exp._id !== timelineResponse._id,
        );
        filteredTimeline.push(timelineResponse);
        const timelineSort = filteredTimeline.sort((a: any, b: any) =>
          a.startYear < b.startYear ? 1 : -1,
        );
        dispatch({ type: ADD_EXPERIENCE, payload: timelineSort });
      } else {
        // tslint:disable-next-line: no-console
      }
      return errorMessgeHandler(response);
    } catch (error) {
      return errorMessgeHandler(error);
    }
  };

export const editEducationExperienceAction =
  (educationExperienceInfo: any, educationexperienceid: any) =>
  async (dispatch: any, getState: any) => {
    try {
      const headers = tokenConfig();
      let response;
      if ((headers as any).headers.Authorization) {
        response = await tigrowApi.put(
          `educations/update-education?educationId=${educationexperienceid}`,
          educationExperienceInfo,
          headers,
        );
        const timelineResponse = response.data.data;
        const timeline = getState().userReducer.user.timeline;
        const filteredTimeline = timeline.filter(
          (exp: any) => exp._id !== timelineResponse._id,
        );
        filteredTimeline.push(timelineResponse);
        const timelineSort = filteredTimeline.sort((a: any, b: any) =>
          a.startYear < b.startYear ? 1 : -1,
        );
        dispatch({ type: ADD_EXPERIENCE, payload: timelineSort });
      } else {
        // tslint:disable-next-line: no-console
      }
      return errorMessgeHandler(response);
    } catch (error) {
      return errorMessgeHandler(error);
    }
  };

export const imageUploadAction =
  (imageSelected: any, type: string) =>
  async (dispatch: any, getState: any) => {
    try {
      const headers = tokenConfig();
      if ((headers as any).headers.Authorization) {
        const response = await tigrowApi.post(
          `files/upload?imageType=${type}`,
          imageSelected,
          headers,
        );

        if (response.data.imageType === 'profilePic') {
          dispatch({
            type: PROFILE_IMAGE_UPLOAD,
            payload: { ...response.data, link: response.data.link },
          });
        } else if (response.data.imageType === 'coverPhoto') {
          dispatch({
            type: COVER_IMAGE_UPLOAD,
            payload: { ...response.data, link: response.data.link },
          });
        }
        return response.data;
      } else {
        // tslint:disable-next-line: no-console
      }
    } catch (error: any) {
      if (isEqual(error.message, 'Network Error')) {
        // tslint:disable-next-line: no-console
      } else {
        // tslint:disable-next-line: no-console
      }
    }
  };
export const getAllVideoHistory =
  () => async (dispatch: any, getState: any) => {
    try {
      const headers = tokenConfig();
      if ((headers as any).headers.Authorization) {
        const response = await tigrowApi.get(
          `video-conferences/get-conferences`,
          headers,
        );
        dispatch({
          type: VIDEO_CONFERENCE,
          payload: response.data.records,
        });
      } else {
        // tslint:disable-next-line: no-console
        //
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      //
    }
  };

export const refreshUserInfoStart = () => ({
  type: REFRESH_USER_INFO_START,
});

export const refreshUserInfoSuccess = (response) => ({
  type: REFRESH_USER_INFO_SUCCESS,
  payload: response,
});

export const refreshUserInfoFailure = (response: string) => ({
  type: REFRESH_USER_INFO_FAILURE,
  payload: response,
});

export const verifyUserTokenStart = (token: string) => ({
  type: TOKEN_VERIFY_START,
  payload: token,
});

export const verifyUserTokenSuccess = (response) => ({
  type: TOKEN_VERIFY_SUCCESS,
  payload: response,
});

export const verifyUserTokenFailure = (response: string) => ({
  type: TOKEN_VERIFY_FAILURE,
  payload: response,
});

export const updateUserTokenStart = (response: string) => ({
  type: REFRESH_USER_TOKEN_START,
  payload: response,
});

export const updateUserTokenSuccess = () => ({
  type: REFRESH_USER_TOKEN_SUCCESS,
});

export const updateUserTokenFailure = (response: string) => ({
  type: REFRESH_USER_TOKEN_FAILURE,
  payload: response,
});

export const updateUserAuthInfoStart = ({ userInfo, token }) => ({
  type: SAVE_USER_AUTHENTICATION_INFO_START,
  payload: { userInfo, token },
});

export const updateUserAuthInfoSuccess = () => ({
  type: SAVE_USER_AUTHENTICATION_INFO_SUCCESS,
});

export const updateUserAuthInfoFailure = (response: string) => ({
  type: SAVE_USER_AUTHENTICATION_INFO_FAILURE,
  payload: response,
});

export const userClearState = () => ({
  type: CLEAR_USER_REDUCER_STATE,
});

export const updateUserInfoAction =
  (basicInfo: { firstName: string; lastName: string }) =>
  async (dispatch: any, getState: any) => {
    try {
      console.log(basicInfo);
      const headers = tokenConfig();
      if ((headers as any).headers.Authorization) {
        const response = await tigrowApi.put(
          `accounts/update`,
          basicInfo,
          headers,
        );
        dispatch({
          type: EDIT_BASIC_INFO,
          payload: response.data.user,
        });
      }
      return true;
    } catch (error) {
      dispatch({
        type: USER_FETCH_ERROR,
        payload: returnErrorText(error),
      });
      return false;
    }
  };

export const updateUserCompanyProjectCount = (companyId: string) => ({
  type: UPDATE_USER_COMPANY_PROJECT_COUNT,
  payload: companyId,
});

export const updateUserCompanyTask = (companyId: string) => ({
  type: UPDATE_USER_COMPANY_TASK_COUNT,
  payload: companyId,
});

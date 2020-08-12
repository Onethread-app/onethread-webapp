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
} from './Types';
import { tokenConfig } from 'stores/UtilsActions';
import { isEqual } from 'lodash';
import { User } from './Reducer';
import { errorMessgeHandler } from 'components/final-form/utils';
import { tigrowApi } from 'config';
import { SET_INITIAL_CURRENT_COMPANY } from 'stores/company/Types';

export const editUserInfoAction = (basicInfo: User) => async (
  dispatch: any,
  getState: any,
) => {
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

export const addSkillAction = (skillSet: string[]) => async (
  dispatch: any,
  getState: any,
) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const req = { skillArea: skillSet };
      const response = await tigrowApi.put(
        `skills/update-skill`,
        req,
        headers,
      );
      dispatch({ type: ADD_SKILL, payload: response.data.skillList });
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

export const addJobExperienceAction = (
  jobExperienceInfo: any,
) => async (dispatch: any, getState: any) => {
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
      console.log('token error');
    }
    return errorMessgeHandler(response);
  } catch (error) {
    return errorMessgeHandler(error);
  }
};

export const addEducationExperienceAction = (
  educationExperienceInfo: any,
) => async (dispatch: any, getState: any) => {
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
      console.log('token error');
    }
    return errorMessgeHandler(response);
  } catch (error) {
    return errorMessgeHandler(error);
  }
};

export const getAllCompaniesByUserId = (userId: string, type?: string) => async (
  dispatch: any,
  getState: any,
) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.get(
        `company/individual/${userId}`,
        headers,
      );
      dispatch({
        type: USER_COMPANIES_UPDATE,
        payload: response.data,
      });
      console.log(response.data);
      if (isEqual(type, 'home')) {
        dispatch({
          type: SET_INITIAL_CURRENT_COMPANY,
          payload: response.data.companies.length > 0 ? response.data.companies[0] : null
        });
      }
    } else {
      // tslint:disable-next-line: no-console
      // console.log('error in get company list by user');
    }
  } catch (error) {
    // tslint:disable-next-line: no-console
    // console.log(error.response);
  }
};
export const deleteSkillAction = (skill: string) => async (
  dispatch: any,
  getState: any,
) => {
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

export const editJobExperienceAction = (
  jobExperienceInfo: any,
  jobexperienceid: any,
) => async (dispatch: any, getState: any) => {
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
      console.log('token error');
    }
    return errorMessgeHandler(response);
  } catch (error) {
    return errorMessgeHandler(error);
  }
};

export const editEducationExperienceAction = (
  educationExperienceInfo: any,
  educationexperienceid: any,
) => async (dispatch: any, getState: any) => {
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
      console.log('token error');
    }
    return errorMessgeHandler(response);
  } catch (error) {
    return errorMessgeHandler(error);
  }
};

export const imageUploadAction = (
  imageSelected: any,
  type: string,
) => async (dispatch: any, getState: any) => {
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
export const getAllVideoHistory = () => async (
  dispatch: any,
  getState: any,
) => {
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
      // console.log('error in get company list by user');
    }
  } catch (error) {
    // tslint:disable-next-line: no-console
    // console.log(error.response);
  }
};

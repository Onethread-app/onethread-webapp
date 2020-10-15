import { all, put, call, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import { tokenConfig } from 'stores/UtilsActions';
import { tigrowApi } from 'config';

import { UserActionTypes } from './Types';
import {
  addSkillActionFailure,
  addSkillActionSuccess,
  editUserInfoActionFailure,
  editUserInfoActionSuccess,
  deleteSkillActionSuccess,
  deleteSkillActionFailure,
  addJobExperienceActionSuccess,
  addJobExperienceActionFailure,
  addEducationExperienceActionSuccess,
  addEducationExperienceActionFailure,
  editEducationExperienceActionSuccess,
  editEducationExperienceActionFailure,
  editJobExperienceActionSuccess,
  editJobExperienceActionFailure,
  getAllVideoHistorySuccess,
  getAllVideoHistoryFailure,
  getAllCompaniesByUserIdSuccess,
  getAllCompaniesByUserIdFailure,
  imageUploadActionSuccess,
  imageUploadActionFailure,
  // imageUploadActionSuccess,
} from './Actions';
import { getTimeline } from './Selector';
import { SET_INITIAL_CURRENT_COMPANY } from 'stores/company/Types';
// import { SET_INITIAL_CURRENT_COMPANY } from 'stores/company/Types';
// const takeEvery: any = Eff.takeEvery;
const takeLatest: any = Eff.takeLatest;

// Edit user

// export function* editUserInfoActionAsync({ payload }: any) {
//   try {
//     const headers = tokenConfig();
//     let response;
//     if ((headers as any).headers.Authorization) {
//       let user = {};
//       if (payload.contactNo) {
//         user = {
//           ...payload,
//           contactNo: `+88${payload.contactNo}`,
//         };
//       } else {
//         user = payload;
//       }
//       response = yield tigrowApi.put(
//         `accounts/update`,
//         user,
//         headers,
//       );
//       yield put(editUserInfoActionSuccess(response.user));
//     }
//   } catch (error) {
//     yield put(editUserInfoActionFailure(error));
//   }
// }

export function* editUserInfoActionAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    let response;
    if ((headers as any).headers.Authorization) {
      let user = {};
      if (payload.contactNo) {
        user = {
          ...payload,
          contactNo: `+88${payload.contactNo}`,
        };
      } else {
        user = payload;
      }
      response = yield tigrowApi.put(
        `accounts/update`,
        user,
        headers,
      );
      yield put(editUserInfoActionSuccess(user));
    } else {
      yield put(editUserInfoActionFailure('error in user fetching'));
    }
    return editUserInfoActionFailure(response);
  } catch (error) {
    return editUserInfoActionFailure(error);
  }
}

export function* onEditUserInfoAction() {
  yield takeLatest(
    UserActionTypes.EDIT_BASIC_INFO_START,
    editUserInfoActionAsync,
  );
}

// Add skill
export function* addSkillActionAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const req = { skillArea: payload };
      const response = yield tigrowApi.put(
        `skills/update-skill`,
        req,
        headers,
      );
      yield put(addSkillActionSuccess(response.data.skillList));
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in user fetching');
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(addSkillActionFailure('Network Error'));
    }
    yield put(addSkillActionFailure(error.message));
  }
}

export function* onAddSkillAction() {
  yield takeLatest(
    UserActionTypes.ADD_SKILL_START,
    addSkillActionAsync,
  );
}

// Delete skill
export function* deleteSkillActionAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.delete(
        `skills/delete-skill?skillId=${payload}`,
        headers,
      );
      yield put(deleteSkillActionSuccess(response.data.skillArea));
      // dispatch({
      //   type: DELETE_SKILL,
      //   payload: response.data.skillArea,
      // });
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in user fetching');
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(deleteSkillActionFailure('Network Error'));
    }
    yield put(deleteSkillActionFailure(error.message));
  }
}

export function* onDeleteSkillAction() {
  yield takeLatest(
    UserActionTypes.DELETE_SKILL_START,
    deleteSkillActionAsync,
  );
}

// Add job experiance
export function* addJobExperienceActionAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    let response;
    if ((headers as any).headers.Authorization) {
      response = yield tigrowApi.post(
        'jobs/create-job-experience',
        payload,
        headers,
      );
      const timelineResponse = response.data.data;
      const timeline = yield select(getTimeline);
      timeline.push(timelineResponse);
      const timelineSort = timeline.sort((a: any, b: any) =>
        a.startYear < b.startYear ? 1 : -1,
      );
      yield put(addJobExperienceActionSuccess(timelineSort));
      // dispatch({ type: ADD_EXPERIENCE, payload: timelineSort });
    } else {
      // tslint:disable-next-line: no-console
      yield put(addJobExperienceActionFailure('Token Error'));
    }
  } catch (error) {
    yield put(addJobExperienceActionFailure(error));
  }
}

export function* onAddJobExperienceAction() {
  yield takeLatest(
    UserActionTypes.ADD_EXPERIENCE_START,
    addJobExperienceActionAsync,
  );
}

// Add Education experiance
export function* addEducationExperienceActionAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    let response;
    if ((headers as any).headers.Authorization) {
      response = yield tigrowApi.post(
        'educations/add-education',
        payload,
        headers,
      );
      const timelineResponse = response.data.data;
      const timeline = yield select(getTimeline);
      timeline.push(timelineResponse);
      const timelineSort = timeline.sort((a: any, b: any) =>
        a.startYear < b.startYear ? 1 : -1,
      );
      yield put(addEducationExperienceActionSuccess(timelineSort));
      // dispatch({ type: ADD_EXPERIENCE, payload: timelineSort });
    } else {
      // tslint:disable-next-line: no-console
    }
    return addEducationExperienceActionFailure(response);
  } catch (error) {
    return addEducationExperienceActionFailure(error);
  }
}

export function* onAddEducationExperienceAction() {
  yield takeLatest(
    UserActionTypes.ADD_EXPERIENCE_START,
    addEducationExperienceActionAsync,
  );
}

// Edit eduction experiance
export function* editEducationExperienceActionAsync(payload: any) {
  try {
    const headers = tokenConfig();
    let response;
    const {
      educationexperienceid,
      educationExperienceInfo,
    } = payload;
    if ((headers as any).headers.Authorization) {
      response = yield tigrowApi.put(
        `educations/update-education?educationId=${educationexperienceid}`,
        educationExperienceInfo,
        headers,
      );
      const timelineResponse = response.data.data;
      const timeline = yield select(getTimeline);
      const filteredTimeline = timeline.filter(
        (exp: any) => exp._id !== timelineResponse._id,
      );
      filteredTimeline.push(timelineResponse);
      const timelineSort = filteredTimeline.sort((a: any, b: any) =>
        a.startYear < b.startYear ? 1 : -1,
      );

      yield put(editEducationExperienceActionSuccess(timelineSort));
      // dispatch({ type: ADD_EXPERIENCE, payload: timelineSort });
    } else {
      // tslint:disable-next-line: no-console
      console.log('token error');
    }
    return editEducationExperienceActionFailure(response);
  } catch (error) {
    return editEducationExperienceActionFailure(error);
  }
}

export function* onEditEducationExperienceAction() {
  yield takeLatest(
    UserActionTypes.ADD_EXPERIENCE_START,
    editEducationExperienceActionAsync,
  );
}

// Edit job experiance
export function* editJobExperienceActionAsync(payload: any) {
  try {
    const headers = tokenConfig();
    let response;
    const { jobexperienceid, jobExperienceInfo } = payload;
    if ((headers as any).headers.Authorization) {
      response = yield tigrowApi.put(
        `jobs/job-experience-update?jobexperienceid=${jobexperienceid}`,
        jobExperienceInfo,
        headers,
      );
      const timelineResponse = response.data.data;
      const timeline = yield select(getTimeline);
      const filteredTimeline = timeline.filter(
        (exp: any) => exp._id !== timelineResponse._id,
      );
      filteredTimeline.push(timelineResponse);
      const timelineSort = filteredTimeline.sort((a: any, b: any) =>
        a.startYear < b.startYear ? 1 : -1,
      );
      yield put(editJobExperienceActionSuccess(timelineSort));
      // dispatch({ type: ADD_EXPERIENCE, payload: timelineSort });
    } else {
      // tslint:disable-next-line: no-console
      console.log('token error');
    }
    return editJobExperienceActionFailure(response);
  } catch (error) {
    return editJobExperienceActionFailure(error);
  }
}

export function* onEditJobExperienceAction() {
  yield takeLatest(
    UserActionTypes.ADD_EXPERIENCE_START,
    editJobExperienceActionAsync,
  );
}

// getAllVideoHistory
export function* getAllVideoHistoryAsync() {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `video-conferences/get-conferences`,
        headers,
      );
      yield put(getAllVideoHistorySuccess(response.data.records));
    }
  } catch (error) {
    yield put(getAllVideoHistoryFailure(error));
  }
}

export function* onGetAllVideoHistoryAction() {
  yield takeLatest(
    UserActionTypes.VIDEO_CONFERENCE_START,
    getAllVideoHistoryAsync,
  );
}

export function* getAllCompaniesByUserIdAsync(payload: any) {
  try {
    const headers = tokenConfig();
    const { userId, from } = payload;
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `company/individual/${userId}`,
        headers,
      );
      yield put(getAllCompaniesByUserIdSuccess(response.data));
      if (from === 'home') {
        yield put({
          type: SET_INITIAL_CURRENT_COMPANY,
          payload:
            response.data.companies.length > 0
              ? response.data.companies[0]
              : null,
        });
      }
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(getAllCompaniesByUserIdFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        getAllCompaniesByUserIdFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(getAllCompaniesByUserIdFailure(error.message));
    }
  }
}

export function* onGetAllCompaniesByUserId() {
  yield takeLatest(
    UserActionTypes.USER_COMPANIES_UPDATE_START,
    getAllCompaniesByUserIdAsync,
  );
}

// image upload action
export function* imageUploadActionAsync({
  imgType,
  imageSelected,
}: any) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.post(
        `files/upload?imageType=${imgType}`,
        imageSelected,
        headers,
      );
      if (response.data.imageType === 'profilePic') {
        yield put(
          imageUploadActionSuccess({
            ...response.data,
            link: response.data.link,
          }),
        );
      } else if (response.data.imageType === 'coverPhoto') {
        yield put({
          type: UserActionTypes.COVER_IMAGE_UPLOAD_SUCCESS,
          payload: {
            ...response.data,
            link: response.data.link,
          },
        });
      }
    } else {
      // tslint:disable-next-line: no-console
      console.log('no headers');
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      // tslint:disable-next-line: no-console
      console.log('network error');
      yield put(imageUploadActionFailure(error.message));
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(imageUploadActionFailure(error.message));
    }
  }
}

export function* onImageUploadAction() {
  yield takeLatest(
    UserActionTypes.PROFILE_IMAGE_UPLOAD_START,
    imageUploadActionAsync,
  );
}

export default function* userSaga() {
  yield all([
    call(onEditUserInfoAction),
    call(onAddSkillAction),
    call(onDeleteSkillAction),
    call(onAddJobExperienceAction),
    call(onAddEducationExperienceAction),
    call(onEditEducationExperienceAction),
    call(onEditJobExperienceAction),
    call(onGetAllVideoHistoryAction),
    call(onGetAllCompaniesByUserId),
    call(onImageUploadAction),
  ]);
}

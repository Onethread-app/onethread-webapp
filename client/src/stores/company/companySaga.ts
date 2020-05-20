import { tokenConfig } from 'stores/UtilsActions';
import { put, all, select } from 'redux-saga/effects';
import {
  COMPANY_REDUCER_LOADING,
  GET_ALL_COMPANY_MEMBERS,
  ADD_TEAM_MEMBERS_ERROR, company, COMPANY_DEPARTMENT_LOADING, GET_ALL_DEPARTMENT, ADD_DEPARTMENT_ERROR
} from './Types';
import { tigrowApi } from 'config';
import { isEqual } from 'lodash';
import * as Eff from 'redux-saga/effects';

// const takeEvery: any = Eff.takeEvery; // <-- new
const takeLatest: any = Eff.takeLatest;

function* getCompanyMembers() {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const selectCompanyId = (state) =>
        state.companyReducer.currentCompany._id;
      const companyId = yield select(selectCompanyId);
      yield put({ type: COMPANY_REDUCER_LOADING });
      const response = yield tigrowApi.get(
        `company/${companyId}/members?limit=100`,
        headers,
      );
      yield put({
        type: GET_ALL_COMPANY_MEMBERS,
        payload: response.data,
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in selection of company fetching');
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      yield put({
        type: ADD_TEAM_MEMBERS_ERROR,
        payload: 'Network error',
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
  }
}

// function* addTeamMembers(action) {
//   try {
//     const headers = tokenConfig();
//     if ((headers as any).headers.Authorization) {
//       yield put({ type: COMPANY_REDUCER_LOADING });
//       const response = yield tigrowApi.post(
//         `company/${action.companyId}/members`,
//         { members: action.members, pendingTeamMembers: action.pendingTeamMembers },
//         headers,
//       );
//       if (response.data.pendingMembers.length > 0) {
//         yield put({
//           type: UPDATE_ALL_COMPANY_PENDING_MEMBERS,
//           payload: response.data.pendingMembers,
//         });
//       }
//       yield put({ type: COMPANY_REDUCER_LOADING_FALSE });
//       // yield put({ type: ADD_TEAM_MEMBERS, payload: response.data });
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log('error in selection of company fetching');
//     }
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       yield put({
//         type: ADD_TEAM_MEMBERS_ERROR,
//         payload: 'Network error',
//       });
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log(error.response);
//     }
//   }
// }

function* getAllDepartments() {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      yield put({ type: COMPANY_DEPARTMENT_LOADING });
      const selectCompanyId = (state) =>
        state.companyReducer.currentCompany._id;
      const companyId = yield select(selectCompanyId);
      const response = yield tigrowApi.get(
        `company/${companyId}/departments`,
        headers,
      );
      yield put({ type: GET_ALL_DEPARTMENT, payload: response.data });
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in adding department');
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      yield put({
        type: ADD_DEPARTMENT_ERROR,
        payload: 'Network error',
      });
    } else if (error.response.status === 401) {
      yield put({
        type: ADD_DEPARTMENT_ERROR,
        payload: 'Unauthorized user.',
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
  }
}

export default function* companySaga() {
  yield all([
    // takeEvery(room.CREATE_ROOM_LOAD, createRoomAction),
    takeLatest(company.GET_ALL_COMPANY_MEMBERS_LOADING, getCompanyMembers),
    takeLatest(company.GET_ALL_DEPARTMENT_LOADING, getAllDepartments),

  ]);
}
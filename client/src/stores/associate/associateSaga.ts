import { all, put, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import { associate } from './Types';
import { tigrowApi } from 'config';
// import { isEqual } from 'lodash';
import { tokenConfig } from 'stores/UtilsActions';
// import { combineReducers } from 'redux';
import { isEqual } from 'lodash';
// import { Associate } from './Reducer';
import { Toaster } from '@blueprintjs/core';
<<<<<<< HEAD
import { ICompany } from 'stores/company/Reducer';
=======
>>>>>>> 0db3de3c... Feat/notification (#198)
// import { type } from 'os';
// import { ItemEntityProps } from 'components/fields/SuggestField';
// import { Associate } from './Reducer';
// import { Toaster } from '@blueprintjs/core';

const takeEvery: any = Eff.takeEvery; // <-- new
const takeLatest: any = Eff.takeLatest;

interface IAddAssociateAction {
  type: String;
  associateWith: {
    mongo_id: String;
    name: String;
  };
<<<<<<< HEAD
  company: ICompany;
=======
  companyID: String;
>>>>>>> 0db3de3c... Feat/notification (#198)
}

function* addAssociate(action: IAddAssociateAction) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.post(
<<<<<<< HEAD
        `/associate/${action.company._id}`,
        {
          company: action.company,
=======
        `/associate/${action.companyID}`,
        {
          companyId: action.companyID,
>>>>>>> 0db3de3c... Feat/notification (#198)
          associateCompany: {
            _id: action.associateWith.mongo_id,
            name: action.associateWith.name,
          },
        },
        headers,
      );
      yield put({ type: associate.SEND_REQUEST_SUCCESS });
      return response;
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in selection of company fetching');
    }
  } catch (error) {
    yield put({ type: associate.SEND_REQUEST_ERROR, error });
  }
}

function* getAllAssociates() {
  try {
    const selectCompanyId = (state) =>
      state.companyReducer.currentCompany._id;
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const companyId = yield select(selectCompanyId);
      console.log(companyId);
      const response = yield tigrowApi.get(
        `associate/${companyId}`,
        headers,
      );
      const associates = yield response.data.map((associate: any) =>
        isEqual(companyId, associate.company._id) === true
          ? {
              _id: associate._id,
              associateCompany: associate.associateCompany,
              createdAt: associate.createdAt,
            }
          : {
              _id: associate._id,
              associateCompany: associate.company,
              createdAt: associate.createdAt,
            },
      );
      yield put({
        type: associate.GET_ASSOCIATE_SUCCSESS,
        payload: associates,
      });
    }
  } catch (error) {
    yield put({ type: associate.GET_ASSOCIATE_FAIL, error });
  }
}

function* getProjectAssociates() {
  try {
    const headers = tokenConfig();
    const selectProjectId = (state) => state.projectReducer.pid;
    if ((headers as any).headers.Authorization) {
      const pid = yield select(selectProjectId);
      const response = yield tigrowApi.get(
        `/teams/member-list?pid=${pid}`,
        headers,
      );
      yield put({
        type: associate.GET_PROJECT_ASSOCIATES_SUCCESS,
        payload: response.data.associateList.associate,
      });
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      // return error.response;
    }
  }
}

function* getAllPendingAssociates() {
  try {
    const headers = tokenConfig();
    const selectCompanyId = (state) =>
      state.companyReducer.currentCompany._id;
    if ((headers as any).headers.Authorization) {
      const companyId = yield select(selectCompanyId);
      const response = yield tigrowApi.get(
        `associate/pending/${companyId}`,
        headers,
      );

      const associates = response.data.map((associate: any) =>
        isEqual(companyId, associate.company._id) === true
          ? {
              _id: associate._id,
              associateCompany: associate.associateCompany,
              createdAt: associate.createdAt,
            }
          : {
              _id: associate._id,
              associateCompany: associate.company,
              createdAt: associate.createdAt,
            },
      );
      yield put({
        type: associate.GET_ALL_PENDING_ASSOCIATE_SUCCSESS,
        payload: associates,
      });
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      // return error.response;
    }
  }
}

<<<<<<< HEAD
// interface IAddAssociateAction {
//   type: String;
//   associateWith: {
//     mongo_id: String;
//     name: String;
//   };
//   companyID: String;
// }
=======
interface IAddAssociateAction {
  type: String;
  associateWith: {
    mongo_id: String;
    name: String;
  };
  companyID: String;
}
>>>>>>> 0db3de3c... Feat/notification (#198)

function* acceptPendingAssociate(action: {
  type: String;
  associateID: String;
}) {
  try {
    const headers = tokenConfig();
    const selectCompanyId = (state) =>
      state.companyReducer.currentCompany._id;
    console.log(
      (headers as any).headers.Authorization && action.associateID,
    );
    if (
      (headers as any).headers.Authorization &&
      action.associateID
    ) {
      const companyID = yield select(selectCompanyId);

      const response = yield tigrowApi.post(
        `associate/accept/${companyID}`,
        {
          associateId: action.associateID,
        },
        headers,
      );
      const actualAssociate = yield response.data.company._id;
      yield put({
        type: associate.ACCEPT_ASSOCIATE_REQUEST_SUCCESS,
        payload: actualAssociate,
      });
      yield put({ type: associate.GET_ALL_PENDING_ASSOCIATE_LOAD });
      Toaster.create().show({
        message: `Successfully accepted`,
        timeout: 3000,
        intent: 'success',
      });
    }
  } catch (error) {
    yield put({ type: associate.ACCEPT_ASSOCIATE_REQUEST_FAIL });
  }
}
function* rejectPendingAssociate(action: {
  type: String;
  associateID: String;
}) {
  try {
    const headers = tokenConfig();
    const selectCompanyId = (state) =>
      state.companyReducer.currentCompany._id;
    console.log(
      (headers as any).headers.Authorization && action.associateID,
    );
    if (
      (headers as any).headers.Authorization &&
      action.associateID
    ) {
      const companyID = yield select(selectCompanyId);

      const response = yield tigrowApi.post(
        `associate/reject/${companyID}`,
        {
          associateId: action.associateID,
        },
        headers,
      );
      const actualAssociate = yield response.data.company._id;
      yield put({
        type: associate.REJECT_ASSOCIATE_REQUEST_SUCCESS,
        payload: actualAssociate,
      });
      yield put({ type: associate.GET_ALL_PENDING_ASSOCIATE_LOAD });
      Toaster.create().show({
        message: `Successfully accepted`,
        timeout: 3000,
        intent: 'success',
      });
    }
  } catch (error) {
    yield put({ type: associate.REJECT_ASSOCIATE_REQUEST_FAIL });
  }
}

export default function* associateSaga() {
  yield all([
    takeEvery(associate.SEND_REQUEST_LOAD, addAssociate),
    takeLatest(associate.GET_ASSOCIATE_LOADING, getAllAssociates),
    takeLatest(
      associate.GET_ALL_PENDING_ASSOCIATE_LOAD,
      getAllPendingAssociates,
    ),
    takeLatest(
      associate.ACCEPT_ASSOCIATE_REQUEST_LOADING,
      acceptPendingAssociate,
    ),
    takeLatest(
      associate.GET_PROJECT_ASSOCIATES_LOADING,
      getProjectAssociates,
    ),
    takeLatest(
      associate.REJECT_ASSOCIATE_REQUEST_LOADING,
      rejectPendingAssociate,
    ),
  ]);
}

// const fetchProjects = (url: any, headers: any, companyId: any) => {
//   fetch(`${url}/${companyId}`, headers);
// };
// const setProjects = (projects: any) => {
//   console.log(projects);
// };
// const setProjectError = () => {};

export function* handleProjecLoad() {
  console.log('from saga');
  // try {
  //   const state = select();
  //   const headers = tokenConfig();
  //   const companyId = yield (state as any).companyReducer
  //     .currentCompany._id;
  //   const projects = yield call(
  //     fetchProjects,
  //     'http://tigrow.co',
  //     headers,
  //     companyId,
  //   );
  //   yield put(setProjects(projects) as any);
  // } catch (e) {
  //   yield put(setProjectError() as any);
  // }
}

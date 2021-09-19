import { all, put, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import { associate } from './Types';
import { tigrowApi } from 'config';
// import { isEqual } from 'lodash';
import { tokenConfig } from 'stores/UtilsActions';
// import { combineReducers } from 'redux';
import { isEmpty, isEqual } from 'lodash';
// import { Associate } from './Reducer';
import { Toaster } from '@blueprintjs/core';
import { ICompany } from 'stores/company/Reducer';
// import { type } from 'os';
// import { ItemEntityProps } from 'components/fields/SuggestField';
// import { Associate } from './Reducer';
// import { Toaster } from '@blueprintjs/core';

import {
  selectAssociateSuccess,
  selectAssociateFailure,
} from './Actions';
import { getProjectAssociatesFailure } from 'stores/project/Actions';
import { returnErrorText } from 'helpers/HandleSagaErrors';
import { getCompanyId } from 'stores/company/Selector';
import { getProjectId } from 'stores/project/Selector';

const takeEvery: any = Eff.takeEvery; // <-- new
const takeLatest: any = Eff.takeLatest;

interface IAddAssociateAction {
  type: String;
  associateWith: {
    mongo_id: String;
    name: String;
  };
  company: ICompany;
}

function* addAssociate(action: IAddAssociateAction) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.post(
        `/associate/${action.company._id}`,
        {
          company: action.company,
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
    }
  } catch (error) {
    const errorText = returnErrorText(error);
    yield put({ type: associate.SEND_REQUEST_ERROR, errorText });
  }
}

function* getAllAssociates() {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    if (
      (headers as any).headers.Authorization &&
      !isEmpty(companyId)
    ) {
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
    const errorText = returnErrorText(error);
    yield put({
      type: associate.GET_ASSOCIATE_FAIL,
      errorText,
    });
  }
}

function* getProjectAssociates() {
  try {
    const headers = tokenConfig();
    const pid = yield select(getProjectId);
    if ((headers as any).headers.Authorization) {
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
    yield put(getProjectAssociatesFailure(returnErrorText(error)));
  }
}

function* getAllPendingAssociates() {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    if (
      (headers as any).headers.Authorization &&
      !isEmpty(companyId)
    ) {
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
  } catch (error: any) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
    } else {
      // tslint:disable-next-line: no-console
      // return error.response;
    }
  }
}

// interface IAddAssociateAction {
//   type: String;
//   associateWith: {
//     mongo_id: String;
//     name: String;
//   };
//   companyID: String;
// }

function* acceptPendingAssociate(action: {
  type: String;
  associateID: String;
}) {
  try {
    const headers = tokenConfig();
    const companyID = yield select(getCompanyId);
    if (
      (headers as any).headers.Authorization &&
      action.associateID
    ) {
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
    const companyID = yield select(getCompanyId);
    if (
      (headers as any).headers.Authorization &&
      action.associateID &&
      !isEmpty(companyID)
    ) {
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

function* getSelectedAssociate({ payload }: any) {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    if (
      (headers as any).headers.Authorization &&
      payload &&
      !isEmpty(companyId)
    ) {
      const response = yield tigrowApi.get(
        `associate/${payload}/${companyId}`,
        headers,
      );
      yield put(selectAssociateSuccess(response.data));
    }
  } catch (error) {
    yield put(selectAssociateFailure(returnErrorText(error)));
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
    takeLatest(
      associate.SELECT_ASSOCIATE_START,
      getSelectedAssociate,
    ),
  ]);
}

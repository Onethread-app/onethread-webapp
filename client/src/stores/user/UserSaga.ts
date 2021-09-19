import { all, call, put, takeEvery } from '@redux-saga/core/effects';
import * as Eff from 'redux-saga/effects';
import { tigrowApi } from 'config';
import {
  SAVE_USER_AUTHENTICATION_INFO_START,
  REFRESH_USER_INFO_START,
  TOKEN_VERIFY_START,
  REFRESH_USER_TOKEN_START,
} from '../user/Types';
import { tokenConfig } from 'stores/UtilsActions';
import { returnErrorText } from 'helpers/HandleSagaErrors';
import { Toaster } from '@blueprintjs/core';
import {
  refreshUserInfoFailed,
  refreshUserInfoSuccess,
  updateUserAuthInfoFailed,
  updateUserAuthInfoSuccess,
  updateUserTokenFailed,
  updateUserTokenStart,
  updateUserTokenSuccess,
  verifyUserTokenFailed,
  verifyUserTokenSuccess,
} from './Actions';

const takeLatest: any = Eff.takeLatest;

export interface IUserAuthenticationInfo {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  token: string;
}

export function* updateUserAuthInfoAction(action: {
  type: string;
  payload: { userInfo: IUserAuthenticationInfo; token: string };
}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${action.payload.token}`,
    },
  };
  try {
    const response = yield tigrowApi.put(
      'accounts/update',
      action.payload.userInfo,
      config,
    );
    if (response.status === 200) {
      yield put(updateUserAuthInfoSuccess());
      yield put(
        updateUserTokenStart(
          JSON.parse(localStorage.getItem('ot_refresh_id')!),
        ),
      );
    }
  } catch (error) {
    yield put(updateUserAuthInfoFailed(returnErrorText(error)));
  }
}

export function* refreshUserInfoActionAsync() {
  try {
    const header = tokenConfig();
    const response = yield tigrowApi.get('/accounts/', header);
    yield put(refreshUserInfoSuccess(response.data));
  } catch (error) {
    yield put(refreshUserInfoFailed(returnErrorText(error)));
  }
}

export function* verifyUserTokenAction(action: {
  type: string;
  payload: string;
}) {
  try {
    const response = yield tigrowApi.get(
      `accounts/verify-account/${action.payload}`,
    );
    if (response.status === 200) {
      localStorage.setItem(
        'ot_access_id',
        JSON.stringify(response.data.accessToken),
      );
      localStorage.setItem(
        'ot_refresh_id',
        JSON.stringify(response.data.refreshToken),
      );

      yield put(verifyUserTokenSuccess(response.data));
    }
  } catch (err) {
    yield put(verifyUserTokenFailed(returnErrorText(err)));

    Toaster.create().show({
      message: `${returnErrorText(err)}`,
      timeout: 3000,
      intent: 'danger',
    });
  }
}

export function* updateUserTokenActionAsync(action: {
  type: string;
  payload: string;
}) {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${action.payload}`,
      },
    };
    const response = yield tigrowApi.post(
      '/accounts/refresh',
      {
        refreshToken: action.payload,
      },
      config,
    );
    if (response.status === 200) {
      localStorage.setItem(
        'ot_access_id',
        JSON.stringify(response.data.accessToken),
      );
      localStorage.setItem(
        'ot_refresh_id',
        JSON.stringify(response.data.refreshToken),
      );
      yield put(updateUserTokenSuccess());
    }
  } catch (err) {
    yield put(updateUserTokenFailed(returnErrorText(err)));
  }
}

export function* updateUserAuthInfoActionHandler() {
  yield takeLatest(
    SAVE_USER_AUTHENTICATION_INFO_START,
    updateUserAuthInfoAction,
  );
}

export function* refreshUserInfoActionHandler() {
  yield takeEvery(
    REFRESH_USER_INFO_START,
    refreshUserInfoActionAsync,
  );
}

export function* verifyTokenActionHandler() {
  yield takeLatest(TOKEN_VERIFY_START, verifyUserTokenAction);
}

export function* updateUserTokenActionHandler() {
  yield takeLatest(
    REFRESH_USER_TOKEN_START,
    updateUserTokenActionAsync,
  );
}

export default function* userSaga() {
  yield all([
    call(updateUserAuthInfoActionHandler),
    call(verifyTokenActionHandler),
    call(refreshUserInfoActionHandler),
    call(updateUserTokenActionHandler),
  ]);
}

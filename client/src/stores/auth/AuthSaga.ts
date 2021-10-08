import * as Eff from 'redux-saga/effects';
import { all, put, call } from '@redux-saga/core/effects';
import { tigrowApi } from 'config';
import { returnErrorText } from 'helpers/HandleSagaErrors';
import { USER_CHANGE_EMAIL_START, USER_SIGNUP_START } from './Types';
import {
  userChangeEmailFailure,
  userChangeEmailSuccess,
  userSignupFailure,
  userSignupSuccess,
} from './Actions';

const takeLatest: any = Eff.takeLatest;

export function* userSignupAction(action: { payload: string }) {
  try {
    const response = yield tigrowApi.post(
      '/accounts/signup',
      { email: action.payload },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    localStorage.setItem(
      'id',
      JSON.stringify(response.data.user._id)!,
    );
    yield put(userSignupSuccess());
  } catch (error) {
    yield put(userSignupFailure(returnErrorText(error)));
  }
}

export function* userChangeEmailStartAsync(action: {
  payload: { email: string; id: string };
}) {
  try {
    yield tigrowApi.put(
      '/accounts/update-email',
      { email: action.payload.email, id: action.payload.id },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    yield put(userChangeEmailSuccess());
  } catch (error) {
    yield put(userChangeEmailFailure(returnErrorText(error)));
  }
}

export function* userSignupActionHandler() {
  yield takeLatest(USER_SIGNUP_START, userSignupAction);
}

export function* userChangeEmailStartHandler() {
  yield takeLatest(
    USER_CHANGE_EMAIL_START,
    userChangeEmailStartAsync,
  );
}

export default function* authSaga() {
  yield all([
    call(userSignupActionHandler),
    call(userChangeEmailStartHandler),
  ]);
}

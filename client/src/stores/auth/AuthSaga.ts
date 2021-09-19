import * as Eff from 'redux-saga/effects';
import { all, put, call } from '@redux-saga/core/effects';
import { tigrowApi } from 'config';
import { returnErrorText } from 'helpers/HandleSagaErrors';
import { USER_SIGNUP_START } from './Types';
import { userSignupFailed, userSignupSuccess } from './Actions';

const takeLatest: any = Eff.takeLatest;

export function* userSignupAction(action: { payload: string }) {
  try {
    yield tigrowApi.post(
      '/accounts/signup',
      { email: action.payload },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    yield put(userSignupSuccess());
  } catch (error) {
    yield put(userSignupFailed(returnErrorText(error)));
  }
}

export function* userSignupActionHandler() {
  yield takeLatest(USER_SIGNUP_START, userSignupAction);
}

export default function* authSaga() {
  yield all([call(userSignupActionHandler)]);
}

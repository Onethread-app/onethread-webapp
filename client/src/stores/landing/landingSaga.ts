import { all, put, call } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';

import { LANDING_APIS } from './Types';
import { tigrowApi } from 'config';

import {
  saveContactFormSuccess,
  saveContactFormFailure,
} from './Actions';

const takeLatest: any = Eff.takeLatest;

function* savingContactForm( {payload}: any ) {
  try {
    const response = yield tigrowApi.post(
      `contact/contact-sale`,
      payload,
    );
    yield put(saveContactFormSuccess(response.status));
  } catch (error) {
    yield put(saveContactFormFailure(error));
  }
}

function* onSaveContactForm() {
  yield takeLatest(LANDING_APIS.SAVE_CONTACT_FORM, savingContactForm);
}

export default function* landingSaga() {
  yield all([call(onSaveContactForm)]);
}

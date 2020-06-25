import { all, put, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import { tokenConfig } from 'stores/UtilsActions';
import { tigrowApi } from 'config';
import { subscription } from './Type';

const takeEvery: any = Eff.takeEvery; // <-- new
// const takeLatest: any = Eff.takeLatest;

function* getPaymentIntent() {
  try {
    const headers = tokenConfig();
    const selectCompanyId = (state) =>
      state.companyReducer.currentCompany._id;

    if ((headers as any).headers.Authorization) {
      const companyId = yield select(selectCompanyId);

      const response = yield tigrowApi.get(
        `payments/${companyId}`,
        headers,
      );
      yield put({
        type: subscription.GET_PAYMENT_HISTORY_SUCCESS,
        payload: response.data,
      });
    }
  } catch (error) {
    // console.log(error);
  }
}

function* getSubscriptions() {
  try {
    const headers = tokenConfig();

    if ((headers as any).headers.Authorization) {
      // const companyId = yield select(selectCompanyId);

      const response = yield tigrowApi.get(`plans`, headers);
      yield put({
        type: subscription.GET_SUBSCRIPTIONS_SUCCESS,
        payload: response.data,
      });
    }
  } catch (error) {
    // console.log(error);
  }
}

function* getCurrentSubscription() {
  try {
    const headers = tokenConfig();
    const selectCompanyId = (state) =>
      state.companyReducer.currentCompany._id;

    if ((headers as any).headers.Authorization) {
      const companyId = yield select(selectCompanyId);

      const response = yield tigrowApi.get(
        `subscriptions/${companyId}`,
        headers,
      );
      yield put({
        type: subscription.GET_CURRENT_SUBSCRIPTION_SUCCESS,
        payload: response.data,
      });
    }
  } catch (error) {
    // console.log(error);
  }
}

export default function* subscriptionSaga() {
  yield all([
    takeEvery(subscription.GET_PAYMENT_HISTORY, getPaymentIntent),
    takeEvery(subscription.GET_SUBSCRIPTIONS, getSubscriptions),
    takeEvery(
      subscription.GET_CURRENT_SUBSCRIPTION,
      getCurrentSubscription,
    ),
  ]);
}

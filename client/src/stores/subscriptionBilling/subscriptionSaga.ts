import { all, put, select, takeLatest } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import { tokenConfig, adminTokenConfig } from 'stores/UtilsActions';
import { tigrowAdminApi, tigrowApi } from 'config';
import { subscription } from './Type';
import {
  checkCouponValidityFailure,
  checkCouponValiditySuccess,
} from './Actions';

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

function* checkCouponValidityAsync({ payload }: any) {
  try {
    const adminHeaders = adminTokenConfig();
    const response = yield tigrowAdminApi.get(
      `coupon/checkvalidity?name=${payload}`,
      adminHeaders,
    );
    response.data.data
      ? yield put(checkCouponValiditySuccess({validity: true, data: response.data.data}))
      : yield put(checkCouponValiditySuccess({validity: false, data: response.data.data}));
  } catch (error) {
    yield put(checkCouponValidityFailure(error.message));
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
    takeLatest(
      subscription.CHECK_COUPON_VALIDITY_START,
      checkCouponValidityAsync,
    ),
  ]);
}

import { all, put, select, takeLatest } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import { tokenConfig, adminTokenConfig } from 'stores/UtilsActions';
import { tigrowAdminApi, tigrowApi } from 'config';
import { subscription } from './Type';
import {
  checkCouponValidityFailure,
  checkCouponValiditySuccess,
  getCurrentSubscriptionFailure,
  getCurrentSubscriptionSuccess,
  getTotalMembersFailure,
  getTotalMembersSuccess,
  setSubscriptionExpire,
} from './Actions';
import { returnErrorText } from 'helpers/HandleSagaErrors';

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
      yield put(getCurrentSubscriptionSuccess(response.data));
      const today = new Date().toISOString();
      if (response.data.expireAt < today) {
        yield put(setSubscriptionExpire());
      }
    }
  } catch (error) {
    yield put(getCurrentSubscriptionFailure(returnErrorText(error)));
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
      ? response.data.data.isUsed
        ? yield put(
            checkCouponValidityFailure(
              'Coupon has already been used',
            ),
          )
        : yield put(
            checkCouponValiditySuccess({
              validity: true,
              data: response.data.data,
            }),
          )
      : yield put(checkCouponValidityFailure('No Data Found'));
  } catch (error) {
    yield put(checkCouponValidityFailure(returnErrorText(error)));
  }
}

export function* getTotalMembersAsync() {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `payments/total-subscriber`,
        headers,
      );
      yield put(getTotalMembersSuccess(response.data));
    }
  } catch (error) {
    yield put(getTotalMembersFailure(returnErrorText(error)));
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
    takeLatest(
      subscription.GET_TOTAL_MEMBER_START,
      getTotalMembersAsync,
    ),
  ]);
}

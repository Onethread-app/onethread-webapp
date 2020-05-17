import { all, put, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';

import { NOTIFICATION } from './Types';
import { tokenConfig } from 'stores/UtilsActions';
import { tigrowApi } from 'config';
import { isEqual } from 'lodash';

const takeEvery: any = Eff.takeEvery; // <-- new
const takeLatest: any = Eff.takeLatest;

function* getNotifications() {
  try {
    const selectCompanyId = (state) =>
      state.companyReducer.currentCompany._id;
    const headers = tokenConfig();
    const companyId = yield select(selectCompanyId);
    console.log(companyId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `notifications/${companyId}`,
        headers,
      );
      yield put({
        type: NOTIFICATION.SET_SEEN_COUNT,
        payload: response.data.unseenCount,
      });
      yield put({
        type: NOTIFICATION.GET_NOTIFICATIONS_SUCCSESS,
        payload: response.data.result,
      });
      return response.data;
    }
  } catch (error) {
    put({ type: NOTIFICATION.GET_NOTIFICATIONS_FAIL, error });
  }
}

function* readNotification(action) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      yield tigrowApi.get(`reed/${action.notificationId}`, headers);
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      put({ type: NOTIFICATION.READ_NOTIFICATION_FAIL });
      // return error.response;
    }
  }
}
function* seenNotification() {
  try {
    const selectCompanyId = (state) =>
      state.companyReducer.currentCompany._id;
    const headers = tokenConfig();
    const companyId = yield select(selectCompanyId);
    if ((headers as any).headers.Authorization) {
      yield tigrowApi.get(`notification/seen/${companyId}`, headers);
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      put({ type: NOTIFICATION.SEEN_NOTIFICATION_FAIL });
      // return error.response;
    }
  }
}

export default function* notificationSaga() {
  yield all([
    takeEvery(
      NOTIFICATION.GET_NOTIFICATIONS_LOADING,
      getNotifications,
    ),
    takeLatest(NOTIFICATION.READ_NOTIFICATION, readNotification),
    takeLatest(NOTIFICATION.SEEN_NOTIFICATION, seenNotification),
  ]);
}

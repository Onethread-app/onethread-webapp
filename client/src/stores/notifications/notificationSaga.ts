import { all, put, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';

import { NOTIFICATION } from './Types';
import { tokenConfig } from 'stores/UtilsActions';
import { tigrowApi } from 'config';
import { isEqual } from 'lodash';
import { returnErrorText } from 'helpers/HandleSagaErrors';

const takeEvery: any = Eff.takeEvery; // <-- new
const takeLatest: any = Eff.takeLatest;

function* getNotifications() {
  try {
    // const selectCompanyId = (state) =>
    //   state.companyReducer.currentCompany._id;
    // const selectPageNumber = (state) =>
    //   state.notificationReducer.pageNumber;
    // const selectAllNotificatons = (state) =>
    //   state.notificationReducer.allNotifications;

    const headers = tokenConfig();
    // const pageNumber = yield select(selectPageNumber);
    // const companyId = yield select(selectCompanyId);
    // const stateNotifications = yield select(selectAllNotificatons);
    // const skip = pageNumber * 0;
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        // `notifications/${companyId}`,
        `notifications/get`,
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
    const errorText = returnErrorText(error);
    yield put({
      type: NOTIFICATION.GET_NOTIFICATIONS_FAIL,
      errorText,
    });
  }
}

function* readNotification(action) {
  try {
    const headers = tokenConfig();
    if (
      (headers as any).headers.Authorization &&
      action.notificationId
    ) {
      yield tigrowApi.get(
        `notifications/read/${action.notificationId}`,
        headers,
      );
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
    } else {
      // tslint:disable-next-line: no-console

      put({ type: NOTIFICATION.READ_NOTIFICATION_FAIL });
      // return error.response;
    }
  }
}
function* seenNotification() {
  try {
    // const selectCompanyId = (state) =>
    //   state.companyReducer.currentCompany._id;
    const headers = tokenConfig();
    // const companyId = yield select(selectCompanyId);
    if ((headers as any).headers.Authorization) {
      yield tigrowApi.get(`notifications/seen`, headers);
    }
    // put({ type: NOTIFICATION.GET_NOTIFICATIONS_LOADING });
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
    } else {
      // tslint:disable-next-line: no-console

      put({ type: NOTIFICATION.SEEN_NOTIFICATION_FAIL });
      // return error.response;
    }
  }
}

function* webPushNotification(action) {
  try {
    const selectCompanyId = (state) =>
      state.companyReducer.currentCompany._id;
    const selectRole = (state) => state.userReducer.user;
    const headers = tokenConfig();
    const companyId = yield select(selectCompanyId);
    const role = yield select(selectRole);
    if ((headers as any).headers.Authorization) {
      yield tigrowApi.post(
        'notifications/webpush',
        {
          token: action.token,
          role,
          company: companyId,
        },
        headers,
      );
    }
    put({ type: NOTIFICATION.GET_NOTIFICATIONS_LOADING });
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
    } else {
      // tslint:disable-next-line: no-console

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
    takeLatest(NOTIFICATION.WEB_PUSH_LOAD, webPushNotification),
  ]);
}

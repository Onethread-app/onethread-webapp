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
    const companyId = select(selectCompanyId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `notifications/${companyId}`,
        headers,
      );
      let count = 0;
      console.log(response);
      response.data.result.map((notification: any) => {
        if (notification.read === false) {
          count = count + 1;
        }
      });
      yield put({
        type: NOTIFICATION.SET_READ_COUNT,
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

export const readNotification = (notificationId: any) => async (
  dispatch: any,
) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.get(
        `notifications/${notificationId}`,
        headers,
      );
      dispatch({
        type: NOTIFICATION.READ_NOTIFICATION,
      });
      return response.data;
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      // return error.response;
    }
  }
};

export default function* notificationSaga() {
  yield all([
    takeEvery(
      NOTIFICATION.GET_NOTIFICATIONS_LOADING,
      getNotifications,
    ),
    takeLatest(NOTIFICATION.READ_NOTIFICATION, readNotification),
  ]);
}

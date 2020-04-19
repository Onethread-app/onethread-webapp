import { NOTIFICATION } from './Types';
import { tokenConfig } from 'stores/UtilsActions';
import { tigrowApi } from 'config';
import { isEqual } from 'lodash';

export const getNotifications = (companyId: string) => async (
  dispatch: any,
  getState: any,
) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.get(`notifications`, headers);
      let count = 0;
      response.data.map((notification: any) => {
        if (notification.read === false) {
          count = count + 1;
        }
      });
      dispatch({
        type: NOTIFICATION.SET_READ_COUNT,
        payload: count,
      });
      dispatch({
        type: NOTIFICATION.GET_NOTIFICATIONS,
        payload: response.data,
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

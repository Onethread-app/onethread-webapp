import { NOTIFICATION } from './Types';
import { tokenConfig } from 'stores/UtilsActions';
import { tigrowApi } from 'config';
import { isEqual } from 'lodash';

export const getNotifications = () => ({
  type: NOTIFICATION.GET_NOTIFICATIONS_LOADING,
});

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

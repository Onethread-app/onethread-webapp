import { NOTIFICATION } from './Types';
import { tokenConfig } from 'stores/UtilsActions';
import { tigrowApi } from 'config';
import { isEqual } from 'lodash';

export const getNotifications = (companyId: string) => async (
  dispatch: any,
  getState: any
) => {
  try {
    console.log('notification......');
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.get(
        `notifications/${companyId}`,
        headers
      );
      dispatch({
        type: NOTIFICATION.GET_NOTIFICATIONS,
        payload: response.data
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

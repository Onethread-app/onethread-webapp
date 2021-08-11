import { NOTIFICATION } from './Types';

export const getNotifications = () => ({
  type: NOTIFICATION.GET_NOTIFICATIONS_LOADING,
});

export const readNotification = (notificationId: String) => ({
  type: NOTIFICATION.READ_NOTIFICATION,
  notificationId,
});

export const markAllAsRead = (list: string[]) => ({
  type: NOTIFICATION.MARK_ALL_AS_READ_START,
  payload: list,
});

export const markAllAsReadSuccess = (response: any) => ({
  type: NOTIFICATION.MARK_ALL_AS_READ_SUCCESS,
  payload: response,
});

export const markAllAsReadFailure = (errorMessage: any) => ({
  type: NOTIFICATION.MARK_ALL_AS_READ_FAILURE,
  payload: errorMessage,
});

export const seenNotification = () => ({
  type: NOTIFICATION.SEEN_NOTIFICATION,
});

export const clearSeen = () => ({
  type: NOTIFICATION.CLEAR_SEEN,
});

export const webPush = (token: String) => ({
  type: NOTIFICATION.WEB_PUSH_LOAD,
  token,
});

export const incrementPageNumber = () => ({
  type: NOTIFICATION.INCREASE_PAGE_NUMBER,
});

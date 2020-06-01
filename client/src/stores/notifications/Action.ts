import { NOTIFICATION } from './Types';

export const getNotifications = () => ({
  type: NOTIFICATION.GET_NOTIFICATIONS_LOADING,
});

export const readNotification = (notificationId: String) => ({
  type: NOTIFICATION.READ_NOTIFICATION,
  notificationId,
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

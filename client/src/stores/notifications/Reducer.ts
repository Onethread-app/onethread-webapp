import { NOTIFICATION } from './Types';

export interface INotification {
  read: Boolean;
  seen: Number;
  socketId: String;
  pageNumber: Number;
}

const initialState = {
  allNotifications: [],
  read: false,
  seen: 0,
  socketId: '',
  pageNumber: 0,
  markingAllAsRead: false,
  errorOnMarkingAllAsRead: '',
};

const handleMarkAllRead = (state: any, list: any) => {
  return state.allNotifications.map((notification) => {
    const found = list.find(
      (modifiedNotification) =>
        notification._id === modifiedNotification._id,
    );

    return found ? { ...notification, read: true } : notification;
  });
};

export const notificationReducer = (
  state = initialState,
  action: any,
) => {
  switch (action.type) {
    case NOTIFICATION.GET_NOTIFICATIONS_SUCCSESS:
      return {
        ...state,
        allNotifications: action.payload,
      };
    case NOTIFICATION.GET_SUBSCRIBED_NOTIFICATIONS:
      return {
        ...state,
        allNotifications: action.payload,
      };
    case NOTIFICATION.MARK_ALL_AS_READ_START:
      return {
        ...state,
        markingAllAsRead: true,
        errorOnMarkingAllAsRead: '',
      };
    case NOTIFICATION.MARK_ALL_AS_READ_SUCCESS:
      return {
        ...state,
        allNotifications: handleMarkAllRead(state, action.payload),
        markingAllAsRead: false,
      };
    case NOTIFICATION.MARK_ALL_AS_READ_FAILURE:
      return {
        ...state,
        markingAllAsRead: false,
        errorOnMarkingAllAsRead: action.payload,
      };
    case NOTIFICATION.SET_SEEN_COUNT:
      return {
        ...state,
        seen: action.payload,
      };
    case NOTIFICATION.SET_SOCKET_ID:
      return {
        ...state,
        socketId: action.payload,
      };
    case NOTIFICATION.INCREASE_PAGE_NUMBER:
      return {
        ...state,
        pageNumber: state.pageNumber + 1,
      };
    default:
      return state;
  }
};

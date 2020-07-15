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

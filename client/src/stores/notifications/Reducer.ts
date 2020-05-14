import { NOTIFICATION } from './Types';

const initialState = {
  allNotifications: [],
  read: 0,
  seen: 0,
  socketId: '',
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
        allNotifications: [
          ...action.payload,
          ...state.allNotifications,
        ],
      };
    case NOTIFICATION.SET_READ_COUNT:
      return {
        ...state,
        read: action.payload,
      };
    case NOTIFICATION.SET_SOCKET_ID:
      return {
        ...state,
        socketId: action.payload,
      };
    default:
      return state;
  }
};

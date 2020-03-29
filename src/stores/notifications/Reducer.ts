import { NOTIFICATION } from './Types';

const initialState = {
  allNotifications: []
};
export const notificationReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case NOTIFICATION.GET_NOTIFICATIONS:
      return {
        ...state,
        allNotifications: action.payload
      };
    case NOTIFICATION.GET_SUBSCRIBED_NOTIFICATIONS:
      return {
        ...state,
        allNotifications: [...action.payload, ...state.allNotifications]
      };
    default:
      return state;
  }
};

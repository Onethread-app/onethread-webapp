import Pusher from 'pusher-js';
import {
  UPDATE_PUSHER_INSTANCE,
  CLEAR_PUSHER_REDUCER_STATE,
  CHANNEL_USER_LOGIN,
  CHANNEL_USER_JOINED,
  CHANNEL_USER_LEAVED,
} from './Types';
import { IChannelSubscriptionSucceeded, IChannelMember } from 'layouts/company/room/channelSubscribe';

export interface IPusherReducer {
  pusherInstance: Pusher | undefined;
  users: IChannelSubscriptionSucceeded['members'] | {};
}

const InitialState: IPusherReducer = {
  pusherInstance: undefined,
  users: {},
};

const addUser = (users: IChannelSubscriptionSucceeded['members'] | {}, user: IChannelMember) => {
  users[user.id] = user.info;
  return users;
};

const removeUser = (users: IChannelSubscriptionSucceeded['members'] | {}, user: IChannelMember) => {
  delete users[user.id];
  return users;
};

export const PusherReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case UPDATE_PUSHER_INSTANCE: {
      return {
        ...state,
        pusherInstance: action.payload,
      };
    }
    case CHANNEL_USER_LOGIN:
      return {
        ...state,
        users: action.payload,
      };
    case CHANNEL_USER_JOINED:
      return {
        ...state,
        users: addUser(state.users, action.payload),
      };
    case CHANNEL_USER_LEAVED:
      return {
        ...state,
        users: removeUser(state.users, action.payload),
      };
    case CLEAR_PUSHER_REDUCER_STATE:
      return {
        ...InitialState,
      };
    default:
      return state;
  }
};

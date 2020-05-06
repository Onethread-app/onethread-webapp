import Pusher from 'pusher-js';
import {
  PUSHER_CHANNEL_AUTH_END_POINT,
  PUSHER_CHANNEL_CLUSTER,
  PUSHER_CHANNEL_KEY,
} from 'config';
import { User } from 'stores/user/Reducer';
import {
  UPDATE_PUSHER_INSTANCE,
  NEW_MESSAGE,
  ON_USER_STARTED_TYPING,
  ON_USER_STOPPED_TYPING,
  INCREMENT_UNREAD_COUNT_FOR_SINGLE_ROOM,
} from 'stores/room/Types';
import {
  IRoomMessage,
  IRoomMember,
  IRoomFile,
  ITypingUsers,
} from 'stores/room/Reducer';
import { store } from 'Store';
import {
  CHANNEL_USER_LOGIN,
  CHANNEL_USER_JOINED,
  CHANNEL_USER_LEAVED,
} from 'stores/pusher/Types';
import { isEqual } from 'lodash';

export interface IChannelMember {
  id: string;
  info: {
    name: string;
    email: string;
  };
}

export interface IChannelSubscriptionSucceeded {
  members: {
    [id: string]: IChannelMember['info'];
  };
  count: number;
  myID: string;
  me: IChannelMember;
}

export interface INewMessagePayload {
  message: IRoomMessage;
  account: IRoomMember;
  files: IRoomFile[];
}

export const userSubscriber = async () => {
  // Pusher.logToConsole = true;
  const token =
    typeof window !== undefined &&
    localStorage.getItem('tigrow_acc_id')
      ? JSON.parse(localStorage.getItem('tigrow_acc_id')!)
      : null;

  const user: User = await store.getState().userReducer.user;

  const pusher = new Pusher(PUSHER_CHANNEL_KEY!, {
    cluster: PUSHER_CHANNEL_CLUSTER!,
    encrypted: true,
    authEndpoint: PUSHER_CHANNEL_AUTH_END_POINT!,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        account: user._id,
      },
    },
  });

  await store.dispatch({
    type: UPDATE_PUSHER_INSTANCE,
    payload: pusher,
  });

  pusher.connection.bind('error', (err: any) => {
    if (err.error.data.code === 4004) {
      // tslint:disable-next-line: no-console
      console.log('>>> detected limit error', err);
    }
  });

  const channel = pusher.subscribe('presence-quickstart');

  channel.bind(
    'pusher:subscription_succeeded',
    async (data: IChannelSubscriptionSucceeded) => {
      await store.dispatch({
        type: CHANNEL_USER_LOGIN,
        payload: data.members,
      });

      channel.bind(
        'pusher:member_added',
        async (member: IChannelMember) => {
          await store.dispatch({
            type: CHANNEL_USER_JOINED,
            payload: member,
          });
        },
      );

      channel.bind(
        'pusher:member_removed',
        async (member: IChannelMember) => {
          await store.dispatch({
            type: CHANNEL_USER_LEAVED,
            payload: member,
          });
        },
      );
    },
  );
};

export const roomSubscribe = async (roomId: string) => {
  const pusher: Pusher = await store.getState().pusherReducer
    .pusherInstance;
  const channel = pusher.subscribe(`private-${roomId}`);

  // TODO who are currently in the room
  // const presenceChannel = pusher.subscribe(`presence-${roomId}`);

  // presenceChannel.bind('pusher:subscription_succeeded', async (data: any) => {
  //   // tslint:disable-next-line: no-console
  //   console.log('data', data);
  //   presenceChannel.bind('pusher:member_added', (member: any) => {
  //     // tslint:disable-next-line: no-console
  //     console.log('join', member);
  //   });
  //   presenceChannel.bind('pusher:member_removed', (member: any) => {
  //     // tslint:disable-next-line: no-console
  //     console.log('leave', member);
  //   });
  // });
  channel.bind('pusher:subscription_succeeded', async () => {
    // new message hook
    channel.bind('new_message', async (data: INewMessagePayload) => {
      const currentRoomId = await store.getState().roomReducer
        .currentRoom._id;
      if (isEqual(data.message.room, currentRoomId)) {
        await store.dispatch({
          type: ON_USER_STOPPED_TYPING,
          payload: data,
        });
        const formatMessage: IRoomMessage = {
          ...data.message,
          account: data.account,
          files: data.files,
        };
        await store.dispatch({
          type: NEW_MESSAGE,
          payload: formatMessage,
        });
      } else {
        await store.dispatch({
          type: INCREMENT_UNREAD_COUNT_FOR_SINGLE_ROOM,
          payload: data.message.room,
        });
      }
    });

    // user start typing hook
    channel.bind(
      'client-user-start-typing',
      async (data: ITypingUsers) => {
        const currentRoomId = await store.getState().roomReducer
          .currentRoom._id;

        if (isEqual(data.roomId, currentRoomId)) {
          await store.dispatch({
            type: ON_USER_STARTED_TYPING,
            payload: data,
          });
        }
      },
    );

    // user stop typing hook
    channel.bind(
      'client-user-stop-typing',
      async (data: ITypingUsers) => {
        const currentRoomId = await store.getState().roomReducer
          .currentRoom._id;

        if (isEqual(data.roomId, currentRoomId)) {
          await store.dispatch({
            type: ON_USER_STOPPED_TYPING,
            payload: data,
          });
        }
      },
    );
  });
};

export const isTypingStartTrigger = async (
  typingUser: ITypingUsers,
) => {
  const pusher: Pusher = await store.getState().pusherReducer
    .pusherInstance;
  const channel = pusher.subscribe(`private-${typingUser.roomId}`);

  channel.trigger('client-user-start-typing', typingUser);
};

export const isTypingStopTrigger = async (
  typingUser: ITypingUsers,
) => {
  const pusher: Pusher = await store.getState().pusherReducer
    .pusherInstance;
  const channel = pusher.subscribe(`private-${typingUser.roomId}`);

  channel.trigger('client-user-stop-typing', typingUser);
};

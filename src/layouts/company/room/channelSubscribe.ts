import { store } from 'Store';
import Pusher from 'pusher-js';
import { channelAuthEndPoint } from 'config';
import { User } from 'stores/user/Reducer';

export interface IChannelMember {
  id: string;
  info: {
    name: string,
    email: string;
  };
}

export interface IChannelSubscriptionSucceeded {
  members: {
    [key: string]: Array<IChannelMember['info']>;
  };
  count: number;
  myID: string;
  me: IChannelMember;
}

export const userSubscriber = async () => {
  // Pusher.logToConsole = true;
  const token = typeof window !== undefined && localStorage.getItem('tigrow_acc_id') ?
    JSON.parse(localStorage.getItem('tigrow_acc_id')!) : null;

  const user: User = await store.getState().userReducer.user;

  const pusher = new Pusher('7e706af4c123d518ccb5', {
    cluster: 'ap1',
    forceTLS: true,
    authEndpoint: channelAuthEndPoint,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        account: user._id
      }
    }
  });

  pusher.connection.bind('error', (err: any) => {
    if (err.error.data.code === 4004) {
      // tslint:disable-next-line: no-console
      console.log('>>> detected limit error', err);
    }
  });

  const channel = pusher.subscribe('presence-quickstart');

  channel.bind('pusher:subscription_succeeded', async (data: IChannelSubscriptionSucceeded) => {
    // tslint:disable-next-line: no-console
    console.log('data', data);
    channel.bind('pusher:member_added', (member: IChannelMember) => {
      // tslint:disable-next-line: no-console
      console.log('join', member);
    });
    channel.bind('pusher:member_removed', (member: IChannelMember) => {
      // tslint:disable-next-line: no-console
      console.log('leave', member);
    });
  });

};
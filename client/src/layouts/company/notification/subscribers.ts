import { NOTIFICATION } from './../../../stores/notifications/Types';
import { store } from 'Store';
import Pusher from 'pusher-js';
// import {setSocketId} from '../../../stores/notifications/Action'

export const companySubscriber = (companyId: string) => {
  const pusher = new Pusher('1743ba5fa64dd023e3dc', {
    cluster: 'ap1',
    forceTLS: true,
  });
  pusher.connection.bind('connected', function () {
    console.log(pusher.connection.socket_id);
    store.dispatch({
      type: NOTIFICATION.SET_SOCKET_ID,
      payload: pusher.connection.socket_id,
    });
  });
  const channel = pusher.subscribe(
    `${companyId}-${
      store.getState().companyReducer.currentCompany.role
    }`,
  );
  channel.bind(companyId, async (data: any) => {
    console.log('ffffffffff', data);
    let count = 0;
    await store.dispatch({
      type: NOTIFICATION.GET_SUBSCRIBED_NOTIFICATIONS,
      payload: data,
    });
    await store
      .getState()
      .notificationReducer.allNotifications.map(
        (notification: any) => {
          if (notification.read === false) {
            count = count + 1;
          }
        },
      );
    store.dispatch({
      type: NOTIFICATION.SET_READ_COUNT,
      payload: count,
    });
  });
};

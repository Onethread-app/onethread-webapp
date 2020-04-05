import { NOTIFICATION } from './../../../stores/notifications/Types';
import { store } from 'Store';
import Pusher from 'pusher-js';

export const companySubscriber = (companyId: string) => {
  const pusher = new Pusher('2d2483157c37a8782f19', {
    cluster: 'ap2',
    encrypted: true
  });
  const channel = pusher.subscribe(`${companyId}-admin`);

  channel.bind(companyId, async (data: any) => {
    let count = 0;
    await store.dispatch({
      type: NOTIFICATION.GET_SUBSCRIBED_NOTIFICATIONS,
      payload: data
    });
    await store
      .getState()
      .notificationReducer.allNotifications.map((notification: any) => {
        if (notification.read === false) {
          count = count + 1;
        }
      });
    store.dispatch({
      type: NOTIFICATION.SET_READ_COUNT,
      payload: count
    });
  });
};

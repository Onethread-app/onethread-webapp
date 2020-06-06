import { NOTIFICATION } from './../../../stores/notifications/Types';
import { store } from 'Store';
import Pusher from 'pusher-js';
import { INotification } from 'stores/notifications/Reducer';
import { NOTIFICATION_KEY, NOTIFICATION_CLUSTER } from '../../../config';
// import {setSocketId} from '../../../stores/notifications/Action'

<<<<<<< HEAD
export const companySubscriber = async (companyId: string) => {
  const pusher = new Pusher(NOTIFICATION_KEY!, {
    cluster: NOTIFICATION_CLUSTER!,
    forceTLS: true,
=======
export const companySubscriber = (companyId: string) => {
  const pusher = new Pusher('1743ba5fa64dd023e3dc', {
    cluster: 'ap1',
    encrypted: true,
<<<<<<< HEAD
>>>>>>> 0db3de3c... Feat/notification (#198)
=======
>>>>>>> 6d92f22e... Dev (#202)
  });
  pusher.connection.bind('connected', function () {
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
    let count = 0;
    await store.dispatch({
      type: NOTIFICATION.GET_SUBSCRIBED_NOTIFICATIONS,
      payload: data,
    });
    await store
      .getState()
      .notificationReducer.allNotifications.map(
        (notification: INotification) => {
          if (notification.read === false) {
            count = count + 1;
            return count;
          }
          return count;
        },
      );
    store.dispatch({
      type: NOTIFICATION.SET_SEEN_COUNT,
      payload: count,
    });
  });
};

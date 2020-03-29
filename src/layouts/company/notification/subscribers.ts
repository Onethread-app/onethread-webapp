import { NOTIFICATION } from './../../../stores/notifications/Types';
import { store } from 'Store';
import Pusher from 'pusher-js';
// import { subscribeNotification } from '../../../stores/notifications/Action';

export const companySubscriber = (companyId: string) => {
  const pusher = new Pusher('2d2483157c37a8782f19', {
    cluster: 'ap2',
    encrypted: true
  });
  const channel = pusher.subscribe(`${companyId}-admin`);

  console.log('companyId:', companyId);
  channel.bind(companyId, (data: any) => {
    console.log(
      'notification',
      store.getState().companyReducer.currentCompany.name
    );
    store.dispatch({
      type: NOTIFICATION.GET_SUBSCRIBED_NOTIFICATIONS,
      payload: data
    });
  });
};

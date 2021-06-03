import Axios from 'axios';
import { server } from 'config';
import { useEffect, useState } from 'react';
import {
  askUserPermission,
  createNotificationSubscription,
  getUserSubscription,
  isPushNotificationSupported,
  registerServiceWorker,
} from './push-notifications';
import { tokenConfig } from 'stores/UtilsActions';

const pushNotificationSupported = isPushNotificationSupported();

export const usePushNotifications = () => {
  const [userConsent, setSuserConsent] = useState(
    Notification.permission,
  );
  const [userSubscription, setUserSubscription] = useState(null);
  const [
    pushServerSubscriptionId,
    setPushServerSubscriptionId,
  ] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pushNotificationSupported) {
      setLoading(true);
      setError(false);
      registerServiceWorker().then(() => {
        setLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(false);
    const getExixtingSubscription = async () => {
      const existingSubscription = await getUserSubscription();
      setUserSubscription(existingSubscription);
      setLoading(false);
    };
    getExixtingSubscription();
  }, []);

  const AskUserPermission = () => {
    setLoading(true);
    setError(false);
    return askUserPermission().then((consent) => {
      setSuserConsent(consent);
      setLoading(false);
      return consent;
    });
  };

  const subscribeToPushNotification = async () => {
    setLoading(true);
    setError(false);
    return new Promise((resolve, reject) => {
      createNotificationSubscription()
        .then((subscription) => {
          setLoading(false);
          setUserSubscription(subscription);
          localStorage.setItem(
            'pushSubscription',
            JSON.stringify(subscription),
          );
          resolve(subscription);
        })
        .catch((err) => {
          setLoading(false);
          setError(err);
          reject(err);
        });
    });
  };

  const SendPushSubscriptionToServer = async (account, deviceId) => {
    const pushSubscription = JSON.stringify(deviceId);
    const headers = tokenConfig();
    const response = await Axios.post(
      `${server}notifications/webpush/subscription`,
      { account, pushSubscription },
      headers,
    );
    const subscription = JSON.stringify(response.data.subscription);
    localStorage.setItem('pushSubscription', subscription);
  };

  return {
    AskUserPermission,
    subscribeToPushNotification,
    SendPushSubscriptionToServer,
    pushServerSubscriptionId,
    userConsent,
    pushNotificationSupported,
    userSubscription,
    error,
    loading,
  };
};

// export const removePushSubscriptionFromServer = async () => {
//   let pushSubscription = localStorage.getItem('pushSubscription');
//   pushSubscription = JSON.parse(pushSubscription);
//   const url = `${server}notifications/webpush/subscription/${pushSubscription._id}`;
//   const headers = tokenConfig();
//   return Axios.delete(url, headers);
// };

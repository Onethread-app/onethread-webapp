// web-push generate-vapid-keys

import { VAPID_PUBLIC_KEY } from './config';

const pushServerPublicKey = VAPID_PUBLIC_KEY;

function isPushNotificationSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

async function askUserPermission() {
  const res = await Notification.requestPermission();
  return res;
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function registerServiceWorker() {
  return navigator.serviceWorker.register(
    `${process.env.PUBLIC_URL}/service-worker.js`,
  );
}

async function createNotificationSubscription() {
  const serviceWorker = await navigator.serviceWorker.ready;
  const res = await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(pushServerPublicKey),
  });
  return res;
}

function getUserSubscription() {
  return navigator.serviceWorker.ready
    .then((serviceWorker) => serviceWorker.pushManager.getSubscription())
    .then((pushSubscription) => pushSubscription);
}

export {
  isPushNotificationSupported,
  askUserPermission,
  registerServiceWorker,
  createNotificationSubscription,
  getUserSubscription,
};

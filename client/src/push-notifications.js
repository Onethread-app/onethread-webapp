import {VAPID_PUBLIC_KEY } from './config';
const pushServerPublicKey =
  VAPID_PUBLIC_KEY;

function isPushNotificationSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

async function askUserPermission() {
  return await Notification.requestPermission();
}

function registerServiceWorker() {
  return navigator.serviceWorker.register('/sw.js');
}

async function createNotificationSubscription() {
  const serviceWorker = await navigator.serviceWorker.ready;
  return await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(pushServerPublicKey),
  });
}

function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function getUserSubscription() {
  return navigator.serviceWorker.ready
    .then(function (serviceWorker) {
      return serviceWorker.pushManager.getSubscription();
    })
    .then(function (pushSubscription) {
      return pushSubscription;
    });
}

export {
  isPushNotificationSupported,
  askUserPermission,
  registerServiceWorker,
  createNotificationSubscription,
  getUserSubscription,
};

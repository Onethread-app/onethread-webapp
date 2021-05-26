if ('function' === typeof importScripts) {
  importScripts(
    'https://www.gstatic.com/firebasejs/8.6.2/firebase-app.js',
  );
  importScripts(
    'https://www.gstatic.com/firebasejs/8.6.2/firebase-messaging.js',
  );
  firebase.initializeApp({
    apiKey: "AIzaSyAT-A7TOxre30PJWMUYcSrSF9uqOEwymh0",
    authDomain: "onethread-d2992.firebaseapp.com",
    projectId: "onethread-d2992",
    storageBucket: "onethread-d2992.appspot.com",
    messagingSenderId: "399728662753",
    appId: "1:399728662753:web:59417673b698f315787fa0"
  });
  self.addEventListener('push', function (event) {
    const promiseChain = self.registration.showNotification(
      'Hello, World.',
    );

    event.waitUntil(promiseChain);
  });

  self.addEventListener('push', (e) => {
    console.log('push found', e);
  });

  // messaging.onMessage((payload) => {
  //   console.log('paisi', payload);
  // });

  // messaging.onBackgroundMessage(function (payload) {
  //   console.log('Received background message ', payload);

  //   const notificationTitle = payload.notification.title;
  //   const notificationOptions = {
  //     body: payload.notification.body,
  //   };

  //   self.registration.showNotification(
  //     notificationTitle,
  //     notificationOptions,
  //   );
  // });
}


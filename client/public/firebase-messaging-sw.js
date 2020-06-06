<<<<<<< HEAD
<<<<<<< HEAD
if ('function' === typeof importScripts) {
  importScripts(
    'https://www.gstatic.com/firebasejs/3.5.0/firebase-app.js',
  );
  importScripts(
    'https://www.gstatic.com/firebasejs/3.5.0/firebase-messaging.js',
  );

  firebase.initializeApp({
    messagingSenderId: '1048253941784',
  });
}
=======
=======
>>>>>>> 6d92f22e... Dev (#202)
importScripts(
  'https://www.gstatic.com/firebasejs/3.5.0/firebase-app.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/3.5.0/firebase-messaging.js',
);

firebase.initializeApp({
  messagingSenderId: '1048253941784',
});

const initMessaging = firebase.messaging();
<<<<<<< HEAD
>>>>>>> 0db3de3c... Feat/notification (#198)
=======
>>>>>>> 6d92f22e... Dev (#202)

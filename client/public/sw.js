function receivePushNotification(event) {
  const { notification } = event.data.json();
  const options = { ...notification };
  event.waitUntil(
    self.registration.showNotification(options.title, options),
  );
}

function openPushNotification(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
}

self.addEventListener('push', receivePushNotification);
self.addEventListener('notificationclick', openPushNotification);
let CACHE_NAME = 'onethread';
let urlsToCache = [
    './?v3',
    'sw.js?v3',
    'manifest.json?v3',
    'style.css?v3',
    'script.js?v3',
    'logo.png?v3',
    'logo_192.png?v3',
    'logo_256.png?v3',
    'logo_512.png?v3',
    'https://fonts.googleapis.com/css?family=Special+Elite'
];
console.log('loading sw');

self.addEventListener('install', function(event) {
    // Perform install steps
    console.log('installing sw');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                var x = cache.addAll(urlsToCache);
                console.log('cache added');
                return x;
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                }
            )
    );
});

const CACHE_NAME = 'prudent-rm-v2.0';
const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/data.js',
  '/manifest.json',
  '/assets/logo.png',
  '/assets/icon-ldpi.png',
  '/assets/icon-mdpi.png',
  '/assets/icon-hdpi.png',
  '/assets/icon-xhdpi.png',
  '/assets/icon-xxhdpi.png',
  '/assets/icon-xxxhdpi.png'
];

// Install event - cache assets
self.addEventListener('install', e => {
  console.log('Service Worker: Installing...');
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching assets');
        return cache.addAll(ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Assets cached');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', e => {
  console.log('Service Worker: Activating...');
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(e.request)
          .then(fetchResponse => {
            // Don't cache non-successful responses
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }

            // Clone the response
            const responseToCache = fetchResponse.clone();

            // Add to cache for future use
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(e.request, responseToCache);
              });

            return fetchResponse;
          })
          .catch(() => {
            // If both cache and network fail, return offline page
            if (e.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', e => {
  if (e.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    e.waitUntil(doBackgroundSync());
  }
});

// Push notifications
self.addEventListener('push', e => {
  const options = {
    body: e.data ? e.data.text() : 'New notification from Prudent RM',
    icon: '/assets/logo.png',
    badge: '/assets/icon-hdpi.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/assets/logo.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/logo.png'
      }
    ]
  };

  e.waitUntil(
    self.registration.showNotification('Prudent MF RM', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', e => {
  e.notification.close();

  if (e.action === 'explore') {
    e.waitUntil(
      clients.openWindow('/')
    );
  }
});

async function doBackgroundSync() {
  // Handle offline actions when back online
  console.log('Service Worker: Performing background sync');
}

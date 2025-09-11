// Sigma Audley Service Worker v1.0.0
// Progressive Web App for Research Peptides

const CACHE_NAME = 'sigma-audley-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/complete-research-peptide-catalog.html',
  '/products/semaglutide-10mg-research.html',
  '/products/tirzepatide-15mg-research.html',
  '/favicon.ico'
];

// Install Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        var fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(
          function(response) {
            // Check if valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            var responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        );
      })
  );
});

// Update Service Worker
self.addEventListener('activate', function(event) {
  var cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for research inquiries
self.addEventListener('sync', function(event) {
  if (event.tag === 'research-inquiry') {
    event.waitUntil(sendResearchInquiry());
  }
});

// Push notifications for order updates
self.addEventListener('push', function(event) {
  const options = {
    body: event.data.text(),
    icon: '/images/icon-192x192.png',
    badge: '/images/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Sigma Audley Research Update', options)
  );
});
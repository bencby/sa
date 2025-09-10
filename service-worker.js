// ═══════════════════════════════════════════════════════════════════
// SIGMA AUDLEY PWA SERVICE WORKER - PERFORMANCE & SEO OPTIMIZATION
// ═══════════════════════════════════════════════════════════════════

const CACHE_NAME = 'sigma-audley-v2025.09.10';
const STATIC_CACHE = 'sigma-audley-static-v2';
const DYNAMIC_CACHE = 'sigma-audley-dynamic-v2';
const IMAGE_CACHE = 'sigma-audley-images-v1';
const API_CACHE = 'sigma-audley-api-v1';

// Files to cache for offline access (SEO benefit)
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/complete-research-peptide-catalog.html',
  '/products/semaglutide-10mg-research.html',
  '/products/tirzepatide-15mg-research.html',
  '/products/retatrutide-5mg-peptide.html',
  '/glp1-forum-verified-excellence.html',
  '/certificate-of-analysis.html',
  '/404.html',
  '/css/style.css',
  '/js/main.js',
  '/images/logo.png',
  '/robots.txt',
  '/sitemap.xml'
];

// Install event - cache static files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_FILES))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => {
        return Promise.all(
          keys.filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            .map(key => caches.delete(key))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then(fetchResponse => {
            // Don't cache non-successful responses
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }
            
            // Cache successful responses
            const responseToCache = fetchResponse.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(event.request, responseToCache));
            
            return fetchResponse;
          })
          .catch(() => {
            // Return 404 page for failed requests
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/404.html');
            }
          });
      })
  );
});

// Background sync for analytics (SEO tracking)
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Track offline usage for SEO analytics
      fetch('/api/analytics/offline-usage', {
        method: 'POST',
        body: JSON.stringify({
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          referrer: document.referrer
        })
      }).catch(() => {
        // Silently fail if analytics unavailable
      })
    );
  }
});

// Push notifications (for engagement metrics)
self.addEventListener('push', event => {
  const options = {
    body: 'New research peptides available at Sigma Audley',
    icon: '/images/icon-192x192.png',
    badge: '/images/badge-72x72.png',
    data: {
      url: 'https://sigmaaudley.net/complete-research-peptide-catalog.html'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Sigma Audley Update', options)
  );
});

// Notification click handling (drives traffic)
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || 'https://sigmaaudley.net/')
  );
});
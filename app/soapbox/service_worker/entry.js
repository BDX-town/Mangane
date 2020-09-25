import './web_push_notifications';

function openWebCache() {
  return caches.open('soapbox-web');
}

function fetchRoot() {
  return fetch('/', { credentials: 'include', redirect: 'manual' });
}

// Cause a new version of a registered Service Worker to replace an existing one
// that is already installed, and replace the currently active worker on open pages.
self.addEventListener('install', function(event) {
  event.waitUntil(Promise.all([openWebCache(), fetchRoot()]).then(([cache, root]) => cache.put('/', root)));
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

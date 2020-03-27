// import { freeStorage, storageFreeable } from '../storage/modifier';
import './web_push_notifications';

// function openSystemCache() {
//   return caches.open('gabsocial-system');
// }

function openWebCache() {
  return caches.open('gabsocial-web');
}

function fetchRoot() {
  return fetch('/', { credentials: 'include', redirect: 'manual' });
}

// const firefox = navigator.userAgent.match(/Firefox\/(\d+)/);
// const invalidOnlyIfCached = firefox && firefox[1] < 60;

// Cause a new version of a registered Service Worker to replace an existing one
// that is already installed, and replace the currently active worker on open pages.
self.addEventListener('install', function(event) {
  event.waitUntil(Promise.all([openWebCache(), fetchRoot()]).then(([cache, root]) => cache.put('/', root)));
});
self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', function(event) {
  const url = new URL(event.request.url);

  if (url.pathname === '/auth/sign_out') {
    const asyncResponse = fetch(event.request);
    const asyncCache = openWebCache();

    event.respondWith(asyncResponse.then(response => {
      if (response.ok || response.type === 'opaqueredirect') {
        return Promise.all([
          asyncCache.then(cache => cache.delete('/')),
          indexedDB.deleteDatabase('gabsocial'),
        ]).then(() => response);
      }

      return response;
    }));
  } else if (
    url.pathname.startsWith('/system') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/settings') ||
    url.pathname.startsWith('/media') ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/about') ||
    url.pathname.startsWith('/auth') ||
    url.pathname.startsWith('/oauth') ||
    url.pathname.startsWith('/invites') ||
    url.pathname.startsWith('/pghero') ||
    url.pathname.startsWith('/sidekiq') ||
    url.pathname.startsWith('/filters') ||
    url.pathname.startsWith('/tags') ||
    url.pathname.startsWith('/emojis') ||
    url.pathname.startsWith('/inbox') ||
    url.pathname.startsWith('/accounts') ||
    url.pathname.startsWith('/user') ||
    url.pathname.startsWith('/users') ||
    url.pathname.startsWith('/src') ||
    url.pathname.startsWith('/public') ||
    url.pathname.startsWith('/avatars') ||
    url.pathname.startsWith('/authorize_follow') ||
    url.pathname.startsWith('/media_proxy') ||
    url.pathname.startsWith('/relationships')) {
    //non-webapp routes
  } else if (url.pathname.startsWith('/')) {
    // : TODO : if is /web
    const asyncResponse = fetchRoot();
    const asyncCache = openWebCache();

    event.respondWith(asyncResponse.then(
      response => {
        const clonedResponse = response.clone();
        asyncCache.then(cache => cache.put('/', clonedResponse)).catch();
        return response;
      },
      () => asyncCache.then(cache => cache.match('/'))));
  } /* else if (storageFreeable && (ATTACHMENT_HOST ? url.host === ATTACHMENT_HOST : url.pathname.startsWith('/system/'))) {
    event.respondWith(openSystemCache().then(cache => {
      return cache.match(event.request.url).then(cached => {
        if (cached === undefined) {
          const asyncResponse = invalidOnlyIfCached && event.request.cache === 'only-if-cached' ?
            fetch(event.request, { cache: 'no-cache' }) : fetch(event.request);

          return asyncResponse.then(response => {
            if (response.ok) {
              cache
                .put(event.request.url, response.clone())
                .catch(()=>{}).then(freeStorage()).catch();
            }

            return response;
          });
        }

        return cached;
      });
    }));
  } */
});

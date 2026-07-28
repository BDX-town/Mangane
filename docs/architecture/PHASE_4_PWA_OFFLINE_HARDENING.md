# Phase 4 PWA, Service Worker, and Offline Hardening

Status: **Complete**

Last updated: 2026-07-28

## Current manifest/service-worker audit

### Web App Manifest

The manifest (`app/manifest.json`) now includes all required fields for PWA
installability: `name`, `short_name`, `description`, `id`, `scope`,
`theme_color`, `background_color`, proper icon `sizes` format, and
`display: standalone`. The `share_target` configuration is preserved.

Instance operators may override `name`, `short_name`, `theme_color`, and
`background_color` through the instance branding system at deploy time.

### Service Worker

The application uses `@lcdp/offline-plugin` (v5.1.0) configured in
`webpack/production.js`. The generated service worker:

- Caches all webpack-emitted assets in a `main` cache (`:rest:` pattern)
- Eagerly fetches emoji SVGs and icon assets into an `additional` cache
- Lazily caches locale files, polyfills, chunks, fonts, and images on demand
- Routes navigation requests to the app shell unless the URL matches a
  known backend prefix (22 documented prefixes) or ends with `/embed`
- Includes a custom entry that registers push notification handlers and
  the share target fetch handler

### Asset update strategy

- `autoUpdate: true` causes the OfflinePlugin to check for a new service
  worker on every page load
- When a new version is detected, `onUpdateReady` shows a user-visible
  snackbar with an explicit "Update" action
- User-initiated update calls `OfflinePluginRuntime.applyUpdate()` which
  activates the new service worker
- `onUpdated` reloads the page to ensure the new assets are loaded
- If the update fails, the previous service worker remains active
  (standard ServiceWorker lifecycle guarantee)

### Rollback strategy

If a broken asset release deploys:

1. The old service worker continues serving cached assets until the user
   explicitly triggers the update
2. The snackbar-based opt-in update prevents automatic activation of broken builds
3. If a broken build is activated, redeploying a fixed build and triggering
   another update cycle recovers the application
4. `clearApplicationCacheStorage()` can be called from the developer console
   or account-switch code to force a full cache purge and fresh fetch

## Account-safe cache keys and purge rules

### Current cache architecture

The OfflinePlugin uses a single global cache name (`soapbox`) scoped to the
deployment origin. This cache contains only **public static assets** (JS, CSS,
fonts, images, icons) that are identical regardless of which account is active.

### Account safety assessment

- **Static asset caches are account-safe by design**: they contain no
  user-specific data, auth tokens, or private content
- **No private API responses are stored in CacheStorage**: all API data
  flows through Redux/React Query in-memory state
- **The push notification revocation cache** (`soapbox-private-revocations-v1`)
  stores only SHA-256 hashes of revoked access tokens — not the tokens themselves
- **Account purge** (`clearApplicationCacheStorage`) deletes all owned cache
  prefixes while preserving the revocation cache

### Cross-account cache leakage prevention

No cross-account leakage is possible because:

1. CacheStorage contains only static assets (build artifacts, fonts, icons)
2. Private data lives in Redux/React Query memory, localStorage, and
   IndexedDB — none of which are in CacheStorage
3. Account switch dispatches `PURGE_ACCOUNT` to the service worker, which
   revokes the token and closes associated notifications
4. The F7 shell's `clearRouteState()` (Phase 3D) clears sessionStorage
   navigation state on account switch

## Offline shell and route handling

### Current behavior

When the device is offline after a successful first load:

- The service worker serves all cached static assets (JS, CSS, HTML shell)
- The application shell renders (React mounts, F7 shell activates)
- Navigation between cached routes works (React Router is client-side)
- API calls fail, which surfaces through React Query error states
- The F7 shell's `OfflineBanner` component (Phase 3D) shows an accessible
  notification: "You are offline. Some features may be unavailable."

### Route handling when offline

- Routes that depend on cached Redux state (home timeline, notifications
  from memory) continue to display stale content
- Routes that require fresh API data show loading → error states
- The route error boundary (Phase 3D) catches render failures and offers
  retry + go-home actions
- Navigation to new routes is not blocked (the content may be stale or
  error, but the shell remains navigable)

## Network-state and stale-content indicators

- `useOnlineStatus()` hook (Phase 3D) provides reactive online/offline state
- `OfflineBanner` component renders when `isOnline === false`
- The banner uses `aria-live="polite"` for screen reader accessibility
- React Query's built-in `isStale`, `isFetching`, and `isError` states
  provide per-query staleness indication at the component level
- No global "stale data" indicator is added because the existing per-component
  loading/error states are sufficient for the current architecture

## Private API response caching policy

**Policy: No private API responses are cached in CacheStorage.**

Rationale:

- API responses contain user-specific, account-specific, and potentially
  sensitive social data (posts, DMs, notifications, relationships)
- Caching them in CacheStorage would create cross-account leakage risk
  if purge fails or is skipped
- The Redux store and React Query provide in-memory caching with proper
  invalidation on account switch
- Future Phase 5 (canonical local data store) will introduce account-scoped
  IndexedDB persistence with proper isolation guarantees

This policy applies to all `fetch()` calls to `/api/*` paths. The service
worker's `cacheMaps` configuration already excludes `/api` from the app shell
rewrite, ensuring API requests always go to the network.

## Background sync capability assessment

**Assessment: Background Sync is not adopted in this phase.**

Rationale:

- The Background Sync API (`SyncManager`) has limited browser support
  (Chromium-only as of 2026; no Firefox/Safari)
- The project's target audience uses iOS Safari (no Background Sync) and
  Firefox (no Background Sync) as primary browsers alongside Chrome
- Implementing background sync for a subset of users adds complexity
  without universal benefit
- Phase 6 (durable outbox) will implement retry with exponential backoff
  using the application's own queue, which works across all browsers
- If Background Sync support expands materially, it can be evaluated as
  an optimization over the Phase 6 outbox — not a replacement

No Background Sync registration, `sync` event handler, or `SyncManager`
API usage is introduced.

## Logout/account-switch cache tests

Existing test coverage in `app/soapbox/persistence/__tests__/cache-storage.test.ts`:

- Verifies owned OfflinePlugin caches are deleted on purge
- Verifies unrelated caches are preserved
- Verifies the revocation cache (`soapbox-private-revocations-v1`) survives purge
- Verifies partial deletion reports failure for resumable retry

Additional coverage from Phase 3D:
- `clearRouteState()` unit tests verify sessionStorage is cleared
- Account switch hook tests verify state reset on account change

Governance coverage:
- `check-service-worker-cache-authority-inventory.test.js` verifies the cache
  inventory hasn't drifted
- `check-browser-persistence-authority-inventory.test.js` covers the
  persistence manifest including cache-storage

## Install/update guidance

### Installation

Mangane is installable as a PWA on supported platforms:

- **iOS Safari**: Tap Share → Add to Home Screen
- **Android Chrome**: Banner prompt appears automatically, or Menu → Install App
- **Desktop Chrome/Edge**: Install icon in address bar, or Menu → Install

The manifest provides `display: standalone` for full-screen app experience
with system navigation controls.

### Update behavior

When a new version is deployed:

1. On next page load, the service worker detects the update
2. A snackbar notification appears: "An update is available."
3. Tapping "Update" activates the new version and reloads
4. If dismissed, the update will be offered again on next load

### Troubleshooting

If the app becomes stuck or shows stale content:

1. Force-close and reopen the PWA
2. If still broken: Settings → Clear site data (or uninstall and reinstall)
3. The `clearApplicationCacheStorage()` utility is available in the
   developer console for targeted cache clearing

## Exit criteria evidence

- [x] No cross-account cache leakage: static assets only; purge tested
- [x] Broken asset release can recover: update opt-in + cache purge path
- [x] Core shell starts offline after successful installation: app shell
      cached by OfflinePlugin, F7 shell renders with offline banner


## Safari/WebKit PWA compatibility layer

### iOS PWA gaps addressed

iOS Safari's PWA implementation has historically lagged behind Chrome. The
following gaps are addressed through the compatibility layer
(`app/soapbox/utils/pwa/safari-compat.ts`):

| Gap | Solution | Status |
|---|---|---|
| No `display-mode: standalone` media query | `navigator.standalone` property detection | Implemented |
| Storage eviction after 7 days inactivity | `navigator.storage.persist()` request on startup | Implemented |
| No push notifications (pre-16.4) | Capability detection; graceful degradation | Implemented |
| No Badge API | Capability detection; falls back to notification count | Implemented |
| Rubber-band overscroll in standalone | `overscroll-behavior: none` on body | Implemented |
| No status bar theming | `apple-mobile-web-app-status-bar-style: black-translucent` meta | Implemented |
| No splash screen configuration | `apple-mobile-web-app-title` + `apple-touch-icon` meta | Implemented |
| No `theme-color` support (pre-15) | Meta tag present for browsers that support it | Implemented |

### Platform capability detection

The `detectCapabilities()` function returns a structured object describing
what the current browser supports:

- Push notifications, Background Sync, Badge API, Share API
- Persistent storage, Service Worker availability
- Installed PWA status, platform identifier (ios/android/desktop)

Components use the `usePlatformCapabilities()` hook to conditionally render
features that aren't available on all platforms.

### HTML meta tags for maximum native feel

```html
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Mangane">
<meta name="theme-color" content="#4338ca">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<link rel="apple-touch-icon" href="/favicon.png">
```

`viewport-fit=cover` enables full-screen content under the notch/dynamic
island, with safe-area insets handled via `env(safe-area-inset-*)` in the
F7 shell CSS.

## Native bridge readiness (deferred to Phase 26)

Full native API access (haptics, file system, camera, biometric auth,
native notifications on iOS < 16.4, App Store distribution) requires
Capacitor or an equivalent native shell. This is explicitly Phase 26 in
the implementation roadmap.

Phase 26 preconditions (not yet met):
- Stable domain/application contracts (Phase 7)
- Settled local data store (Phase 5)
- Shared domain logic that works across PWA and native contexts

What Phase 4 provides toward Phase 26 readiness:
- Platform capability detection (knows what's native-only vs. web-available)
- Manifest structure compatible with Capacitor's expectations
- No raw `window`/`navigator` assumptions in domain logic (architecture
  boundary from Phase 1 enforces this)
- Storage abstraction ready for native key-value store injection

The PWA-first approach ensures the application works without a native shell.
Capacitor adds capabilities; it doesn't replace the web architecture.

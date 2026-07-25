# Service Worker Cache Authority Drift Gate

Status: **Current / bounded Phase 0 evidence**

This gate pins the inherited production service-worker and app-shell caching configuration in `webpack/production.js`, together with the production worker entry in `app/soapbox/service_worker/entry.ts`.

It verifies that the current production build:

- enables inherited OfflinePlugin auto-update behavior;
- uses the global cache name `soapbox`;
- assigns `:rest:` to the main cache;
- records the current additional and optional asset cache patterns;
- uses `FE_SUBDIRECTORY` when constructing the app-shell path;
- restricts the cache-map rule to navigation requests;
- bypasses the app-shell rewrite for the currently recorded backend route prefixes and `/embed` suffix;
- builds the worker from the entry that imports the push and share-target handlers.

A passing gate does **not** mean the production service worker is account-safe or fully hardened. The inherited configuration uses a global and unscoped cache name, and authenticated-response caching is not proven absent.

The backend route prefixes are compatibility evidence, not a complete security allowlist. Production edge rewrites, proxy behavior, deployment subdirectories, backend extensions, and future routes require end-to-end verification rather than assumptions based on this bounded source inventory.

The following remain explicit blockers:

- prove that credential-bearing and account-private API responses cannot enter Cache Storage;
- scope cache ownership by deployment, version, instance, and account where private data can exist;
- define cache schema, migration, rollback, quota, corruption, and stale-worker recovery behavior;
- logout and account switching must receive deterministic cache-purge tests;
- verify worker update activation across multiple tabs and incompatible application versions;
- verify redirect, credential mode, content-type, and cross-origin asset behavior;
- test production edge rewrite precedence and backend-route completeness.

A future Phase 4 replacement must preserve required offline shell behavior while failing closed around authenticated content. Cache changes require explicit migration and rollback handling; changing a cache name alone is not a safe purge strategy.

The executable checker is `scripts/check-service-worker-cache-authority-inventory.js`. Focused regression tests use Node's built-in test runner, and the dedicated workflow has read-only repository permissions.

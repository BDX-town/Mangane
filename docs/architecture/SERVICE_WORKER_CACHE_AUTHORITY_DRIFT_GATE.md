# Service Worker Cache Authority Drift Gate

Status: **Phase 0C verified**

This gate pins the production OfflinePlugin/app-shell configuration, production worker entry, and normal account-purge cache ownership.

It verifies that the production build:

- enables inherited OfflinePlugin auto-update behavior;
- uses deployment-origin cache prefix `soapbox`;
- assigns compiled `:rest:`, external files, icons, locale chunks, polyfills, fonts, and images to reviewed build-asset groups;
- uses `FE_SUBDIRECTORY` for the app shell;
- limits the cache-map rule to navigation requests;
- bypasses the app-shell rewrite for the recorded backend route prefixes and `/embed`;
- builds the worker entry with push and share-target handlers.

Phase 0C classifies the configured cache inputs as public application shell and build assets. Backend/API navigation routes bypass the shell rule. No application callsite writes authenticated API responses to Cache Storage.

During logout/account removal, normal account purge deletes application-owned cache prefixes `soapbox` and `webpack-offline`. The restart-durable worker revocation cache is explicitly protected from that pass so purging one account cannot erase another account’s revocation fence. Emergency reset intentionally deletes every visible origin cache.

Cache migration, rollback, corruption and quota behavior is recorded in `PERSISTENCE_MIGRATION_REGISTRY.md`: shell caches are disposable, failed deletion keeps the purge tombstone pending, and network/build restoration is the rollback. Generated OfflinePlugin cache suffixes are library-owned, so cleanup matches reviewed prefixes.

The backend route prefixes are compatibility evidence, not a complete security allowlist. Production edge rewrite precedence and future backend routes require deployment verification. Cross-origin asset redirect, credential-mode, and content-type policies remain transport/deployment concerns, not unclassified persistence stores.

Run:

```sh
node scripts/check-service-worker-cache-authority-inventory.js
node --test scripts/__tests__/check-service-worker-cache-authority-inventory.test.js
```

The dedicated workflow has read-only repository permissions. Fixture tests prove cache-name, backend-prefix, navigation type, basename, worker imports, optional-cache safety, purge evidence, constraints, and path safety fail closed on drift.

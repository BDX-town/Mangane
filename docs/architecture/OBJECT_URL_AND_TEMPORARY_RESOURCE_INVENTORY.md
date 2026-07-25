# Object URL and Temporary Resource Inventory

Status: **Phase 0C complete**

The machine-readable authority is [`config/persistence-manifest.json`](../../config/persistence-manifest.json). Production object URL ownership is centralized in `app/soapbox/persistence/object-urls.ts`.

Current producers are media-duration inspection, image resizing, onboarding avatar/header previews, profile-editing previews, administrator CSV downloads, and audio downloads. Each creates through `createTrackedObjectURL()` and uses `revokeTrackedObjectURL()` on its ordinary completion, replacement, error, or unmount path. Account purge and emergency reset call `revokeAllTrackedObjectURLs()`, which supplies the deterministic fallback for interrupted component lifecycles.

Rules enforced by source discovery and tests:

1. Direct application object URL creation is confined to the registry.
2. Every created URL is registered before it is returned.
3. Explicit revocation removes the registry entry and repeated revocation is harmless.
4. Logout, account removal, and emergency reset revoke the complete registry.
5. Blob URLs are never persisted.
6. The registry itself is page-memory only and cannot restore data after reload.

Blob, FileReader, and generated-download sites are separately enumerated by the persistence manifest. No dedicated durable upload queue, draft blob store, outbox, temporary-file store, or background blob journal was discovered.

Jest covers registry creation, explicit repeated revocation, complete purge revocation, media metadata success/error cleanup, and the coordinator ordering. A new direct `URL.createObjectURL` or `URL.revokeObjectURL` call changes the generated manifest and fails CI until ownership and cleanup are reconciled.

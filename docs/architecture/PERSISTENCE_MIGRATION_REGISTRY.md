# Persistence Migration Registry

Status: **Phase 0C complete**

| Surface | Current schema and migration | Rollback/corruption behavior | Quota behavior |
|---|---|---|---|
| Auth graph | Unversioned namespaced JSON; legacy `soapbox:auth:app` and `soapbox:auth:user` are read only when current state is absent and are deleted during account purge | Parsing fails closed and removes malformed credential authority; future versioning must validate and commit the new envelope before deleting the predecessor | Failed normal writes retain in-memory state; purge attempts a sanitized write and deletes the whole credential record if that write fails |
| Selected account | Unversioned session string validated against the auth graph | Missing/invalid selection falls back to a valid retained user; purge removes a matching selection | Failure is non-authoritative and cannot block credential cleanup |
| Account snapshots | Unversioned disposable `authAccount:<URL>` cache | Missing/malformed data causes network verification; tombstones fence stale rewrites; deletion failure is crash-resumable | Failure is isolated and leaves purge pending |
| Instance/config snapshots | Unversioned disposable `instance:<host>` and `soapbox_config:<host>` caches | Live network/config authority may replace them; no destructive migration is performed in Phase 0 | Existing writers report failures; origin reset is the recovery boundary |
| React Query | In-memory singleton, no hydration/persistence | Cancellation plus session/account response generation fences prevent old results from committing after transitions | Not applicable to durable quota |
| Lifecycle journal | Versioned schema 1 at `soapbox:persistence:lifecycle:v1` | Invalid/unsupported records are removed; the independent purge tombstone remains the recovery authority | An in-memory generation fence remains active when persistence fails, and purge cannot be marked complete |
| OfflinePlugin caches | Plugin/build-owned cache schema, limited to public application shell/static resources by webpack configuration | Normal purge deletes owned prefixes; update failure falls back to network/rebuild; emergency reset clears all visible caches | Partial deletion is a failed purge step and is retried from the tombstone |
| Worker revocation journal | SHA-256 token-fingerprint entries in versioned cache `soapbox-private-revocations-v1` | Entries are additive and idempotent; invalid/missing entry means a purge cannot receive its acknowledgement | Cache write failure rejects acknowledgement and leaves purge pending |
| Object URL registry | In-memory set, no durable schema | Revocation is idempotent; logout/reset revokes the full registry | Not quota-backed |

Migration rule: validate into a new versioned record, commit it, read it back when the storage API permits, and only then remove the predecessor. Repeating any interrupted step must be safe. Credential-bearing values and raw storage errors must never appear in migration logs or purge reports.

Rollback rule: caches may be discarded and rebuilt. Credential authority must fail closed rather than roll back to malformed or partially migrated credentials. A failed local deletion keeps the non-secret tombstone and blocks snapshot writers until a later bootstrap completes cleanup.

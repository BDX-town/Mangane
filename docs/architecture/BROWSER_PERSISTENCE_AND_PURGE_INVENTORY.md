# Browser Persistence and Purge Inventory

Status: **Phase 0C complete**

The exhaustive callsite authority is [`config/persistence-manifest.json`](../../config/persistence-manifest.json). The behavioral authority is [`config/browser-persistence-authority-inventory.json`](../../config/browser-persistence-authority-inventory.json). Both are checked in CI; adding or removing a discovered persistence API or weakening a required lifecycle binding fails the gate.

## Surface classification

| Surface | Authority and scope | Lifecycle and cleanup |
|---|---|---|
| Namespaced auth `localStorage` | Deployment-scoped multi-account credential authority | Fail-closed JSON reads; logout removes the exact account and token, clears matching selection, removes legacy duplicates, and deletes the entire malformed/unwritable authority record rather than retaining credentials |
| Auth selection `sessionStorage` | Per-tab selected-account marker | Validated by the auth graph and removed when it selects the purged account |
| localForage/IndexedDB | Origin database `soapbox`, store `keyvaluepairs`; individual keys encode host or account | Account purge removes `authAccount:<account URL>`; origin emergency reset clears the store; failed deletion retains the durable purge tombstone for bootstrap resumption |
| Redux | In-memory canonical UI state | `AUTH_LOGGED_OUT` removes account credentials and resets non-whitelisted projections; the purge coordinator bounds this independently from remote revocation |
| React Query | Global in-memory remote-data cache | Logout cancels and clears the singleton; all stateful Axios responses are additionally rejected after a session/account generation transition |
| Cache Storage / OfflinePlugin | Origin-wide public application shell caches with owned `soapbox` and `webpack-offline` prefixes | Normal account purge deletes owned caches; emergency reset deletes every visible cache; partial deletion leaves the purge resumable |
| Service worker revocation journal | SHA-256 token fingerprints in `soapbox-private-revocations-v1` | Worker checks before a push fetch, after fetch, and before notification actions; purge awaits a worker acknowledgement so restart-durable revocation is committed |
| Native notifications | Browser/OS projection containing display fields, destination, identifiers, and inherited action token data | Matching notifications are closed, push is unsubscribed, and the token is durably revoked; stale actions fail closed |
| Persistence lifecycle journal | Versioned `soapbox:persistence:lifecycle:v1` plus an in-memory fence | Account generations move through active, purging, and purged states; corrupt metadata fails closed to the independent purge tombstone |
| Cross-tab protocol | Versioned, token-free BroadcastChannel plus storage-event fallback | Carries account URL and generation only; malformed, oversized, unsupported-scheme, self-originated, and stale messages are ignored |
| Object URLs | Page-memory registry; never durable | Every production creation uses the tracked helper; replacement/unmount paths revoke individually and logout/reset revokes the complete registry |
| Blob/FileReader/media previews | Temporary component or utility memory | Creation and cleanup callsites are inventoried; no blob URL is persisted |
| Cookies | No production application-JavaScript cookie callsite discovered | HttpOnly cookies remain server authority and are handled by sign-out/revocation endpoints; JavaScript cannot enumerate or delete them |
| Drafts, outboxes, upload queues, background journals, search/intelligence stores, temporary files | No dedicated durable production store discovered | Any future callsite appears as manifest drift and must be classified before merge |

## Purge contract

`purgeAccountScope()` is ordered, independently bounded, failure-isolated, idempotent, and deduplicated per account:

1. persist the purge tombstone and revoke the account generation;
2. broadcast the token-free purge generation to other tabs;
3. disconnect active WebSocket streams and polling;
4. cancel and clear React Query;
5. attempt bounded remote OAuth revocation;
6. remove local Redux account state;
7. remove serialized credentials and session selection;
8. remove the account IndexedDB snapshot and transient OAuth keys;
9. delete application-owned Cache Storage;
10. durably revoke worker actions, unsubscribe push, and close notifications;
11. revoke tracked object URLs and temporary resources;
12. complete the lifecycle record and tombstone only if every local step succeeded.

Remote failure never blocks local cleanup. Timeout, quota denial, corruption, IndexedDB failure, cache deletion failure, or worker acknowledgement failure is sanitized in the result and leaves the tombstone pending. Bootstrap calls `resumePendingPurges()` before normal use of restored account snapshots.

## Stale-actor guarantees

- Stateful Axios clients capture both tab-session and account generations. Responses and errors from an inactive generation throw `StaleSessionGenerationError` before action callbacks can commit them.
- WebSocket and polling callbacks capture the tab-session generation; purge closes the live registry and stale callbacks no-op.
- Snapshot writers check the durable tombstone immediately before their write.
- Cross-tab receivers run the same local purge without rebroadcast loops.
- Service workers store only a one-way SHA-256 token fingerprint in their revocation journal and check it across worker restarts.
- The purge step waits for `PURGE_ACCOUNT_ACK`; a worker that cannot persist the fence cannot cause the purge to be recorded complete.
- Native notifications are closed and push subscriptions are removed independently.

## Migration, rollback, quota, and corruption

The full disposition registry is [`PERSISTENCE_MIGRATION_REGISTRY.md`](./PERSISTENCE_MIGRATION_REGISTRY.md). Existing unversioned caches are treated as disposable; credential authority uses fail-closed parsing. The lifecycle journal is versioned. No migration deletes its predecessor before a validated replacement is committed. Quota or storage denial cannot make local in-memory cleanup contingent on a durable write, and it cannot silently mark purge completion.

## Deterministic temporary-resource lifecycle

The source and test evidence is detailed in [`OBJECT_URL_AND_TEMPORARY_RESOURCE_INVENTORY.md`](./OBJECT_URL_AND_TEMPORARY_RESOURCE_INVENTORY.md). Direct application `URL.createObjectURL` and `URL.revokeObjectURL` calls are centralized in the registry, which makes complete logout/reset revocation possible.

## Conformance evidence

Jest tests cover ordered purge, remote failure, timeouts, concurrent deduplication, crash resumption, quota denial, credential corruption, credential-write quota fallback, stale HTTP responses, account generations, token-free cross-tab messages, storage-event propagation, owned-cache deletion, partial cache deletion, emergency reset, and complete object-URL revocation.

The Node authority suites mutate source and manifests adversarially to prove that credential, generation, cache, worker, cross-tab, purge, and object-URL bindings cannot be silently removed. The production webpack build compiles the actual OfflinePlugin and service-worker integration.

## Browser constraints

Browser termination can interrupt cleanup; the persistent tombstone makes the next bootstrap resume it. HttpOnly cookies remain server-controlled. Cache cleanup during normal logout is limited to application-owned prefixes, while emergency reset is deliberately origin-wide. Browser APIs cannot enumerate object URLs created outside the registry, so direct creation outside the helper is prohibited and detected as persistence-manifest drift.

# Account and Instance Isolation Matrix

Status: **Current / Phase 0 in progress**

Last updated: 2026-07-23

## Purpose

This document begins the required Phase 0 reconciliation of account, instance, credential, cache, persistence, worker, and asynchronous-response isolation. It records verified current behavior and explicit unknowns. It does not claim logout or account switching is privacy-complete.

## Isolation standard

An account transition is complete only when the old scope cannot remain readable, executable, observable, or capable of repopulating state through:

- Redux;
- React Query;
- localStorage or sessionStorage;
- IndexedDB/localForage;
- Cache Storage and service workers;
- WebSocket or other streams;
- push subscriptions and Notification data;
- in-flight HTTP requests and late responses;
- object URLs, media, drafts, uploads, logs, telemetry, or developer tooling.

Server token revocation and local privacy cleanup are separate obligations. Failure of either must not silently imply success of the other.

## Verified matrix entries

| State or transition | Current owner / storage | Scope represented | Verified current behavior | Verified gap or risk | Required follow-up |
|---|---|---|---|---|---|
| Serialized authentication state | Auth reducer persisted to `localStorage` under `soapbox:auth` or `soapbox@<subdirectory>:auth` | Multiple users, tokens, application registration, active identity | Reads fail closed; purge removes exact account/token records, matching selection and legacy copies, deleting malformed or quota-blocked authority rather than retaining credentials | Raw access tokens remain JavaScript-readable in the inherited schema | Secure-storage replacement is a later architecture migration governed by the migration registry |
| Selected account marker | `sessionStorage` `...:auth:me` | Active account | Selected identity is stored separately from complete credentials | Selection can diverge from user/token indexes; session storage does not form the credential boundary | Prove selected account, account record, token record, origin, and request destination agree before use |
| Legacy credentials | `soapbox:auth:app` and `soapbox:auth:user` in `localStorage` | Historical application/user credentials | Read only when current auth state is absent; account purge deletes both keys deterministically | Legacy format is unversioned | Replace only through validate-commit-delete migration rules |
| Account and token indexes | Auth reducer users keyed by account URL; tokens keyed by raw access token | Account and instance relationships | Reducer attempts duplicate and mismatch cleanup | Raw tokens act as object keys; multiple representations can diverge; malformed state behavior is not fully proven fail-closed | Define one credential identity and explicit account-origin binding; prohibit raw tokens as cache/entity keys |
| Account removal/logout | Auth actions, reducer and persistence purge coordinator | Selected account, with possible other accounts retained | Ordered bounded purge revokes generations across tabs, attempts remote revocation independently, removes local credentials/caches/snapshots/notifications/object URLs, and resumes failures from a tombstone | Failed remote revocation may leave a server token valid but cannot retain local authority | Preserve logout/account-removal conformance coverage |
| Verified-account snapshot | localForage/IndexedDB database `soapbox`, store `keyvaluepairs`, key `authAccount:<account URL>` | Account URL, implicitly instance-bearing | Purge deletes the exact snapshot; tombstone and account-generation checks fence stale rewrites; failures remain resumable | Snapshot schema is unversioned and disposable | Version only under the migration registry's validate-commit-delete rule |
| React Query cache | Global singleton QueryClient | Scope depends on each query key | Logout cancels/clears the client; stateful HTTP completions are rejected after session/account generation changes | Current keys omit explicit account/instance scope | Add scoped keys and Redux-overlap rules during Phase 1 |
| Redux domain state | Root Redux store | Mixed account, instance, and shared state | Logout rebuilds most reducers while preserving selected reducers | Preserved and rebuilt domains have not been classified; asynchronous actions may repopulate stale scope | Produce reducer/action/selector ownership matrix and transition tests for every sensitive domain |
| Service-worker and Cache Storage state | Service worker runtime, owned OfflinePlugin caches, and versioned token-fingerprint revocation cache | Origin-wide application caches; token-fingerprint worker fence | Account purge deletes owned caches, awaits durable worker invalidation, closes notifications and unsubscribes push; emergency reset clears all caches and registrations | Public app-shell cache loss may reduce offline availability until rebuilt | Preserve prefix ownership and worker conformance gates |
| Push and Notification state | Push worker, versioned revocation cache and `Notification.data` | Account/token context | Purge persists a SHA-256 token fingerprint, awaits acknowledgement, closes matching notifications and checks revocation before/after push network work and before actions | Inherited notification data still contains action credentials until closed | A later push protocol may replace raw notification action tokens; purge resurrection is closed |
| Streaming state | `app/soapbox/stream.ts` WebSocket ownership | Account/instance connection | WebSocket usage is verified | Teardown, backoff, destination binding, token rotation, duplicate events, and account-switch cancellation remain unverified | Define lifecycle state machine and prove old connections cannot dispatch after transition |
| In-flight HTTP state | Stateful Axios clients/actions | Request-specific account, token, destination, tab session generation and account generation | Response interceptor rejects both success and error completions from inactive generations; logout also cancels React Query | Raw standalone `baseClient` is reserved for explicit login/app flows and must apply its own lifecycle assertion before dispatch | Preserve response-fence tests and inventory any new standalone client use |

## Required account-transition order

The target transition contract must define and test an order equivalent to:

1. freeze new old-scope work;
2. advance an account/instance generation identifier;
3. cancel HTTP requests, mutations, uploads, timers, and streams;
4. detach push and notification actions from old credentials;
5. clear or partition React Query and other singleton caches;
6. clear account-owned Redux domains;
7. purge versioned browser persistence and worker caches;
8. revoke server credentials, while independently completing local cleanup;
9. activate the new account only after destination and capability state are established;
10. reject every late completion associated with the prior generation.

The exact implementation may differ, but equivalent safety properties are mandatory.

## Mandatory transition tests

The completed matrix must drive tests for:

- account A to account B on the same instance;
- account A on instance X to account B on instance Y;
- removal of one account while others remain;
- removal of the final account;
- failed token revocation with successful local cleanup;
- malformed and partially migrated auth storage;
- stale React Query, Redux, WebSocket, worker, and HTTP completions after purge;
- browser reload during each transition stage;
- worker update during account switching;
- notifications created before logout and acted on afterward;
- multiple tabs observing a storage/account transition;
- quota, IndexedDB failure, cache deletion failure, and partial cleanup recovery.

## Next inspection queue

1. Enumerate all auth reducer/action readers and writers.
2. Enumerate every localStorage, sessionStorage, localForage, IndexedDB, and Cache Storage key/schema.
3. Build the React Query key, mutation, invalidation, and cancellation matrix.
4. Build the Redux authority and persistence matrix.
5. Trace stream, push, notification, and service-worker lifecycle ownership.
6. Trace request cancellation and stale-response handling across Axios call sites.
7. Identify cross-tab synchronization and storage-event behavior.
8. Record telemetry, logging, Redux DevTools, and error-reporting exposure of transition data.

## Completion gate

This workstream remains incomplete until every account- and instance-bearing state location has:

- an explicit owner;
- a versioned schema where persisted;
- account and instance scope;
- creation, read, update, migration, retention, and purge rules;
- cancellation and stale-completion behavior;
- security and privacy classification;
- failure recovery and rollback behavior;
- direct tests proving no old-scope data or authority survives transitions.

Unknown storage, cache, worker, stream, notification, request, or telemetry behavior remains a blocker rather than evidence of absence.

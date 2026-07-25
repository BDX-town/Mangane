# Account Transition and Purge Contract

Status: **Accepted target / Phase 0 evidence contract**

Last updated: 2026-07-25

## Purpose

This document defines the mandatory account-transition boundary for login, account activation, account switching, logout, account removal, instance switching, credential expiry and emergency local reset. It translates the verified Phase 0 persistence, state-authority, React Query and service-worker findings into one ordered fail-closed lifecycle contract.

Phase 0C now satisfies the persistence and purge portion of this contract. Broader stream lifecycle, transport destination policy, login/MFA rollback, and Phase 1 account-scoped query-key work remain separate concerns.

The purge order is pinned in [`config/persistence-manifest.json`](../../config/persistence-manifest.json). The coordinator implements generation revocation, token-free cross-tab propagation, stream/polling disconnection, query cancellation/clearing, bounded remote revocation, Redux logout, fail-closed serialized-credential cleanup, snapshot deletion, transient-credential removal, owned-cache deletion, restart-durable worker invalidation, push unsubscription, notification closure, and complete tracked-object-URL revocation. Remote failure or timeout cannot prevent later local cleanup. A persistent non-secret tombstone is written before cleanup, startup resumes incomplete purges, and account-snapshot writers plus stateful Axios, WebSocket, and polling callbacks reject revoked generations.

## Verified current-state constraints

The transition design must account for these source-backed facts:

- the complete authentication graph is persisted as plaintext browser-readable `localStorage` state;
- the selected account is also represented in `sessionStorage` and more than one Redux location;
- legacy credential keys are read only as an inherited migration source and are deleted during purge;
- account and instance snapshots are retained in one origin-wide localForage/IndexedDB store;
- one global React Query client has infinite cache lifetime; logout cancels and clears it, and the stateful HTTP client rejects late results after account/session generation changes;
- the central Axios client does not provide global cancellation or account-scope assertions;
- root logout preserves several Redux domains, including `auth` and `instance`;
- native notification data can retain bearer tokens beyond the page lifecycle;
- notification destination policy remains a Phase 0D URL-safety concern; token use is fenced by a restart-durable worker revocation journal;
- the verified purge coordinator spans requests, caches, credential persistence, workers, notifications, and temporary object URLs.

## Verified current transition-path table

This table records the transition paths directly established by the current Phase 0 source review. It is complete for the bounded source set named below, not proof that no additional wrappers, aliases, UI entry points or historical paths exist.

| Transition or lifecycle path | Verified owner / source | Verified current behavior | State and persistence touched | Missing safety property / disposition |
|---|---|---|---|---|
| OAuth application and application-token creation | `app/soapbox/actions/apps.ts`, `app/soapbox/actions/oauth.ts`, `app/soapbox/actions/auth.ts` | registers an OAuth application and constructs client-credentials token requests before user authentication | auth application records later persisted by the auth reducer | no unified transition coordinator, typed credential lifecycle or secret-safe error boundary is proven |
| Password login | `app/soapbox/actions/auth.ts` | constructs an OAuth password-grant request containing username, password, client ID and client secret | token response enters the Redux auth graph and durable browser persistence | destination binding, payload redaction, cancellation and partial-login rollback are not proven |
| MFA completion | `app/soapbox/actions/auth.ts` | submits `/oauth/mfa/challenge` with client and MFA material, then continues account verification | application/user credentials and active auth state | backend compatibility, secret redaction and interrupted-flow cleanup remain unverified |
| Credential verification and account activation | `app/soapbox/actions/auth.ts` | calls `/api/v1/accounts/verify_credentials`, imports the account and stores a remembered account snapshot | Redux account/auth domains and `authAccount:<account URL>` in localForage | activation is not an atomic account/credential/origin transaction; stale snapshots and partial imports can survive failure |
| Active account selection and switching | authentication actions plus `app/soapbox/reducers/auth.js` | changes the selected identity among retained users, advances the tab session generation, and persists the selected identity in `sessionStorage` | `auth.me`, root account identity, `...:auth:me`, shared Axios selection and all consumers of current state | late stateful HTTP responses are rejected; stream teardown and account-scoped query keys remain later architecture work |
| API destination selection after a transition | `app/soapbox/api.ts` and authentication URL selectors | derives a base URL from configured `BACKEND_URL`, active account data or authentication-user origin, then attaches the selected bearer token | per-request Axios client and current Redux-derived account/token state | token and destination are not represented by one immutable scope; no central assertion rejects stale or mismatched selections |
| OAuth refresh | refresh action in `app/soapbox/actions/auth.ts` | reads `auth.user.refresh_token` and constructs a refresh-token exchange | intended auth credential replacement | verified reducer shape primarily uses `app`, `users`, `tokens` and `me`; current refresh functionality and safe replacement semantics remain unverified |
| Logout / retained-account removal | `logOut()` in `app/soapbox/actions/auth.ts`, `app/soapbox/persistence/purge.ts` and `AUTH_LOGGED_OUT` handling in `app/soapbox/reducers/auth.js` | starts a tombstoned, ordered, bounded purge; revokes the generation across tabs; cancels/clears React Query; attempts OAuth revocation; removes Redux and serialized credentials, selection, snapshots, transient OAuth keys and owned caches; then durably invalidates worker actions, unsubscribes push, closes notifications and revokes temporary resources | Redux auth graph, serialized auth storage, selected-account marker, lifecycle journal, React Query, localForage snapshot, Cache Storage, push subscription, notifications and object URLs | local failure leaves a resumable tombstone; remote failure is reported independently |
| Backend session deletion | `app/soapbox/actions/auth.ts` | may call nonstandard `DELETE /api/sign_out` | server session plus current bearer client | cross-backend availability, bounded timeout, error classification and independence from local cleanup are not established |
| Auth-state persistence and migration | `app/soapbox/reducers/auth.js` | writes the complete auth graph to `soapbox:auth` or `soapbox@<FE_SUBDIRECTORY>:auth`; writes selected identity to `sessionStorage`; reads legacy keys | plaintext `localStorage` and `sessionStorage` | legacy `soapbox:auth:app` and `soapbox:auth:user` are intentionally retained; no versioned, crash-safe purge transaction exists |
| Account snapshot restore | authentication snapshot path, `app/soapbox/storage/kv_store.ts` and purge write fences | reads/writes `authAccount:<account URL>` in localForage database `soapbox`, store `keyvaluepairs`; purge deletes the exact account key and blocks reducer/action snapshot writes for revoked or tombstoned scopes | origin-wide IndexedDB/localForage | schema versioning, corruption handling, stale-field rejection and generation-aware reopening remain unverified |
| Instance capability restore during activation | `app/soapbox/actions/instance.ts` and the instance persistence path | restores `instance:<host>` while also fetching live instance metadata | Redux instance state and localForage | storage/network ordering, TTL, schema compatibility and account-transition invalidation are not proven |
| React Query during login, switch or logout | `app/soapbox/queries/client.ts`, root `QueryClientProvider`, verified query modules, and the stateful Axios response interceptor | one global client has `cacheTime: Infinity`; logout cancels and clears it before local auth removal; account/session generations reject late HTTP completions | in-memory query cache; some queries also project into Redux | account-scoped query keys remain a Phase 1 design improvement rather than a Phase 0C purge gap |
| Push and notification actions after a transition | `app/soapbox/service_worker/web_push_notifications.ts` | accepts a bearer token from push data; logout persists its SHA-256 fingerprint in the worker revocation cache, awaits acknowledgement, closes matching notifications, and rejects push/action use before and after network work | service-worker execution, versioned revocation cache, and browser/OS notification storage | safe destination policy remains Phase 0D; purge resurrection is fenced across worker restarts |
| Service-worker and Cache Storage lifecycle | application bootstrap/offline-plugin integration, account purge and emergency-reset path | account logout deletes application-owned cache prefixes, durably invalidates worker token actions, closes matching notifications and unsubscribes push; emergency reset deletes all caches and unregisters workers | origin-wide workers and caches | the production cache map excludes backend routes from app-shell remapping; update rollback behavior is recorded in the migration registry |
| Emergency browser reset | `app/soapbox/components/error_boundary.tsx` and `app/soapbox/persistence/emergency-reset.ts` | performs bounded, awaited and failure-isolated query, localStorage, sessionStorage, localForage, Cache Storage, notification, push, worker and tracked-object-URL cleanup; repeats authoritative stores and navigates through the frontend basename | all accounts and broad origin-local state | deliberately origin-wide; browser termination remains an unavoidable interruption constraint |

The table demonstrates that transitions are currently coordinated by side effects across independent systems rather than by one state machine. Unknown or unenumerated entry points remain blockers and must not be interpreted as absent.

## Transition identities

Every transition must operate on an immutable scope descriptor:

```text
AccountScope {
  accountId
  accountUrl
  instanceOrigin
  credentialHandle
  sessionGeneration
}
```

The scope descriptor is the authority for request binding, cache keys, persistence keys, worker messages and purge operations. Raw bearer tokens must not serve as identifiers.

`sessionGeneration` must change whenever credentials, active account, instance origin or authorization validity changes. Late work from an older generation must be rejected before it can update canonical state or durable caches.

## Required transition state machine

At minimum, the application lifecycle must distinguish:

- `anonymous`;
- `authenticating`;
- `activating`;
- `active`;
- `switching`;
- `revoking`;
- `purging`;
- `degraded-active`;
- `reauthentication-required`;
- `reset-required`.

UI state must not imply an account is active until credential, account and destination binding has been validated. A failed activation must return to a previously valid scope or anonymous state without exposing partially loaded private data.

## Ordered activation contract

Activating an account must occur in this order:

1. parse and normalize the account URL and instance origin;
2. validate the credential record and bind it to the same account and origin;
3. allocate a new session generation;
4. suspend old-scope mutations and background actions;
5. cancel or quarantine old-scope requests;
6. initialize account-and-instance-scoped cache and persistence views;
7. fetch and verify current credentials;
8. load instance capabilities without trusting stale host snapshots as current authority;
9. hydrate only records matching the new scope and supported schema versions;
10. publish the active scope atomically;
11. permit timelines, notifications, composer actions and background work.

Any failure before step 10 must fail closed. No private cache belonging to another scope may be displayed as fallback content.

## Ordered switch contract

Switching between accounts, especially across instances, must:

1. mark the old generation closing so new work cannot start;
2. pause optimistic mutations and durable outbox replay;
3. cancel old-generation network requests where supported;
4. prevent late responses from committing state;
5. detach old-scope subscriptions, streams and push-action channels;
6. hide or invalidate old private UI projections;
7. activate the new scope through the activation contract;
8. retain the old account only according to explicit multi-account policy;
9. restore old-scope data later only through keys containing both account and instance scope.

Switching must not be implemented as changing only `me`, selected account ID or API base URL.

## Ordered logout and account-removal contract

Logout/account removal must be locally successful even when remote revocation fails.

The required order is:

1. freeze new requests, mutations and worker actions for the closing generation;
2. attempt remote OAuth revocation and backend session termination with bounded timeouts;
3. record revocation failure without storing secrets or blocking local cleanup;
4. invalidate the generation so late responses and worker messages are rejected;
5. delete active and legacy credential records for the exact account and origin;
6. clear account-scoped Redux and React Query state;
7. remove account snapshots, drafts, outbox entries, uploads and private derived indexes;
8. close account-scoped native notifications and invalidate pending actions;
9. notify service workers and other tabs that the generation is revoked;
10. release object URLs and temporary media;
11. verify that no account-private store remains reachable through known keys;
12. activate another retained account through the normal activation contract, or enter `anonymous`.

A partially failed purge must remain resumable and must not silently report completion.

## Remote revocation semantics

Remote revocation and local purge are separate outcomes:

- `remoteRevocationSucceeded`;
- `remoteRevocationFailedRetryable`;
- `remoteRevocationFailedPermanent`;
- `localPurgeSucceeded`;
- `localPurgeIncomplete`.

The UI may warn that a server token could remain valid, but it must never retain the local token merely to retry later. Any revocation retry must use a narrowly scoped secure mechanism rather than restoring the removed account to application state.

## Request and response fencing

Every authenticated request must bind:

- account identity;
- normalized instance origin;
- credential handle;
- session generation;
- request purpose.

Before committing a response, the caller must verify that the generation is still active. Cancellation is an optimization; generation validation is the correctness boundary.

Redirects, pagination URLs and configured backend overrides must not bypass origin binding.

## Cache and persistence fencing

All account-private keys must include explicit account and instance scope. Cache and persistence APIs must reject unscoped private records.

Required behavior includes:

- no global private React Query keys;
- no account-private data in deployment-global Cache Storage;
- schema-versioned localForage/IndexedDB records;
- no raw tokens in query keys, entity keys, notification tags or URLs;
- deterministic deletion by scope;
- stale-generation writes rejected after purge;
- derived indexes disposable and rebuildable.

## Cross-tab and worker protocol

Tabs and workers must exchange versioned messages for:

- active-generation change;
- scope revocation;
- purge start;
- purge completion or incomplete status;
- notification closure;
- cache invalidation;
- emergency reset.

Messages must include the scoped account, instance and generation identifiers, but never bearer tokens. A stale tab or worker must not reactivate credentials or rewrite deleted storage.

## Failure and recovery rules

- Browser termination during purge must leave a durable non-secret purge journal that resumes on next startup.
- Corrupt scoped storage must be quarantined and deleted rather than accepted as partial authority.
- Quota failure must not leave credentials persisted while private-cache deletion is skipped.
- A failed account activation must not overwrite the last known valid multi-account index until the new scope is verified.
- Emergency reset must be available without successful Redux hydration, React rendering or network access.
- Purge and activation operations must be idempotent.

## Required tests

The implementation gate requires tests for:

- two accounts on one instance;
- two accounts on different instances;
- account switch with slow old requests completing late;
- logout while offline;
- revocation timeout and server error;
- browser termination at every purge stage;
- stale tab writing after account removal;
- stale service worker handling a notification action;
- corrupted current and legacy auth storage;
- React Query optimistic mutation during switching;
- instance capability snapshot incompatible with the live server;
- native notifications remaining after local account removal;
- multi-account fallback activation after removing the active account;
- emergency reset before normal application startup.

## Phase status

This artifact records the accepted transition contract and the source-backed transition paths established by the Phase 0 authentication, persistence, transport, query-cache, instance, stream, worker, object-URL and emergency-reset inspections. Phase 0C enumeration and purge conformance are complete; later phases may replace inherited storage or credential designs only while preserving these gates.

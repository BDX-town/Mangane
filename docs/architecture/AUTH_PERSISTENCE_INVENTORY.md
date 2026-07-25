# Mangane Authentication and Persistence Inventory

Status: **Current / Phase 0 in progress**

Last updated: 2026-07-23

This document records verified authentication lifecycle and browser-persistence behavior from the current repository. It distinguishes present implementation from the accepted target architecture and does not treat successful server revocation as a complete local privacy purge.

## 1. Authentication flows

`app/soapbox/actions/auth.ts` currently coordinates application registration, application tokens, password-grant user login, token refresh, MFA verification, credential verification, account switching, registration and logout.

Verified flows include:

- application registration with an out-of-band OAuth redirect URI;
- client-credentials application-token creation;
- resource-owner password-credential login;
- refresh-token exchange when `auth.user.refresh_token` exists;
- TOTP MFA challenge submission;
- user credential verification through `/api/v1/accounts/verify_credentials`;
- multi-account credential loading and account switching;
- OAuth token revocation during logout;
- optional backend session deletion through `/api/sign_out`.

## 2. Credential persistence

`app/soapbox/reducers/auth.js` persists the complete authentication state to browser `localStorage`.

The persisted state contains:

- application registration data;
- application access-token data;
- per-user access tokens;
- token-to-account mappings;
- active-account identity.

The storage namespace is derived from `FE_SUBDIRECTORY` and uses:

- `soapbox:auth`, or `soapbox@<subdirectory>:auth`, for the serialized authentication state;
- a corresponding `...:auth:me` key in `sessionStorage` for the selected account.

### Security implications

- OAuth access tokens and client secrets are stored as plaintext JavaScript-readable browser storage.
- Any successful script execution in the origin can read the stored credentials.
- Browser extensions, compromised dependencies, injected instance customization and unsafe HTML/script paths therefore become credential-exfiltration concerns.
- `sessionStorage` only scopes the selected account marker; it does not contain the full credential boundary.
- The reducer writes authentication state after every state change, so temporary in-memory credential changes can become durable automatically.
- Current persistence has no explicit encryption, expiry envelope, schema version, integrity marker or corruption recovery beyond JSON parsing and reducer sanitation.

## 3. Legacy migration behavior

The reducer migrates older keys:

- `soapbox:auth:app`;
- `soapbox:auth:user`.

The source explicitly leaves these legacy keys in place after migration. A TODO notes that deletion may be safe but intentionally does not perform it.

Consequences:

- stale duplicate credentials may remain in browser storage after migration;
- logout of the current schema does not prove removal of legacy credential copies;
- account-removal and security tests must include all historical key formats;
- future migrations require an enumerated deletion plan rather than only reading the newest namespace.

## 4. Account and token indexing

The current reducer maintains redundant credential indexes:

- users keyed by account URL;
- tokens keyed by raw access-token value;
- each token record may carry account ID and account URL;
- selected identity is stored separately as `me`;
- imported Mastodon preload data can introduce tokens directly.

The reducer attempts to sanitize mismatched records and remove duplicate token/user associations, but the model still has multiple representations whose consistency is security-relevant.

Required invariants for Phase 1:

- a credential must have one explicit account-and-origin scope;
- raw token strings must never be used as public cache or entity keys;
- selected account, account record, token record and request destination must agree before use;
- malformed or partially migrated records must fail closed;
- account switching must cancel old-scope requests before activating the new scope.

## 5. Logout and account removal

`logOut()` attempts OAuth revocation and dispatches `AUTH_LOGGED_OUT` in a `finally` block. The auth reducer then deletes the selected user and token records and shifts to another valid user when available.

Verified positive behavior:

- local account removal proceeds even when server revocation fails;
- the selected account's user record is removed;
- token records associated with the selected account URL are removed;
- the resulting auth state is persisted again.

Verified limitations:

- logout is account removal, not necessarily complete application sign-out when other accounts remain;
- logout now cancels and clears the global React Query cache, but account switching and stale-response fencing remain unverified;
- no inspected path clears service-worker caches;
- no inspected path closes native notifications containing bearer tokens;
- no inspected path removes persisted account snapshots from IndexedDB;
- no inspected path clears legacy credential keys;
- no inspected path cancels in-flight requests or prevents late responses from restoring old-scope data;
- failed OAuth revocation can leave the server token valid even though local records are removed;
- successful local deletion is not proof that browser backups, crash reports, devtools snapshots or other storage copies are absent.

## 6. Account snapshots in IndexedDB

`app/soapbox/storage/kv_store.ts` creates one localForage IndexedDB database with:

- database name `soapbox`;
- store name `keyvaluepairs`;
- description `Soapbox offline data store`.

Authentication code stores verified account snapshots under keys shaped as:

```text
authAccount:<account URL>
```

The snapshot may preserve Pleroma settings from an older stored account object when the newly fetched account omits them.

Verified lifecycle:

- the database and store names are inherited and not visibly instance- or user-scoped;
- account URLs are embedded directly into keys;
- stored account objects may include private settings or instance-specific extensions;
- logout deletes the corresponding snapshot and keeps a resumable tombstone if IndexedDB fails;
- the schema is unversioned and disposable; migration, quota and corruption dispositions are recorded in `PERSISTENCE_MIGRATION_REGISTRY.md`;
- stale writers are blocked by the tombstone and account generation;
- preservation of old settings can reintroduce stale data unless fields and authority are explicitly defined.

## 7. Refresh behavior inconsistency

The refresh action reads a refresh token from `auth.user.refresh_token`, while the verified reducer shape primarily uses `app`, `users`, `tokens` and `me`.

This mismatch requires source-wide verification before refresh behavior can be considered functional or safe. Phase 0 must determine whether:

- another reducer path creates `auth.user`;
- the refresh code is stale;
- refresh tokens are present only in legacy state;
- current supported servers issue refresh tokens;
- refreshed credentials replace and delete old token indexes correctly.

Until proven, automatic refresh must be classified as **unverified**, not available.

## 8. Password and client-secret handling

The current password login flow constructs an OAuth request containing username, password, client ID and client secret. MFA requests similarly include the client secret and MFA token.

Required review items:

- ensure request and error logging never records credential-bearing payloads;
- ensure Sentry breadcrumbs and Axios errors redact request bodies and authorization headers;
- ensure Redux DevTools never records raw login actions or token-bearing responses in production;
- verify HTTPS and destination binding before transmitting credentials;
- define whether public clients should possess a client secret at all;
- establish deprecation or compatibility strategy for the password grant.

## 9. Phase 0 completion requirements

Before authentication inventory can close, the repository still needs:

- complete OAuth action and reducer call-site mapping;
- application and user token response schemas;
- authorization redirect/callback paths, if any;
- all localStorage, sessionStorage and localForage keys;
- all account-removal and logout entry points;
- push-subscription creation and deletion paths;
- query-cache and request-cancellation behavior on account switch;
- tests for malformed storage, legacy migration, multiple instances and failed revocation;
- confirmation of production Redux DevTools and telemetry behavior;
- a secret-leak test covering logs, URLs, errors, storage and notifications.

## 10. Required target guarantees

The replacement architecture must guarantee:

- credentials are represented by opaque handles wherever possible;
- persistent storage of raw tokens is minimized and explicitly justified;
- native wrappers use platform secure storage and non-exportable keys where applicable;
- browser persistence has schema versioning, corruption handling and deterministic purge;
- logout/account removal spans Redux, React Query, IndexedDB, service workers, notifications, streams and temporary media;
- token revocation failure is surfaced without preventing local privacy cleanup;
- each request binds credential, account and destination before transmission;
- no secret appears in notification data, query keys, URLs, logs, analytics or crash reports.

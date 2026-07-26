# Mangane React Query and Cache Inventory

Status: **Current supporting evidence / Phase 0 closed**

Last updated: 2026-07-25

This document records React Query behavior verified from exact repository paths. It intentionally distinguishes confirmed call sites and global cache behavior from the still-incomplete source-wide query-key and mutation inventory.

## 1. Global client

`app/soapbox/queries/client.ts` exports one process-wide `QueryClient`.

Verified defaults:

- `refetchOnWindowFocus: false`;
- `staleTime: 60000` milliseconds;
- `cacheTime: Infinity`.

The root application imports that singleton and exposes it through one `QueryClientProvider` shared by the entire rendered application.

## 2. Verified query call sites

Two concrete `useQuery` call sites and one `useInfiniteQuery` call site are currently verified.

### Carousel avatars

`app/soapbox/queries/carousels.ts`:

- obtains a state-selected Axios client through `useApi()`;
- performs `GET /api/v1/truth/carousels/avatars`;
- uses the exact query key `['carouselAvatars']`;
- supplies `placeholderData: []`;
- inherits the global one-minute stale time and infinite cache lifetime;
- does not encode account identity, credential scope, backend origin, instance identity, locale, capability version or request parameters in the query key.

The endpoint name suggests the response may vary by backend implementation and potentially by authenticated visibility. That must be verified rather than assumed public or origin-independent.

### Trends

`app/soapbox/queries/trends.ts`:

- obtains a state-selected Axios client through `useApi()`;
- performs `GET /api/v1/trends`;
- uses the exact query key `['trends']`;
- supplies `placeholderData: []`;
- overrides stale time to ten minutes;
- normalizes the returned tags;
- dispatches the raw response through `fetchTrendsSuccess`, creating a verified React Query-to-Redux duplication boundary;
- does not encode account identity, credential scope, backend origin, instance identity, locale, moderation state or capability version in the query key.

Because `useApi()` selects transport state outside the serialized key, the same `['trends']` cache record can be reused after an account or instance transition unless another lifecycle path explicitly removes or partitions it. The simultaneous Redux write also requires authority and purge behavior to be reconciled across both stores.

### Onboarding suggestions

`app/soapbox/queries/suggestions.ts`:

- obtains a state-selected Axios client through `useApi()`;
- performs paginated `GET /api/v2/suggestions`;
- uses the exact query key `['suggestions', 'v2']`;
- flattens infinite-query pages for onboarding;
- dispatches returned accounts and relationship fetches into Redux;
- includes API version, but not account identity, credential scope, backend origin or instance identity, in its key.

## 3. Security and lifecycle consequences

An infinite cache lifetime means inactive query records are not garbage-collected by time. Data therefore remains in memory until it is explicitly removed, the client is cleared, or the page process terminates.

Because the same client is shared across authentication and instance transitions, every query key must encode all authority dimensions that affect the returned data. Depending on the endpoint, this may include:

- authenticated account;
- credential scope;
- backend origin or instance;
- moderation and visibility state;
- locale;
- feature/capability version;
- pagination cursor;
- request parameters that alter private or filtered results.

A key that omits an authority dimension can return stale data from another account or instance even when the subsequent network request would have used different credentials.

The verified keys currently omit the account and backend-origin dimensions. Phase 0 must determine whether each response is truly safe to share across scopes or whether its key and lifecycle contract require correction.

## 4. Verified lifecycle and later architecture work

`app/soapbox/persistence/purge.ts` calls `cancelQueries()` and clears the singleton at the start of account logout/removal. `app/soapbox/persistence/emergency-reset.ts` does the same before origin-wide recovery. Both paths are bounded, failure-isolated and covered by unit and authority-gate tests. The stateful Axios client also captures session/account generations and rejects late responses after logout or account switching, so cancellation is no longer the correctness boundary.

Later query architecture still needs:

- scoped removal that preserves proven-public records;
- invalidation before credential replacement;
- mutation reset;
- optimistic-update rollback;
- persisted-query removal, if persistence exists elsewhere;
- WebSocket or streaming updates being detached from stale cache records.

These are Phase 1 cache-design concerns, not open Phase 0C purge-survival paths.

## 5. Required query and mutation matrix

Phase 0 must enumerate every use of:

- `useQuery`;
- `useInfiniteQuery`;
- `useQueries`;
- `useMutation`;
- `fetchQuery` and `prefetchQuery`;
- `getQueryData` and `setQueryData`;
- `setQueriesData`;
- `invalidateQueries`;
- `removeQueries`;
- `resetQueries`;
- `cancelQueries`;
- `clear`;
- query defaults and mutation defaults;
- hydration, dehydration or persistence adapters.

For every query or mutation, record:

| Field | Required evidence |
|---|---|
| Owner | feature/module and responsible subsystem |
| Query or mutation key | exact factory and serialized dimensions |
| Transport | endpoint, method and shared-client path |
| Authentication | anonymous, application token or user token |
| Account scope | account identifier represented in key or explicit reason it is not needed |
| Instance scope | backend origin represented in key or explicit reason it is not needed |
| Input validation | parameter schema and unsafe-value handling |
| Staleness | stale time and refetch triggers |
| Retention | cache time and explicit removal behavior |
| Cancellation | signal propagation and account-switch behavior |
| Mutation safety | idempotency, optimistic update, rollback and conflict behavior |
| Invalidation | exact related keys invalidated or updated |
| Error behavior | normalized error type and user-visible handling |
| Privacy | private data retained in memory or persisted elsewhere |
| Tests | multi-account, multi-instance, late-response and rollback coverage |

The matrix now begins with these verified entries:

| Owner | Key | Transport | Scope currently encoded | Additional verified behavior |
|---|---|---|---|---|
| carousel avatars | `['carouselAvatars']` | `GET /api/v1/truth/carousels/avatars` via `useApi()` | none | placeholder array; global stale and retention defaults |
| trends | `['trends']` | `GET /api/v1/trends` via `useApi()` | none | ten-minute stale time; writes raw data into Redux; returns normalized tags |
| onboarding suggestions | `['suggestions', 'v2']` | paginated `GET /api/v2/suggestions` via `useApi()` | API version only | infinite pagination; writes accounts and relationship requests into Redux |

These entries are not classified as safe. Their authentication behavior, backend variability, invalidation, cancellation, purge, privacy and tests remain unresolved.

## 6. Account transition contract required by later phases

Before activating a different account or instance, the target architecture must:

1. mark the old account scope inactive;
2. cancel old-scope requests and mutations where safe;
3. reject or quarantine late old-scope responses;
4. detach streams and subscriptions;
5. remove or securely partition private old-scope cache entries;
6. activate the new credential-and-origin scope atomically;
7. fetch new-scope data without displaying old private records;
8. preserve only explicitly public, origin-independent records that have a proven safe key.

Logout must use the same mechanism rather than relying on Redux reconstruction alone.

## 7. Current evidence limitation

The executable full-tree scanner currently identifies the three exact query modules and the logout cancellation boundary recorded above.

The scanner covers direct executable API names but cannot prove the absence of aliased imports, wrappers or dynamic property access. Those patterns, along with runtime hydration and persistence behavior, remain explicit blockers.

This limitation must not be converted into a claim that there are only three query modules or that any current key is safely scoped.

## 8. Phase 0 completion criteria

This inventory may be marked complete only when:

- all query and mutation call sites are enumerated;
- every private result has an explicit account-and-origin scope;
- all account and instance transitions have cancellation and purge behavior mapped;
- optimistic mutations and rollback behavior are documented;
- stream-to-cache update paths are identified;
- persistence or hydration is either inventoried or proven absent;
- React Query-to-Redux duplication boundaries are assigned an explicit authority and purge contract;
- tests cover account switching, logout, multi-instance operation, stale late responses and mutation failure;
- the final matrix is reconciled with Redux and local persistence authority.

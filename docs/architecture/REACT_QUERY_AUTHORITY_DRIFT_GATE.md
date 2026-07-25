# React Query Authority Drift Gate

Status: **Current / bounded Phase 0 evidence**

This gate records and enforces Mangane's verified inherited React Query authority boundary. It does not classify the current cache design as safe target architecture.

## Verified global authority

`app/soapbox/queries/client.ts` exports one process-wide `QueryClient` with:

- `refetchOnWindowFocus: false`;
- a one-minute default stale time;
- `cacheTime: Infinity`.

`app/soapbox/containers/soapbox.tsx` mounts that singleton through one root `QueryClientProvider`. The client therefore spans account and instance transitions unless an explicit lifecycle operation partitions or clears it.

## Verified query and lifecycle call sites

The repository-wide executable API scan currently finds two `useQuery` call sites, one `useInfiniteQuery` call site and one lifecycle cancellation call:

- `carouselAvatars` uses state-selected `useApi()` transport and calls `/api/v1/truth/carousels/avatars`;
- `trends` uses state-selected `useApi()` transport and calls `/api/v1/trends`.
- `suggestions/v2` uses state-selected `useApi()` transport and calls `/api/v2/suggestions`, then duplicates returned accounts and relationships into Redux;
- account purge calls `cancelQueries()` and clears the singleton before local auth removal;
- emergency origin reset independently cancels and clears the singleton before clearing browser stores.

All three keys omit account identity, credential scope and backend origin. The suggestions key includes API version but still omits account and instance scope. `trends` and suggestions also write into Redux, creating duplicate authority and purge boundaries.

## Executable enforcement

`node scripts/check-react-query-authority-inventory.js`:

- validates the singleton client defaults and root provider binding;
- validates the exact three known keys, endpoints and stateful transport usage;
- validates the React Query-to-Redux duplication boundaries;
- validates executable cancellation and clearing in the account-purge and emergency-reset coordinators;
- recursively scans application JavaScript and TypeScript sources for executable React Query APIs;
- fails when an unrecorded `useQuery`, mutation, invalidation, prefetch, cache-write, hydration or persistence API appears;
- ignores comments and inert string contents during executable API discovery;
- rejects unsafe manifest paths, duplicate entries and silent removal of explicit blockers.

Focused adversarial tests cover unrecorded queries and mutations, finite and infinite query-key drift, logout cancellation/clear removal, endpoint and provider drift, infinite-retention drift, duplication removal, and inert comment/string false positives.

## Security and correctness consequences

Unscoped keys combined with a state-selected API client require care even though the stateful Axios client now rejects completions from stale account/session generations. Infinite inactive-cache retention still motivates scoped keys. The Redux copies produced by trends and suggestions can also diverge from React Query. Logout cancels and clears the singleton; the generation interceptor is the correctness fence for already-completing HTTP work.

A passing gate means only that the inherited boundary remains accurately recorded. It does not prove either query is public, origin-independent, account-independent or safe to share.

## Remaining blockers

Before migration or production hardening, Mangane still requires:

- immutable account and instance dimensions for every non-public query key;
- immutable account and instance dimensions for non-public query keys;
- deterministic removal of old-scope cache records and mutations;
- continued late-response rejection conformance tests;
- classification of the carousel endpoint's authentication and backend variability;
- one explicit authority and purge contract for trends across React Query and Redux;
- an account/instance scope and cross-store contract for suggestions;
- verification of retry, offline, hydration, persistence and stream-to-cache behavior;
- multi-account, multi-instance, logout and mutation-failure integration tests.

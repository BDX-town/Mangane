# React Query Authority Drift Gate

Status: **Current / bounded Phase 0 evidence**

This gate records and enforces Mangane's verified inherited React Query authority boundary. It does not classify the current cache design as safe target architecture.

## Verified global authority

`app/soapbox/queries/client.ts` exports one process-wide `QueryClient` with:

- `refetchOnWindowFocus: false`;
- a one-minute default stale time;
- `cacheTime: Infinity`.

`app/soapbox/containers/soapbox.tsx` mounts that singleton through one root `QueryClientProvider`. The client therefore spans account and instance transitions unless an explicit lifecycle operation partitions or clears it.

## Verified query call sites

The repository-wide executable API scan currently finds exactly two `useQuery` call sites:

- `carouselAvatars` uses state-selected `useApi()` transport and calls `/api/v1/truth/carousels/avatars`;
- `trends` uses state-selected `useApi()` transport and calls `/api/v1/trends`.

Both keys omit account identity, credential scope, backend origin, instance identity, locale, moderation state and capability version. `trends` also dispatches the raw response into Redux through `fetchTrendsSuccess`, creating a duplicate authority and purge boundary.

## Executable enforcement

`node scripts/check-react-query-authority-inventory.js`:

- validates the singleton client defaults and root provider binding;
- validates the exact two known keys, endpoints and stateful transport usage;
- validates the React Query-to-Redux duplication boundary;
- recursively scans application JavaScript and TypeScript sources for executable React Query APIs;
- fails when an unrecorded `useQuery`, mutation, invalidation, prefetch, cache-write, hydration or persistence API appears;
- ignores comments and inert string contents during executable API discovery;
- rejects unsafe manifest paths, duplicate entries and silent removal of explicit blockers.

Focused adversarial tests cover unrecorded queries and mutations, key drift, endpoint and provider drift, infinite-retention drift, duplication removal, and inert comment/string false positives.

## Security and correctness consequences

Unscoped keys combined with a state-selected API client can expose stale data produced under one account or instance after another scope becomes active. Infinite inactive-cache retention increases the duration of that risk. The Redux copy of trends can also diverge from the React Query record or survive a different purge path.

A passing gate means only that the inherited boundary remains accurately recorded. It does not prove either query is public, origin-independent, account-independent or safe to share.

## Remaining blockers

Before migration or production hardening, Mangane still requires:

- immutable account and instance dimensions for every non-public query key;
- cancellation and generation fencing before account or instance activation changes;
- deterministic removal of old-scope cache records and mutations;
- late-response rejection tests;
- classification of the carousel endpoint's authentication and backend variability;
- one explicit authority and purge contract for trends across React Query and Redux;
- verification of retry, offline, hydration, persistence and stream-to-cache behavior;
- multi-account, multi-instance, logout and mutation-failure integration tests.

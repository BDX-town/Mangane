# React Query Authority Drift Gate

## Status

`verified-current-bounded`

This gate covers the two directly verified production query modules currently recorded in the Phase 0 evidence set. It is not a claim of repository-wide React Query completeness.

## Verified current behavior

- `carouselAvatars` uses the state-selected `useApi()` transport and calls `/api/v1/truth/carousels/avatars`.
- `trends` uses the state-selected `useApi()` transport and calls `/api/v1/trends`.
- Both keys omit account and instance dimensions.
- `trends` also dispatches the raw response into Redux, creating a verified duplicate authority boundary.

## Enforcement

`node scripts/check-react-query-authority-inventory.js` fails when a recorded key, endpoint, stateful transport dependency, or Redux duplication boundary drifts without inventory reconciliation.

The checker deliberately preserves the current unscoped-key risk as evidence. It does not endorse that design. Before migration, query keys must include immutable account and instance scope, and account transition must cancel, generation-fence, remove, and purge account-private cache state.

## Security and correctness consequences

Unscoped keys combined with a state-selected API client can return data produced under one account or instance after another account becomes active. The `trends` path also risks divergence between React Query and Redux copies. Phase 1 must not introduce another cache authority or silently retain these inherited semantics.

## Remaining blockers

- exhaustive query, mutation, invalidation and prefetch enumeration;
- global `QueryClient` defaults and persistence inspection;
- account switch, logout and stale-response purge tests;
- formal ownership decisions for data duplicated into Redux;
- offline and retry behavior classification.

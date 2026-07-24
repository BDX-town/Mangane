# Redux Authority Drift Gate

Status: **Verified-current bounded gate**

This gate makes the inherited root Redux registry and logout-retention behavior reviewable and executable before Phase 1 introduces a new architecture seam.

## Verified boundary

The directly inspected owner is `app/soapbox/reducers/index.ts`.

The current root registry contains 57 reducer domains. On `AUTH_LOGGED_OUT`, production redirects to `/login`, constructs a new `StateRecord`, and retains exactly:

- `instance`;
- `soapbox`;
- `custom_emojis`;
- `auth`.

This is verified current behavior, not a claim that retaining those domains is safe.

## Enforcement

`config/redux-authority-inventory.json` records the expected registry, whitelist and structural invariants. `scripts/check-redux-authority-inventory.js` fails when:

- a reducer is added, removed or renamed without inventory reconciliation;
- logout retention changes without review;
- the logout action, redirect, state factory or root-combiner structure drifts;
- a retained domain is not part of the root registry;
- the bounded unknowns are silently removed.

The Architecture inventory workflow runs this checker and the routing checker directly, without project dependency installation.

## Security consequence

A reducer can contain account-private, instance-private, credential-derived or stale cached data. Adding it to the logout whitelist is therefore security-sensitive and requires evidence for scope, purge, persistence, stale-response behavior and rollback. Removing a reducer from the registry also requires migration treatment so persisted or duplicated state does not become orphaned.

## Remaining work

This gate does not classify every reducer's actions, selectors, internal persistence, account scope, instance scope or React Query duplication. Those remain explicit Phase 0 state-authority work and cannot be inferred from registry presence alone.

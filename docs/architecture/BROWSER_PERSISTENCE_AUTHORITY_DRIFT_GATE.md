# Browser Persistence Authority Drift Gate

## Status

`verified-current-bounded`

This gate protects the concrete browser-resident credential and snapshot surfaces already verified during Phase 0. It is not a claim that repository-wide persistence enumeration or deterministic purge is complete.

## Verified boundary

The executable inventory currently records:

- the namespaced authentication graph persisted to `localStorage`;
- the selected-account marker persisted to `sessionStorage`;
- both retained legacy credential keys;
- the localForage IndexedDB database and object store;
- account snapshots keyed by `authAccount:<account URL>`;
- native notification data that persists and later reuses bearer credentials.

Each row records its source owner, storage engine, current scope, authority classification, sensitivity and exact source evidence. The checker fails when those fragments drift, required credential-bearing rows disappear, unsafe source paths are introduced, or explicit Phase 0 unknowns are silently removed.

## Security meaning

A passing gate proves only that the reviewed current risks remain visible and machine checked. It does not endorse them. In particular:

- authentication secrets remain JavaScript-readable in browser storage;
- legacy credential copies remain retained after migration;
- account snapshots remain in an origin-wide generic IndexedDB store;
- notification data remains an unsafe credential duplicate outside the page lifecycle;
- account and instance scoping, expiry, corruption recovery and deterministic purge remain unproven.

Phase 1 must not create another persistence authority or describe logout as a privacy purge until the accepted account-transition and purge contract is implemented and tested.

## Enforcement

Run:

```sh
node scripts/check-browser-persistence-authority-inventory.js
```

The Architecture inventory workflow runs this checker alongside the routing and Redux authority gates. Focused Jest tests prove that credential-write drift, silent legacy-key removal, notification credential-action drift and path traversal fail closed.

## Remaining blockers

- exhaustive direct `localStorage` and `sessionStorage` enumeration;
- all localForage key prefixes, schemas and migration paths;
- Cache Storage and service-worker runtime cache ownership;
- notification grouping and account-scoped closure;
- media/object URL, upload, draft, outbox and mutation-journal persistence;
- telemetry and developer-tool buffers;
- idempotent logout, account-removal, instance-switch and emergency-reset purge implementation;
- crash, quota, corruption, stale-tab and stale-worker adversarial tests.

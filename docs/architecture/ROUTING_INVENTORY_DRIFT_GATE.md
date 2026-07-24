# Routing Inventory Drift Gate

Status: **Current / bounded Phase 0 gate complete**

Last updated: 2026-07-24

## Purpose

This gate converts the directly inspected routing, continuation, basename, development-proxy and production app-shell evidence into a machine-readable manifest and an executable source-drift check.

It prevents later work from silently changing verified compatibility redirects, continuation-key behavior, build basenames, SPA fallback ownership or production service-worker navigation exclusions without updating the Phase 0 evidence.

## Current implementation

- `config/routing-inventory.json` records the bounded verified source set, owners, required source fragments, reserved path sets and explicit unknowns.
- `scripts/check-routing-inventory.js` validates the manifest schema, safe source paths, duplicate-free invariants and required fragments against repository source.
- `scripts/check-routing-inventory.test.js` executes the checker under Jest and verifies its summary.

The direct command is:

```sh
node scripts/check-routing-inventory.js
```

The existing Jest command also discovers the drift-gate test.

## Fail-closed behavior

The checker exits unsuccessfully when:

- a verified source disappears or cannot be read;
- a required routing or deployment fragment changes;
- a source entry lacks an owner or evidence fragment;
- duplicate or malformed reserved paths enter the manifest;
- the two currently mismatched continuation keys are accidentally collapsed before migration;
- explicit unknowns are removed while the broader routing gate remains open.

## Evidence boundary

The gate currently covers seven directly inspected repository sources:

1. the primary UI router and imperative keyboard/history navigation;
2. the authorization route wrapper;
3. the login-continuation helper;
4. build-path normalization;
5. shared webpack output and generated HTML;
6. development proxy and SPA fallback behavior;
7. production OfflinePlugin app-shell navigation exclusions.

## Explicit limitations

This does not claim exhaustive repository-wide discovery of every `Link`, `NavLink`, `Redirect`, history call, nested router, external navigation or server rewrite. Production ingress/CDN configuration and built service-worker browser behavior remain external or runtime evidence blockers.

The machine-readable manifest therefore uses `verified-current-bounded`, not an exhaustive-completion status.

## Migration consequence

Framework7 routing work must either preserve every checked invariant or deliberately update the source, manifest, tests and canonical architecture evidence in the same pull request. Removing an invariant merely to pass the test is not an acceptable migration.

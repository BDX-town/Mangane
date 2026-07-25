# Dependency Replacement Queue

Status: **Current Phase 0A evidence**

The queue is risk-ordered during remediation. The machine-readable queue is authoritative for membership; this document establishes priorities and completion evidence.

## P0 — runtime and trusted-install blockers

1. Upgrade or replace runtime-reachable high/critical packages, beginning with Axios and Immutable.
2. Remove or upgrade install/build chains that contain critical `loader-utils`, `tar`, `lodash@3`, or `websocket-driver`.
3. Replace the repository `postinstall` network pipe with a checksum-verified, bounded, retry-aware asset acquisition or vendored build input.
4. Resolve `taffydb@2.6.2` license ambiguity by upgrading JSDoc/removing TaffyDB or obtaining an authoritative legal disposition.

## P1 — deprecated and obsolete direct dependencies

Replace Babel proposal plugins with their maintained transform equivalents, remove duplicate icon/emoji/polyfill stacks after usage proof, and upgrade development-server/build chains that carry known advisories.

## P2 — unverified direct declarations

For every direct package classified `unused-or-dynamically-referenced-unverified` or `development-unverified`, prove dynamic/configuration usage with an executable fixture or remove it. Moving build/test packages out of `dependencies` requires a clean production build and service-worker build before merge.

## Completion evidence

A queue item closes only with lockfile regeneration, updated inventory, targeted tests for the affected execution path, a fresh advisory snapshot, license reconciliation, and a clean install/build result. Suppressions without expiry, owner, and path-specific reachability evidence are prohibited.

Machine-readable queued direct packages: **88**.

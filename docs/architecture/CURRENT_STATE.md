# Mangane Verified Current State

Status: **Canonical verified current state / Phases 0–4 complete / Phase 5 in progress**

Last updated: 2026-07-28

This document records verified repository behavior and known unknowns before modernization begins. It is intentionally distinct from accepted-target architecture. A claim belongs here only when supported by the current repository or a reproducible inspection.

Operational completion tracking, evidence standards, inventory templates, and exit gates live in [`PHASE_0_EVIDENCE_AND_GATES.md`](./PHASE_0_EVIDENCE_AND_GATES.md). That ledger is authoritative for whether Phase 0 is complete.

## 1. Repository baseline

Verified current baseline:

- React 17 mounted with `ReactDOM.render`;
- webpack 5 build;
- React Router 5 with extensive compatibility-sensitive routes;
- Redux Toolkit plus `redux-immutable` with more than fifty mixed domains;
- one global React Query client with one-minute stale time and infinite cache lifetime;
- Axios API clients with bearer authentication and broad base-URL selection;
- `@lcdp/offline-plugin` service worker;
- OAuth application, password-grant, MFA, verification, multi-account and logout flows;
- authentication state persisted in JavaScript-readable `localStorage`;
- selected-account identity persisted in `sessionStorage`;
- account snapshots persisted through localForage/IndexedDB;
- existing accessibility preferences, generated themes, keyboard shortcuts and legacy deep links.

## 2. Verified security-sensitive behavior

### Browser credentials

The authentication reducer serializes application registration data, client secrets, application tokens, user tokens and token/account indexes into browser storage. Legacy credential keys may remain after migration.

### Push notifications

The push worker receives bearer tokens in push payloads, stores tokens in native-notification data and reuses them for notification actions. This is a critical credential-lifetime and account-scope boundary.

### Share target

The share-target worker accepts POST requests whose URL contains `/share`, reads form fields and redirects the composed text through a URL query parameter. Exact route ownership, field limits, origin and content-type validation remain unverified.

### HTML transformation

Shared HTML helpers assign supplied strings through detached-element `innerHTML`. They transform content but do not establish a complete sanitizer. One helper explicitly warns that unsafe HTML can remain.

### Test boundary

The current Jest harness runs in jsdom and excludes the service-worker entry from coverage. Package scripts do not themselves establish browser, accessibility, worker-security, dependency-audit or migration coverage.

## 3. Current high-priority risks

1. Plaintext browser persistence of application secrets and bearer tokens.
2. Bearer tokens retained inside native-notification data.
3. No verified purge boundary spanning Redux, React Query, browser storage, notifications, service-worker caches, streams and media.
4. Token selection and request destination are not represented by one explicit account-and-origin scope.
5. Infinite React Query cache lifetime without a complete account/instance key inventory.
6. Broad URL constructibility checks where strict protocol and origin policy is required.
7. HTML transformation helpers that may be mistaken for sanitization.
8. Worker input validation and lifecycle gaps.
9. Unverified Sentry consent, breadcrumb and redaction behavior.
10. Incomplete CI, browser, accessibility and security-test evidence.

## 4. Current versus target

The inherited application remains the compatibility base. Phase 2's design
foundation and Phase 3's flagged Framework7 shell are current, but broad
presentation migration remains a target. Phase 4's PWA hardening and Phase 5's
account-scoped canonical-store foundation are current. Durable synchronization,
feed-neutral application boundaries, Home/For You separation, Custom
Feeds, hybrid search, local intelligence, composer context, and interpolation
remain accepted targets and must not be described as current implementation.

Existing functionality must not be removed merely because it is absent from target documents. Removal requires inventory, compatibility analysis, migration, rollback and an architectural decision.

## 5. Phase 0 status

Phase 0 is closed. Bootstrap, routing, Redux, React Query, API/protocol, authentication, persistence, workers, HTML safety, telemetry, design, accessibility, tests, builds, dependencies, licensing, and documentation authority now have source-backed inventories and executable drift gates.

The closure does not claim that inherited implementation debt is resolved. The exact Phase 1 and later constraints—including TypeScript diagnostics, transport scope, React Query scope, dependency remediation, cross-engine visual coverage, and external branch protection—are recorded in [`PHASE_0_CLOSURE_REPORT.md`](./PHASE_0_CLOSURE_REPORT.md).

## 6. Phase 1 implementation state

Account lookup is the first representative feature routed through domain, application, protocol-adapter, runtime-environment, typed-error, feature-flag, and account-scope contracts. Its prior Redux/API behavior remains available behind the owned rollback flag.

The repository TypeScript authority baseline is now zero diagnostics. A presentation-boundary inventory makes inherited direct backend coupling explicit and rejects new coupling. Detailed behavior, migration, rollback, risks, and verification requirements are recorded in [`PHASE_1_ARCHITECTURE_CONTRACTS.md`](./PHASE_1_ARCHITECTURE_CONTRACTS.md).

## 7. Phase 2 completion state

Phase 2 is complete. It established the canonical semantic token source,
Phosphor semantic registry, foundational controls, focus and reduced-motion
contracts, executable component/icon drift gates, accessibility harness, and
cross-engine visual baseline. Broad feature-surface migration remains later
roadmap work and does not reopen the completed foundation phase.

Completion evidence, migration, rollback, risks, security properties, and the
slice checklist are recorded in
[`PHASE_2_DESIGN_FOUNDATION.md`](./PHASE_2_DESIGN_FOUNDATION.md).

## 8. Phase 3 completion state

Phase 3 is complete. The Framework7 application shell remains behind its
rollback flag and supplies adaptive phone, tablet, and desktop layouts,
route/deep-link compatibility, viewport and safe-area behavior, account-switch
navigation reset, session restoration, and route-level offline/error states.

The implementation and slice evidence are recorded in
[`PHASE_3_FRAMEWORK7_SHELL.md`](./PHASE_3_FRAMEWORK7_SHELL.md).

## 9. Phase 4 completion state

Phase 4 is complete. The installable PWA has a documented asset update and
rollback path, static-only CacheStorage policy, cache purge coverage, offline
shell behavior, and Safari/WebKit capability handling. Private API responses
are not cached in CacheStorage.

The implementation and exit evidence are recorded in
[`PHASE_4_PWA_OFFLINE_HARDENING.md`](./PHASE_4_PWA_OFFLINE_HARDENING.md).

## 10. Phase 5 implementation state

Phase 5 is in progress. Merged slices A–D provide:

- an account-scoped Dexie store and repository API;
- versioned migrations and corruption quarantine/healing;
- quota monitoring, TTL retention, and bounded eviction;
- a feature-flagged bridge that persists API-normalized accounts, statuses, and
  notifications and can hydrate cached statuses and notifications.

The current schema does not yet store feed membership/order, source provenance,
gaps, or feed-owned cursors. The bridge does not yet hydrate conversations.
The stored editorial projection is also insufficient for Phase 8 parity, and
presentation code must not parse `raw` to compensate.

Accordingly, Phase 5's representative timeline and conversation hydration exit
criterion is not complete. The required gap contract is recorded in
[`IMPLEMENTATION_ROADMAP_V2.md`](./IMPLEMENTATION_ROADMAP_V2.md) and
[`PHASE_8_HOME_AND_BUILT_IN_FEEDS.md`](./PHASE_8_HOME_AND_BUILT_IN_FEEDS.md).

## 11. Feed roadmap state

Home relationship filtering, For You, and Custom Feeds are accepted targets,
not current
features:

- Phase 8 makes Home and For You separate timelines and does not add a
  Following feed.
- Home contains mutual, two-way relationship content.
- Initial For You is the latest-first union of outbound-only, one-way
  relationship content and explicitly followed hashtags; it is not an opaque
  algorithmic feed.
- Future personalization belongs to the account-scoped, inspectable work in
  Phases 19 and 25.
- Custom Feeds are Phase 23A because their full publication, subscription,
  semantic, list, and discovery scope depends on multiple earlier phases and a
  trusted publication authority not currently present in this repository.

See [`PHASE_8_HOME_AND_BUILT_IN_FEEDS.md`](./PHASE_8_HOME_AND_BUILT_IN_FEEDS.md)
and [`PHASE_23A_CUSTOM_FEEDS.md`](./PHASE_23A_CUSTOM_FEEDS.md).

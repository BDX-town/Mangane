# Mangane Canonical Architecture

Status: **Accepted foundation**

Last updated: 2026-07-24

This directory is the canonical source for Mangane's product direction, technical architecture, local intelligence system, design language, data model, privacy boundaries, architectural decisions, and implementation roadmap.

Mangane is evolving from a conventional Fediverse frontend into a high-quality, local-first, intelligent social application. The inherited application remains an important compatibility base, but it is not the final architecture or design target.

## Reading order

Every implementation agent and contributor must read these documents in order before making architectural changes:

1. [`PRODUCT_VISION.md`](./PRODUCT_VISION.md)
2. [`TECHNICAL_ARCHITECTURE.md`](./TECHNICAL_ARCHITECTURE.md)
3. [`SEARCH_AND_INTELLIGENCE.md`](./SEARCH_AND_INTELLIGENCE.md)
4. [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)
5. [`DATA_PRIVACY_AND_RESILIENCE.md`](./DATA_PRIVACY_AND_RESILIENCE.md)
6. [`ARCHITECTURAL_DECISIONS.md`](./ARCHITECTURAL_DECISIONS.md)
7. [`IMPLEMENTATION_ROADMAP_V2.md`](./IMPLEMENTATION_ROADMAP_V2.md)

## Verified current-state evidence

Target architecture must always be read alongside the verified repository evidence produced by Phase 0:

- [`CURRENT_STATE.md`](./CURRENT_STATE.md) — verified dependency, runtime, risk and documentation baseline;
- [`SOURCE_INVENTORY.md`](./SOURCE_INVENTORY.md) — verified bootstrap, routing, state, service-worker, accessibility and interaction ownership;
- [`SECURITY_RUNTIME_INVENTORY.md`](./SECURITY_RUNTIME_INVENTORY.md) — verified authentication selectors, URL handling, HTTP-client behavior, push/share worker behavior, cache implications and required security contracts;
- [`API_TRANSPORT_AUTHORITY_DRIFT_GATE.md`](./API_TRANSPORT_AUTHORITY_DRIFT_GATE.md) — executable bounded gate for the central credential-bearing Axios client and authentication URL/token-selection boundary;
- [`AUTH_PERSISTENCE_INVENTORY.md`](./AUTH_PERSISTENCE_INVENTORY.md) — verified OAuth flows, plaintext browser credential persistence, multi-account indexing, logout limitations, IndexedDB account snapshots and legacy migration behavior;
- [`REACT_QUERY_AND_CACHE_INVENTORY.md`](./REACT_QUERY_AND_CACHE_INVENTORY.md) — verified singleton cache defaults, account-transition risks, required query/mutation matrix and current enumeration blockers;
- [`CONTENT_SAFETY_AND_TEST_INVENTORY.md`](./CONTENT_SAFETY_AND_TEST_INVENTORY.md) — verified shared HTML transformation behavior, test-command baseline, Jest coverage boundaries and remaining sanitization/CI blockers;
- [`OBSERVABILITY_AND_CI_INVENTORY.md`](./OBSERVABILITY_AND_CI_INVENTORY.md) — verified Sentry configuration signals, root error-boundary behavior, emergency browser reset, build-time customization boundaries and current CI uncertainty;
- [`TELEMETRY_SECRET_EXPOSURE_MATRIX.md`](./TELEMETRY_SECRET_EXPOSURE_MATRIX.md) — canonical Phase 0 matrix for credentials, private account data, telemetry, developer tooling, notifications, URLs, workers, tests, builds, and required fail-closed redaction evidence;
- [`SENTRY_RUNTIME_AND_REDACTION_INVENTORY.md`](./SENTRY_RUNTIME_AND_REDACTION_INVENTORY.md) — source-backed Sentry dependency and configuration baseline, explicit runtime unknowns, redaction requirements, and adversarial leak-test gates;
- [`SENTRY_AUTHORITY_DRIFT_GATE.md`](./SENTRY_AUTHORITY_DRIFT_GATE.md) — executable bounded gate for the verified Sentry dependency and build-time DSN surface while runtime activation and redaction remain blocked;
- [`TEST_AND_CI_BASELINE.md`](./TEST_AND_CI_BASELINE.md) — verified package test commands, Jest coverage boundaries, observed CI gaps, and the required workflow/job matrix;
- [`BACKEND_CAPABILITY_MATRIX.md`](./BACKEND_CAPABILITY_MATRIX.md) — canonical evidence structure for Akkoma, Pleroma, Mastodon-compatible, and Mangane-specific backend capabilities and fallbacks;
- [`STATE_AUTHORITY_AND_DUPLICATION_MATRIX.md`](./STATE_AUTHORITY_AND_DUPLICATION_MATRIX.md) — canonical ownership, duplication, persistence, purge, and synchronization matrix for application state;
- [`BROWSER_PERSISTENCE_AND_PURGE_INVENTORY.md`](./BROWSER_PERSISTENCE_AND_PURGE_INVENTORY.md) — verified browser storage keys, credential-bearing notification state, persistence ownership, deterministic purge requirements, and remaining repository-wide enumeration gates;
- [`BROWSER_PERSISTENCE_AUTHORITY_DRIFT_GATE.md`](./BROWSER_PERSISTENCE_AUTHORITY_DRIFT_GATE.md) — executable bounded drift gate for verified credential-bearing browser storage, IndexedDB snapshots, and native notification persistence;
- [`ACCOUNT_TRANSITION_AND_PURGE_CONTRACT.md`](./ACCOUNT_TRANSITION_AND_PURGE_CONTRACT.md) — source-backed current login, activation, switching, refresh, logout, worker, cache and emergency-reset paths plus the accepted fail-closed transition and purge contract;
- [`ROUTE_AND_COMPATIBILITY_MANIFEST.md`](./ROUTE_AND_COMPATIBILITY_MANIFEST.md) — source-backed root and primary route matrix, public/auth/role and capability gates, backend-compatible redirects, reserved-basename rules and Framework7 route-conformance requirements;
- [`NAVIGATION_CALLSITE_AND_DESTINATION_INVENTORY.md`](./NAVIGATION_CALLSITE_AND_DESTINATION_INVENTORY.md) — source-backed navigation-producer classes, verified worker/session/shortcut and continuation call sites, destination-policy requirements and executable repository-wide enumeration gate;
- [`DEPLOYMENT_REWRITE_AND_RESERVED_PATH_INVENTORY.md`](./DEPLOYMENT_REWRITE_AND_RESERVED_PATH_INVENTORY.md) — source-backed build basename, asset public path, development SPA fallback, production OfflinePlugin navigation exclusions, backend reservations, rewrite precedence and external production-edge gates;
- [`PHASE_0_EVIDENCE_AND_GATES.md`](./PHASE_0_EVIDENCE_AND_GATES.md) — evidence standard, workstream dashboard, required matrices and non-negotiable Phase 0 exit gates.

These files describe the current inherited implementation. They do not override accepted target architecture, but later phases may not ignore their compatibility and security findings.

## Canonicality and drift control

These documents supersede informal architecture descriptions, old implementation phases, and assumptions inherited from the current codebase whenever they conflict.

The following rules are mandatory:

- No implementation phase may silently redefine the architecture.
- No major dependency, storage engine, search algorithm, UI framework, icon system, model provider, or privacy boundary may change without an ADR entry.
- Code and documentation must be updated in the same pull request when behavior changes.
- A document may only be marked complete when the corresponding code, tests, migrations, fallback behavior, and operational guidance exist.
- Existing functionality must not be removed merely because it is absent from the new design documents. Removal requires inventory, compatibility analysis, migration guidance, and an ADR.
- Features inherited from Akkoma, Pleroma, Mastodon, and Mangane must remain behind a protocol or capability boundary rather than leaking into presentation components.
- Documentation claims must distinguish current state, target state, experimental work, and future work.

## Status vocabulary

Every substantial section or roadmap item should use one of these states:

- **Current:** verified in the repository and available now.
- **Accepted target:** architecture chosen but not fully implemented.
- **Experimental:** prototype or evaluation work; not production policy.
- **Deferred:** intentionally postponed with dependencies recorded.
- **Deprecated:** retained temporarily for migration.
- **Removed:** deleted with migration and compatibility handling complete.

## Product summary

Mangane's accepted direction is:

- installable PWA first, native-capable later;
- Framework7 React as the adaptive presentation framework;
- Apple Human Interface Guidelines as the default quality baseline;
- platform-aware behavior without making the product visually incoherent;
- editorial, tactile, content-first interaction inspired by Facebook Paper;
- restrained intelligence and reading utility inspired by Artifact;
- structured Explore and Search synthesis inspired by Neeva Gist;
- Phosphor as the canonical product icon family, with Framework7 icons limited to platform-integrated affordances;
- local-first storage and intelligence;
- hybrid lexical and semantic search, not semantic-only search;
- entity linking and enrichment through local canonical entities with Wikidata and DBpedia as external enrichment sources;
- explainable ranking, semantic filtering, composer context, and interpolation;
- no cloud profiling by default;
- graceful operation when models, embeddings, indexes, network access, or background execution are unavailable.

## Architecture overview

```text
Adaptive Framework7 Experience Layer
  ├── phone, tablet and desktop navigation
  ├── editorial cards, sheets and gestures
  ├── accessibility, reduced motion and platform conventions
  └── Phosphor-based Mangane icon language

Application and Domain Layer
  ├── timelines, conversations, composer and notifications
  ├── Explore, Search and Gist experiences
  ├── moderation and semantic filters
  └── account, instance and protocol capability orchestration

Local Intelligence and Retrieval Engine
  ├── lexical index
  ├── vector index
  ├── hybrid query planner and fusion
  ├── entity and topic resolution
  ├── conversation context
  ├── local personalization
  ├── reranking and explanations
  └── composer context and interpolation

Local Data and Synchronization Layer
  ├── canonical normalized records
  ├── durable mutation and index journals
  ├── offline cache and outbox
  ├── account-scoped intelligence stores
  └── rebuildable derived indexes

Protocol and Transport Layer
  ├── Akkoma
  ├── Pleroma
  ├── Mastodon-compatible APIs
  └── future adapters through explicit capabilities
```

## Definition of architectural completion

A subsystem is not complete unless it has:

- a documented public contract;
- explicit ownership and dependency boundaries;
- input validation and error behavior;
- privacy and security analysis;
- local and offline behavior;
- degraded-mode behavior;
- migration and rollback strategy;
- unit, integration, accessibility and failure-path tests;
- performance budgets and measurements where relevant;
- observability that does not leak private content;
- documentation reflecting verified implementation status.

## Change process

1. Identify the canonical document affected.
2. Add or update an ADR for material decisions.
3. Update architecture and roadmap language before or with implementation.
4. Implement behind stable interfaces.
5. Add tests, migration and rollback support.
6. Update status from accepted target to current only after verification.
7. Remove obsolete documentation or label it superseded; never leave two active sources of truth.

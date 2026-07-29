# Mangane Canonical Architecture

Status: **Canonical architecture index / Phase 0 closed**

Last updated: 2026-07-29

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

## Active and accepted phase plans

- [`PHASE_8B_ENTITY_RESOLUTION_AND_CREATOR_ATTRIBUTION.md`](./PHASE_8B_ENTITY_RESOLUTION_AND_CREATOR_ATTRIBUTION.md) defines Mangane’s shared canonical entity authority and creator-attribution consumer, including Wikidata/DBpedia enrichment, structured article/social metadata, semantic hashtags, entity-aware Custom Feeds, Search/Explore/Gist/recommendation/composer integration, proof tiers, deduplication, privacy, rollback, and adversarial gates.
- [`PHASE_23B_SUBSCRIBED_POST_STORIES.md`](./PHASE_23B_SUBSCRIBED_POST_STORIES.md) defines the optional story-shaped presentation of profile-bell subscribed public-post notifications, including canonical-status reuse, subscription generations, cross-source deduplication, shared notification read state, bounded queues, meaningful-view receipts, reconciliation, accessibility, rollback, and optional later Durable Streams continuity.
- [`PHASE_4A_ZSTD_AND_GZIP_COMPRESSION.md`](./PHASE_4A_ZSTD_AND_GZIP_COMPRESSION.md) defines negotiated gzip/zstd delivery, bounded local codecs, decompression safety, migration, deployment, fallback, and performance gates.
- [`PHASE_5E_TIMELINE_POSITION_CONTINUITY.md`](./PHASE_5E_TIMELINE_POSITION_CONTINUITY.md) defines semantic reading anchors, local PWA restoration, virtualization/layout stabilization, optional Mastodon markers, and the separate future Durable Streams extension.
- [`PHASE_8A_ORIGIN_AUTHORITY_RECONCILIATION.md`](./PHASE_8A_ORIGIN_AUTHORITY_RECONCILIATION.md) defines field-level origin/connected/local authority, safe origin resolution, adaptive polling, reply union, aggregate freshness, and degraded operation.
- [`PHASE_6A_DURABLE_STREAMS.md`](./PHASE_6A_DURABLE_STREAMS.md) defines the
  provider-neutral resumable event-delivery phase, external authority and
  producer requirements, opaque-offset and transactional checkpoint contracts,
  retention/reset behavior, security boundaries, rollback, and first-consumer
  gates.
- [`PHASE_8_HOME_AND_BUILT_IN_FEEDS.md`](./PHASE_8_HOME_AND_BUILT_IN_FEEDS.md)
  defines the Home/For You source contracts, Phase 5–7 prerequisites,
  editorial migration slices, and safe scroll-restoration requirements.
- [`PHASE_23A_CUSTOM_FEEDS.md`](./PHASE_23A_CUSTOM_FEEDS.md) defines the
  staged Custom Feeds program, including trusted publication authority,
  protocol sources, local-first semantics, pinning, privacy, abuse controls,
  and completion gates.
- [`FEDIBUZZ_CUSTOM_FEED_SOURCE.md`](./FEDIBUZZ_CUSTOM_FEED_SOURCE.md) defines
  the optional client-side FediBuzz broader-discovery source for Phase 23A,
  including the one-shared-stream rule, browser capability probe, indexed
  dispatch, semantic filtering, matched-only persistence, degraded behavior,
  and the explicit absence of durable replay or separate relay infrastructure.

## Verified current-state evidence

Target architecture must always be read alongside the verified repository evidence produced by Phase 0:

- [`CURRENT_STATE.md`](./CURRENT_STATE.md) — verified dependency, runtime, risk and documentation baseline;
- [`DEPENDENCY_AND_LICENSE_INVENTORY.md`](./DEPENDENCY_AND_LICENSE_INVENTORY.md) — complete lockfile classification, direct dependency ownership, license evidence, install/native/network behavior, GitHub Actions supply-chain review, and executable Phase 0A drift controls;
- [`ADVISORY_DISPOSITION_REGISTER.md`](./ADVISORY_DISPOSITION_REGISTER.md) — npm advisory snapshot with mandatory reachability, owner, and remediation records for every high and critical finding;
- [`DEPENDENCY_REPLACEMENT_QUEUE.md`](./DEPENDENCY_REPLACEMENT_QUEUE.md) — risk-ordered runtime, trusted-install, deprecated-package, license-conflict, and unverified-declaration remediation queue;
- [`SOURCE_INVENTORY.md`](./SOURCE_INVENTORY.md) — verified bootstrap, routing, state, service-worker, accessibility and interaction ownership;
- [`BOOTSTRAP_PROVIDER_AUTHORITY_DRIFT_GATE.md`](./BOOTSTRAP_PROVIDER_AUTHORITY_DRIFT_GATE.md) — executable bounded gate for application entry, DOM mount, module initialization, initial backend loading, failure semantics, and root-provider ordering;
- [`ERROR_RECOVERY_AUTHORITY_DRIFT_GATE.md`](./ERROR_RECOVERY_AUTHORITY_DRIFT_GATE.md) — executable bounded gate for mounted render-error capture, development diagnostics, emergency browser-data clearing, service-worker unregistration, and recovery navigation;
- [`SECURITY_RUNTIME_INVENTORY.md`](./SECURITY_RUNTIME_INVENTORY.md) — verified authentication selectors, URL handling, HTTP-client behavior, push/share worker behavior, cache implications and required security contracts;
- [`API_TRANSPORT_AUTHORITY_DRIFT_GATE.md`](./API_TRANSPORT_AUTHORITY_DRIFT_GATE.md) — executable bounded gate for the central credential-bearing Axios client and authentication URL/token-selection boundary;
- [`API_AND_PROTOCOL_CALLSITE_MATRIX.md`](./API_AND_PROTOCOL_CALLSITE_MATRIX.md) — generated repository-wide HTTP and protocol callsite authority, classifications, and drift commands;
- [`STREAMING_AND_UPLOAD_INVENTORY.md`](./STREAMING_AND_UPLOAD_INVENTORY.md) — WebSocket lifecycle, polling fallback, media and form-data transfer ownership, shutdown behavior, and open hardening gaps;
- [`PUSH_WORKER_AUTHORITY_DRIFT_GATE.md`](./PUSH_WORKER_AUTHORITY_DRIFT_GATE.md) — executable bounded gate for credential-bearing native notification data, push-supplied tokens, worker API actions, and notification click destinations;
- [`SHARE_TARGET_AUTHORITY_DRIFT_GATE.md`](./SHARE_TARGET_AUTHORITY_DRIFT_GATE.md) — executable bounded gate for inherited share-target routing, accepted fields, compose-text construction, development registration, and redirect behavior;
- [`SERVICE_WORKER_CACHE_AUTHORITY_DRIFT_GATE.md`](./SERVICE_WORKER_CACHE_AUTHORITY_DRIFT_GATE.md) — executable bounded gate for production OfflinePlugin cache ownership, app-shell navigation fallback, backend-route bypasses, and production worker entry imports;
- [`AUTH_PERSISTENCE_INVENTORY.md`](./AUTH_PERSISTENCE_INVENTORY.md) — verified OAuth flows, plaintext browser credential persistence, multi-account indexing, logout limitations, IndexedDB account snapshots and legacy migration behavior;
- [`REACT_QUERY_AND_CACHE_INVENTORY.md`](./REACT_QUERY_AND_CACHE_INVENTORY.md) — verified singleton cache defaults, account-transition risks, required query/mutation matrix and current enumeration blockers;
- [`CONTENT_SAFETY_AND_TEST_INVENTORY.md`](./CONTENT_SAFETY_AND_TEST_INVENTORY.md) — verified shared HTML transformation behavior, test-command history, Jest boundaries, and the handoff to complete Phase 0D and Phase 0G authorities;
- [`OBSERVABILITY_AND_CI_INVENTORY.md`](./OBSERVABILITY_AND_CI_INVENTORY.md) — verified telemetry, root error-boundary behavior, emergency browser reset, build-time customization boundaries, and the handoff to the Phase 0G CI baseline;
- [`TELEMETRY_SECRET_EXPOSURE_MATRIX.md`](./TELEMETRY_SECRET_EXPOSURE_MATRIX.md) — canonical Phase 0 matrix for credentials, private account data, telemetry, developer tooling, notifications, URLs, workers, tests, builds, and required fail-closed redaction evidence;
- [`SENTRY_RUNTIME_AND_REDACTION_INVENTORY.md`](./SENTRY_RUNTIME_AND_REDACTION_INVENTORY.md) — completed Phase 0E proof that dormant Sentry dependencies and DSN input are removed and runtime diagnostics fail closed;
- [`SENTRY_AUTHORITY_DRIFT_GATE.md`](./SENTRY_AUTHORITY_DRIFT_GATE.md) — executable complete telemetry, logging, DevTools, source-map, environment, notification, clipboard, and artifact drift gate;
- [`TELEMETRY_CONSENT_AND_OPT_OUT_CONTRACT.md`](./TELEMETRY_CONSENT_AND_OPT_OUT_CONTRACT.md) — disabled-by-default baseline and mandatory future opt-in, opt-out, sampling, retention, and deletion controls;
- [`SOURCE_MAP_AND_BUILD_ARTIFACT_POLICY.md`](./SOURCE_MAP_AND_BUILD_ARTIFACT_POLICY.md) — production source-map prohibition and classified CI artifact policy;
- [`DESIGN_AND_COMPONENT_INVENTORY.md`](./DESIGN_AND_COMPONENT_INVENTORY.md) — completed Phase 0F component ownership, classification, duplicate-authority, Framework7 compatibility, and executable drift boundary;
- [`ICON_MIGRATION_MATRIX.md`](./ICON_MIGRATION_MATRIX.md) — exhaustive generated icon-callsite dispositions and the guarded Phosphor migration contract;
- [`STYLE_AND_TOKEN_SOURCE_MAP.md`](./STYLE_AND_TOKEN_SOURCE_MAP.md) — Sass, Tailwind, runtime-theme, inline-style, responsive and RTL ownership;
- [`KEYBOARD_AND_GESTURE_INVENTORY.md`](./KEYBOARD_AND_GESTURE_INVENTORY.md) — keyboard, focus, gesture and non-gesture-alternative baseline;
- [`ACCESSIBILITY_BEHAVIOR_MATRIX.md`](./ACCESSIBILITY_BEHAVIOR_MATRIX.md) — reduced motion, focus, live-region, target-size, contrast, reflow and localization baseline;
- [`SCREENSHOT_AND_INTERACTION_BASELINE_PLAN.md`](./SCREENSHOT_AND_INTERACTION_BASELINE_PLAN.md) — privacy-safe visual and semantic regression capture plan;
- [`TEST_AND_CI_BASELINE.md`](./TEST_AND_CI_BASELINE.md) — executable package commands, Jest coverage boundaries, owner-specific workflow/job matrix, build budgets, and repository-enforcement status;
- [`BACKEND_CAPABILITY_MATRIX.md`](./BACKEND_CAPABILITY_MATRIX.md) — canonical evidence structure for Akkoma, Pleroma, Mastodon-compatible, and Mangane-specific backend capabilities and fallbacks;
- [`STATE_AUTHORITY_AND_DUPLICATION_MATRIX.md`](./STATE_AUTHORITY_AND_DUPLICATION_MATRIX.md) — canonical ownership, duplication, persistence, purge, and synchronization matrix for application state;
- [`BROWSER_PERSISTENCE_AND_PURGE_INVENTORY.md`](./BROWSER_PERSISTENCE_AND_PURGE_INVENTORY.md) — completed Phase 0C browser persistence, cache, migration, stale-actor and deterministic purge authority;
- [`BROWSER_PERSISTENCE_AUTHORITY_DRIFT_GATE.md`](./BROWSER_PERSISTENCE_AUTHORITY_DRIFT_GATE.md) — executable Phase 0C behavioral drift gate for credentials, generations, cross-tab purge, caches, workers and temporary resources;
- [`ACCOUNT_TRANSITION_AND_PURGE_CONTRACT.md`](./ACCOUNT_TRANSITION_AND_PURGE_CONTRACT.md) — source-backed current login, activation, switching, refresh, logout, worker, cache and emergency-reset paths plus the accepted fail-closed transition and purge contract;
- [`PERSISTENCE_MIGRATION_REGISTRY.md`](./PERSISTENCE_MIGRATION_REGISTRY.md) — current storage schemas, legacy reads, transactional migration rules, corruption behavior, and required versioning;
- [`OBJECT_URL_AND_TEMPORARY_RESOURCE_INVENTORY.md`](./OBJECT_URL_AND_TEMPORARY_RESOURCE_INVENTORY.md) — generated object URL, Blob and FileReader evidence plus deterministic cleanup requirements;
- [`HTML_SAFETY_MATRIX.md`](./HTML_SAFETY_MATRIX.md) — completed Phase 0D source, trust, transformation, sanitizer, sink and adversarial-coverage matrix;
- [`HTML_SAFETY_AUTHORITY_DRIFT_GATE.md`](./HTML_SAFETY_AUTHORITY_DRIFT_GATE.md) — executable discovery and policy gate for every production HTML sink, parser, iframe and sanitizer callsite;
- [`URL_AND_DESTINATION_POLICY_MATRIX.md`](./URL_AND_DESTINATION_POLICY_MATRIX.md) — central navigation, media, continuation, OAuth and external-destination classification;
- [`PREVIEW_AND_EMBED_INVENTORY.md`](./PREVIEW_AND_EMBED_INVENTORY.md) — blocked raw preview HTML and sandboxed sanitized oEmbed behavior;
- [`CSP_AND_TRUSTED_ADMIN_BOUNDARY.md`](./CSP_AND_TRUSTED_ADMIN_BOUNDARY.md) — deployment CSP contract and the rule that privileged administrator markup remains untrusted input;
- [`ROUTE_AND_COMPATIBILITY_MANIFEST.md`](./ROUTE_AND_COMPATIBILITY_MANIFEST.md) — source-backed root and primary route matrix, public/auth/role and capability gates, backend-compatible redirects, reserved-basename rules and Framework7 route-conformance requirements;
- [`NAVIGATION_CALLSITE_AND_DESTINATION_INVENTORY.md`](./NAVIGATION_CALLSITE_AND_DESTINATION_INVENTORY.md) — source-backed navigation-producer classes, verified worker/session/shortcut and continuation call sites, destination-policy requirements and executable repository-wide enumeration gate;
- [`DEPLOYMENT_REWRITE_AND_RESERVED_PATH_INVENTORY.md`](./DEPLOYMENT_REWRITE_AND_RESERVED_PATH_INVENTORY.md) — source-backed build basename, asset public path, development SPA fallback, production OfflinePlugin navigation exclusions, backend reservations, rewrite precedence and external production-edge gates;
- [`PHASE_0_EVIDENCE_AND_GATES.md`](./PHASE_0_EVIDENCE_AND_GATES.md) — evidence standard, workstream dashboard, required matrices and non-negotiable Phase 0 exit gates.
- [`DOCUMENTATION_AUTHORITY_REGISTRY.md`](./DOCUMENTATION_AUTHORITY_REGISTRY.md) — exhaustive repository-document classification, canonical hierarchy, inherited-branding policy, and executable drift authority.
- [`HISTORICAL_REQUIREMENT_TRACEABILITY.md`](./HISTORICAL_REQUIREMENT_TRACEABILITY.md) — preserved, modified, replaced, deferred, and rejected historical requirements with stable destinations and evidence.
- [`DOCUMENTATION_SUPERSESSION_AND_ARCHIVE_MAP.md`](./DOCUMENTATION_SUPERSESSION_AND_ARCHIVE_MAP.md) — visible replacement and archive policy for inherited Soapbox operational documents and historical records.
- [`PHASE_0_CLOSURE_REPORT.md`](./PHASE_0_CLOSURE_REPORT.md) — canonical Phase 0 closure decision, accepted debt, and stable Phase 1 handoff package.

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
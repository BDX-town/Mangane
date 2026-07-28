# Mangane Implementation Roadmap v2

Status: **Canonical implementation sequence**

Last updated: 2026-07-28

This roadmap supersedes earlier informal phases when they conflict. It preserves the original direction—Framework7, adaptive PWA, local-first intelligence, hybrid search, semantic filtering, entity understanding, and editorial redesign—while adding the architectural, migration, privacy, testing, and drift-control work required to implement it safely.

## Phase status

This table is the canonical progress summary. The detailed phase sections remain
authoritative for scope and exit criteria.

| Phase | Status | Evidence / active plan |
|---|---|---|
| Phase 0 — Repository and documentation reconciliation | Complete | [`PHASE_0_CLOSURE_REPORT.md`](./PHASE_0_CLOSURE_REPORT.md) |
| Phase 1 — Architecture seams and compatibility contracts | Complete | [`PHASE_1_ARCHITECTURE_CONTRACTS.md`](./PHASE_1_ARCHITECTURE_CONTRACTS.md) |
| Phase 2 — Design tokens, semantic icons, and accessibility foundation | Complete | [`PHASE_2_DESIGN_FOUNDATION.md`](./PHASE_2_DESIGN_FOUNDATION.md) |
| Phase 3 — Framework7 application shell | Complete | [`PHASE_3_FRAMEWORK7_SHELL.md`](./PHASE_3_FRAMEWORK7_SHELL.md) |
| Phase 4 — PWA, service worker, and offline hardening | Complete | [`PHASE_4_PWA_OFFLINE_HARDENING.md`](./PHASE_4_PWA_OFFLINE_HARDENING.md) |
| Phase 5 — Canonical local data store | In progress | Slices A–D are merged; timeline/order and conversation-hydration exit criteria remain open |
| Phases 6–7 | Queued | Required before Phase 8 runtime migration |
| Phase 8 — Home and For You editorial migration | Queued | [`PHASE_8_HOME_AND_BUILT_IN_FEEDS.md`](./PHASE_8_HOME_AND_BUILT_IN_FEEDS.md) |
| Phases 9–23 | Queued | Begin only after their dependency and preceding-phase exit criteria are met |
| Phase 23A — Custom Feeds | Queued | [`PHASE_23A_CUSTOM_FEEDS.md`](./PHASE_23A_CUSTOM_FEEDS.md) |
| Phases 24–31 | Queued | Begin only after their dependency and preceding-phase exit criteria are met |

## Global implementation rules

Every phase must:

- use a focused branch and pull request;
- begin from current `main` and avoid stacking unrelated changes;
- state current behavior, target behavior, migration, rollback, and risks;
- preserve protocol compatibility unless removal is explicitly approved;
- include meaningful tests, not only lint/build checks;
- include failure, offline, account-isolation, and accessibility coverage where relevant;
- avoid duplicate implementations and dead compatibility paths;
- update canonical documents and ADRs with material decisions;
- keep CI clean before merge;
- not claim completion while required deliverables remain missing;
- mark uncertain findings as uncertain and verify repository state.

## Definition of done for every phase

A phase is complete only when:

1. code is merged;
2. tests pass in CI;
3. migration and rollback are documented and tested where applicable;
4. no unresolved review comments remain;
5. no known security/privacy blocker remains;
6. architecture documentation matches actual behavior;
7. deprecated code is removed or has a dated removal plan;
8. performance and accessibility acceptance criteria are measured where relevant.

---

## Phase 0 — Repository and documentation reconciliation

Status: **Complete; see [`PHASE_0_CLOSURE_REPORT.md`](./PHASE_0_CLOSURE_REPORT.md)**

Goal: establish verified current state before architecture work.

Deliverables:

- complete repository tree and feature inventory;
- current architecture map: UI, Redux, React Query, persistence, API, routing, offline plugin, service worker, icons, styles, tests, CI;
- backend capability inventory for Akkoma, Pleroma, and Mastodon-compatible behavior;
- identify stale, duplicate, missing, or contradictory documentation;
- canonical status document distinguishing current, target, experimental, and deprecated behavior;
- dependency health and license inventory;
- known-risk register covering auth, sanitization, caches, account isolation, URL handling, and legacy packages;
- map previous phases to this roadmap so no earlier requirement is lost.

Exit criteria:

- every major subsystem has an owner and status;
- all old roadmap documents are linked, superseded, or marked historical;
- no implementation begins from assumptions about uninspected code.

Closure evidence is enforced by the dependency, network, persistence, safety, telemetry, design, CI, and documentation authority workflows. Accepted modernization debt is carried explicitly into Phase 1 rather than represented as completed implementation.

## Phase 1 — Architecture seams and compatibility contracts

Status: **Complete; see [`PHASE_1_ARCHITECTURE_CONTRACTS.md`](./PHASE_1_ARCHITECTURE_CONTRACTS.md).**

Goal: create boundaries that allow incremental modernization.

Deliverables:

- domain-facing repository interfaces;
- application command/query interfaces;
- protocol capability contract;
- typed error model;
- account-scope type and enforcement helpers;
- runtime environment abstraction;
- feature flag registry with ownership and removal metadata;
- adapter tests across representative Akkoma/Pleroma/Mastodon responses;
- no new component may directly encode backend-specific behavior.

Exit criteria:

- one representative feature uses the new boundaries end to end;
- legacy store/API access remains available behind adapters;
- rollback to current presentation is possible.

## Phase 2 — Design tokens, semantic icons, and accessibility foundation

Status: **Complete; see [`PHASE_2_DESIGN_FOUNDATION.md`](./PHASE_2_DESIGN_FOUNDATION.md).**

Goal: establish the product language before broad UI migration.

Deliverables:

- color, typography, spacing, radius, elevation, motion, and breakpoint tokens;
- light/dark/increased-contrast/forced-colors handling;
- Phosphor dependency and semantic icon registry;
- inventory and migration map for Tabler, Feather, Bootstrap Icons, Line Awesome, and other sets;
- foundational controls: button, icon button, list row, card shell, chip, segmented control, field, avatar, menu trigger;
- focus management and reduced-motion utilities;
- accessibility test harness and visual regression baseline;
- documentation/examples for component states.

Exit criteria:

- foundational components meet WCAG 2.2 AA targets;
- no new raw icon-library imports outside the registry;
- design tokens work inside legacy and Framework7 surfaces.

## Phase 3 — Framework7 application shell

Status: **Complete; see [`PHASE_3_FRAMEWORK7_SHELL.md`](./PHASE_3_FRAMEWORK7_SHELL.md).**

Goal: introduce the adaptive shell without rewriting all content surfaces.

Deliverables:

- Framework7 React app root behind a feature flag;
- phone bottom navigation;
- tablet split/sidebar layout;
- desktop multi-column layout;
- route mapping and deep-link preservation;
- safe-area, standalone PWA, viewport, keyboard, and orientation behavior;
- page transition policy with reduced-motion variants;
- account-switch and session restoration behavior;
- route-level error and offline states.

Exit criteria:

- all existing major routes can render through the new shell or compatibility bridge;
- browser back/forward, deep links, refresh, PWA relaunch, and focus restoration work;
- old shell remains rollback-capable until designated removal phase.

## Phase 4 — PWA, service worker, and offline hardening

Status: **Complete; see [`PHASE_4_PWA_OFFLINE_HARDENING.md`](./PHASE_4_PWA_OFFLINE_HARDENING.md).**

Goal: make installation and degraded operation reliable.

Deliverables:

- current manifest/service-worker audit;
- safe asset update and rollback strategy;
- account-safe cache keys and purge rules;
- offline shell and route handling;
- network-state and stale-content indicators;
- private API response caching policy;
- background sync capability assessment without assuming unsupported browser behavior;
- logout/account-switch cache tests;
- install/update guidance.

Exit criteria:

- no cross-account cache leakage;
- broken asset release can recover;
- core shell starts offline after successful installation.

## Phase 5 — Canonical local data store

Status: **In progress.** Slices A–D are merged, but the exit criteria below
remain authoritative.

Goal: create normalized local records independent of UI and derived indexes.

Deliverables:

- browser storage technology decision with benchmarks and ADR;
- schemas for accounts, posts, media, conversations, relationships, notifications, settings, drafts, capabilities, tombstones, and checkpoints;
- account-scoped repository APIs;
- schema versioning and resumable migrations;
- corruption detection and recovery;
- storage quota and retention policy;
- local diagnostics without content leakage;
- integration with current remote data flow behind flags.
- account-scoped timeline definitions, membership/order entries, gaps, source
  cursors, and checkpoints that keep feed identity separate from status
  records;
- editorial status, media, and conversation projections sufficient for Phase 8
  without presentation code parsing raw protocol payloads;
- fail-closed visibility normalization that preserves supported values,
  including `local`, without coercing unknown values to `public`.

Exit criteria:

- representative timelines and conversations can hydrate from canonical local records;
- timeline ordering, source provenance, and cursor ownership survive hydration
  without reconstructing them from status timestamps;
- migration interruption recovers safely;
- cross-account IDOR-style tests pass.

## Phase 6 — Durable outbox and synchronization reconciliation

Goal: support reliable local-first mutations and event processing.

Deliverables:

- durable outbox with stable operation IDs;
- retry classification, exponential backoff with jitter, upper bounds, and cancellation;
- idempotency strategy per mutation type;
- dependency ordering for uploads and posts;
- conflict handling for edits and drafts;
- stream/poll reconciliation with duplicate and out-of-order handling;
- account-scoped checkpoints;
- user-visible pending, retrying, failed, and conflict states;
- safe manual recovery tools.

Exit criteria:

- offline compose and supported actions reconcile correctly;
- permanent errors do not retry forever;
- duplicate requests do not create duplicate posts where preventable.

## Phase 7 — Legacy state isolation and module migration framework

Goal: prevent architecture drift while replacing inherited state and components.

Deliverables:

- inventory Redux slices, immutable data shapes, selectors, side effects, and persistence;
- domain selectors/commands around legacy state;
- server-state versus durable-state policy;
- module migration template;
- deprecated API tracking;
- test helpers for legacy/new-path equivalence;
- a feed-neutral timeline read model and commands that hide Redux, Dexie,
  transport, and protocol payloads from migrated presentation code;
- no direct legacy store access in newly migrated modules.

Exit criteria:

- at least Home and one secondary module use stable application boundaries;
- duplicate state sources have defined authority and retirement plan.

## Phase 8 — Home and For You editorial migration

Status: **Queued; see
[`PHASE_8_HOME_AND_BUILT_IN_FEEDS.md`](./PHASE_8_HOME_AND_BUILT_IN_FEEDS.md).**

Goal: deliver the first complete Paper-influenced content surface with
separate Home and For You timelines.

Deliverables:

- Home sourced from mutual, two-way relationship provenance;
- For You sourced from outbound-only, one-way relationship provenance and
  explicitly followed hashtags;
- no separate Following feed;
- deterministic relationship-transition reconciliation so entries move safely
  when a relationship becomes mutual or ceases to be mutual;
- account-scoped feed membership/order, source provenance, cursors,
  checkpoints, and independent state;
- post card anatomy using design-system components;
- media and quote treatment;
- conversation context preview;
- stable virtualization and versioned, account/instance/feed-scoped
  anchor-based scroll restoration;
- contextual actions and visible alternatives;
- skeleton, empty, offline, stale, and error states;
- selected/active icon states;
- accessibility and reduced-motion validation;
- performance benchmarks on mid-range mobile.

Exit criteria:

- Home and For You obey their documented source contracts and For You degrades
  honestly when followed-hashtag capability is unavailable;
- timeline behavior matches existing capabilities;
- no regression in moderation, visibility, media, CW, or backend-specific actions;
- no migrated presentation component parses raw payloads or directly reads
  Redux, Dexie, or transport clients;
- corrupt, expired, missing-anchor, logout, account-switch, and cross-account
  restoration cases pass;
- scrolling remains responsive under realistic feeds.

## Phase 9 — Conversation and reading experience

Goal: make long, branched social conversations understandable.

Deliverables:

- thread graph/normalized reply edges;
- branch navigation and ancestor context;
- participant and chronology cues;
- collapsed branch and load-more behavior;
- stable focus and scroll when replies arrive;
- accessible hierarchy and keyboard navigation;
- hooks for later summaries/interpolation without coupling UI to models.

Exit criteria:

- complex thread fixtures render correctly;
- deleted, hidden, blocked, and inaccessible ancestors do not leak content.

## Phase 10 — Composer and publishing migration

Goal: create a lightweight, reliable Framework7 composer before adding intelligence.

Deliverables:

- draft persistence and account scoping;
- visibility/audience controls;
- reply and quote context;
- media upload sequencing and recovery;
- content warnings and backend-specific content types;
- character/counting behavior;
- offline/pending publication state;
- edit/conflict handling;
- accessible keyboard and focus behavior.

Exit criteria:

- feature parity with current supported publishing behavior;
- drafts survive reload and failed uploads;
- no draft crosses account boundaries.

## Phase 11 — Explore and Search interaction shell

Goal: build the UI before binding it to the final intelligence engine.

Deliverables:

- combined Explore/Search navigation model;
- recent searches and prefix suggestions;
- result tabs/types;
- facet/chip/sheet patterns;
- Balanced, Exact, and Conceptual modes;
- Gist placeholder architecture;
- topic, entity, account, conversation, and media card types;
- explicit local/remote/degraded state indicators;
- “Why this result” interaction contract.

Exit criteria:

- shell works with current remote search and mock local providers;
- no UI assumptions lock the engine to one storage or model implementation.

## Phase 12 — Lexical engine prototype and evaluation corpus

Goal: prove browser-local full-text search with social-aware relevance.

Deliverables:

- lexical engine options benchmarked in workers;
- inverted index persistence strategy;
- social token classifier;
- exact handle, hashtag, URL, DID, code, quote, and phrase behavior;
- prefix search, typo tolerance, accent folding, stopword policy, split/concat handling;
- deterministic field priority plus BM25F-like scoring;
- index journal integration;
- evaluation corpus and relevance judgments;
- cold/warm latency, memory, storage, rebuild, and mutation benchmarks.

Exit criteria:

- exact-match preservation meets acceptance thresholds;
- prefix results are responsive on target mobile profile;
- corruption/rebuild and lexical-only degraded modes work.

## Phase 13 — Embedding runtime and semantic index prototype

Goal: prove local semantic retrieval within device budgets.

Deliverables:

- candidate embedding models evaluated for quality, language support, size, privacy, and licensing;
- model download, checksum, resume, eviction, and version management;
- versioned embedding templates;
- HNSW/Wasm or selected vector engine benchmark;
- strict dimension and metric validation;
- persistent vector index and bounded cache;
- insert/update/delete/tombstone/repair lifecycle;
- dual-index model migration;
- semantic score calibration experiments;
- fallback when model/index unavailable.

Exit criteria:

- selected baseline model materially improves conceptual recall;
- main thread remains responsive;
- model/index failure does not break Search.

## Phase 14 — Hybrid query planner and fusion

Goal: combine lexical and semantic retrieval correctly.

Deliverables:

- query normalization and intent classification;
- adaptive retriever/field/weight plans;
- candidate oversampling and union;
- reciprocal-rank fusion;
- relative-score fusion;
- calibrated weighted fusion experiments;
- semantic confidence gates preserving strong exact matches;
- stable pagination/cutoff policy;
- machine-readable contribution evidence;
- evaluation by query class.

Exit criteria:

- hybrid beats lexical and semantic baselines on agreed quality metrics without harming exact queries;
- ranking remains stable under candidate depth and filter changes.

## Phase 15 — Entity resolution and knowledge enrichment

Goal: add canonical entity understanding without coupling to external services.

Deliverables:

- local entity schema and alias index;
- mention detection and candidate generation;
- contextual disambiguation;
- Wikidata and DBpedia enrichment adapters;
- provenance, license/attribution, freshness, caching, and retry policy;
- ambiguous/unresolved states;
- entity facets and cards;
- privacy-minimized requests;
- evaluation for common ambiguous names.

Exit criteria:

- entity matches improve relevant queries;
- unavailable external enrichment leaves local search functional;
- incorrect links are correctable and do not become permanent facts.

## Phase 16 — Topic graph and conversation retrieval

Goal: represent broader themes and thread continuity.

Deliverables:

- versioned topic assignments with confidence;
- topic alias/index and relationships;
- conversation embeddings or features if evaluation supports them;
- topic and conversation retrievers;
- thread-aware search and personal recall queries;
- topic facets and Explore cards;
- drift and stale-topic handling.

Exit criteria:

- topics improve discovery without replacing exact search;
- inferred topics are deletable and account-safe.

## Phase 17 — Explainability, facets, and ranking controls

Goal: make hybrid intelligence understandable and controllable.

Deliverables:

- explanation evidence contract;
- user-readable “Why this result” output;
- facets for entity, topic, language, time, media, account, relationship, and source where supported;
- strict filters versus soft boosts clearly separated;
- result cutoffs and insufficient-confidence states;
- diagnostic ranking viewer behind a development flag;
- privacy review preventing explanation leaks.

Exit criteria:

- explanations match actual ranking contributions;
- inaccessible/private evidence is never disclosed.

## Phase 18 — Gist synthesis

Goal: implement Neeva-inspired structured synthesis over retrieved evidence.

Deliverables:

- evidence sufficiency and diversity checks;
- modular Gist schema;
- overview, key points, entities, topics, perspectives, and source links;
- citation/provenance model;
- uncertainty and disagreement representation;
- local generation baseline or deterministic extractive fallback;
- optional remote generation privacy gate if later approved;
- caching and invalidation when sources change;
- accessibility and non-generated fallback.

Exit criteria:

- no unsupported claims in evaluation fixtures;
- every claim is traceable to accessible evidence;
- insufficient evidence produces no confident synthesis.

## Phase 19 — Local personalization and Explore ranking

Goal: make discovery personally useful without hidden cloud profiling.

Deliverables:

- account-scoped explicit interest model;
- interaction signals with retention and user controls;
- canonical relevance versus personal utility separation;
- entity/topic/source affinity;
- diversity, repetition, and same-author controls;
- popularity caps and anti-feedback-loop protections;
- inspect/reset/delete/export controls;
- sensitive-inference policy and tests;
- Explore ranking evaluation.

Exit criteria:

- personalization can be disabled and deleted completely;
- disabling it leaves a coherent non-personalized Explore experience.

## Phase 20 — Semantic filtering

Goal: allow concept-aware reduction under explicit user control.

Deliverables:

- Hide, Reduce, and Deprioritize modes;
- scope and duration;
- positive/negative examples;
- confidence threshold and preview;
- exact and semantic policy combination;
- explanation, feedback, undo, and false-positive recovery;
- strict-filter fail-safe behavior;
- performance and overblocking evaluation.

Exit criteria:

- filters are predictable and reversible;
- broad semantic errors cannot silently hide large portions of content without user visibility.

## Phase 21 — Composer context engine

Goal: add low-burden contextual assistance to composing.

Deliverables:

- draft/thread/reply context projection;
- entity disambiguation;
- missing-context and likely-misunderstanding detection;
- duplicate conversation detection;
- concise sentiment/tone feedback;
- source/context suggestions;
- local processing baseline;
- explicit remote-model gate if later approved;
- dismissal, privacy, accessibility, and latency behavior.

Exit criteria:

- composer remains fully usable with intelligence disabled;
- suggestions are evidence-backed and do not block ordinary posting.

## Phase 22 — AI interpolator

Goal: reconstruct omitted or implicit context from accessible conversation evidence.

Deliverables:

- formal definition of interpolation versus summarization;
- antecedent/reference resolution;
- relevant reply selection;
- contradiction and uncertainty handling;
- provenance links;
- concise composer and reading-surface presentation;
- adversarial tests against fabricated context;
- privacy and inaccessible-content safeguards.

Exit criteria:

- interpolation never claims access to hidden/deleted content;
- uncertain reconstructions are labeled and traceable.

## Phase 23 — Notifications, profiles, bookmarks, lists, and settings migration

Goal: complete major Framework7 surface migration.

Deliverables:

- notifications grouping and noise reduction;
- profile and relationship actions;
- bookmarks and lists;
- account and instance settings;
- intelligence/privacy/storage controls;
- consistent cards, icons, motion, empty/error/offline states;
- capability-specific behavior through adapters.

Exit criteria:

- remaining high-use legacy screens have migration or retirement status;
- no major feature loses backend capability parity.

## Phase 23A — Custom Feeds

Status: **Queued; see
[`PHASE_23A_CUSTOM_FEEDS.md`](./PHASE_23A_CUSTOM_FEEDS.md).**

Goal: add playlist-like user-created feeds with private local operation,
protocol-aware sources, optional publication and subscription, semantic
composition, and pinned Home timelines.

Deliverables:

- versioned feed definitions, revisions, multi-origin membership,
  subscriptions, pin order, timeline entries, checkpoints, and view state;
- manual people, non-followed accounts, copied/synchronized lists, hashtags,
  literal keywords, semantic topics, and exclusions;
- protocol-aware Akkoma, Pleroma, and Mastodon-compatible source adapters;
- bounded, cancellable, rate-limit-aware assembly with canonical-URI
  deduplication and partial results;
- Feeds library, discovery-ready profile and artwork, creator preview, and
  accessible pin management;
- public, unlisted, private, publication, discovery, and subscription behavior
  only through a documented trusted authority;
- subscriber moderation, visibility, and server policy applied after creator
  selection and before display.

Exit criteria:

- ownership, private access, revision, subscription, cross-account IDOR, SSRF,
  migration, replay, race, fan-out, and hidden-membership tests pass;
- subscription and pinning remain distinct and independently reversible;
- non-followed accounts work without altering the user's follow graph;
- list synchronization preserves multi-origin membership;
- pinned feeds reuse the Phase 8 renderer and scoped anchor restoration;
- semantic unavailability degrades to lexical/hashtag behavior without
  bypassing safety policy;
- current, degraded, unsupported, and deferred behavior is documented
  accurately.

## Phase 24 — Media-rich editorial experiences

Goal: add modern Paper-like media and story treatment selectively.

Deliverables:

- media/story card eligibility rules;
- immersive viewer with spatial continuity;
- alt text, captions, content warnings, and reduced-motion behavior;
- image/video loading, caching, memory, and data-saver policy;
- keyboard and screen-reader controls;
- no automatic conversion of ordinary posts into stories.

Exit criteria:

- media experience is performant and accessible;
- low-data and reduced-motion modes remain first-class.

## Phase 25 — Local reranking and advanced retrieval experiments

Goal: evaluate deeper relevance only after the baseline is measurable.

Deliverables:

- bounded reranker contract;
- feature-based baseline;
- compact cross-encoder or late-interaction experiments where feasible;
- device capability policy;
- progressive reranking without disruptive reordering;
- quality, latency, memory, and energy comparison;
- safe fallback and model removal.

Exit criteria:

- reranking ships only if it provides material quality improvement within budgets.

## Phase 26 — Native bridge readiness

Goal: prepare the PWA architecture for Capacitor or equivalent native shells without forking behavior.

Deliverables:

- shared domain/application/search contracts;
- native bridge interfaces for key storage, background tasks, sharing, notifications, haptics, and file access;
- PWA/native capability matrix;
- storage/search conformance suite across engines;
- security boundary review;
- no raw private-key assumptions in web code.

Exit criteria:

- native work can begin without rewriting the application architecture;
- PWA remains a first-class product.

## Phase 27 — Security and privacy hardening program

Goal: conduct comprehensive adversarial review before production declaration.

Deliverables:

- auth/session/token review;
- XSS and rich-content sanitization tests;
- cross-account IDOR-style local access tests;
- cache and service-worker isolation review;
- URL preview/fetch safety;
- model and index input validation;
- prompt/data exfiltration review for optional models;
- deletion verification;
- dependency and supply-chain review;
- content/embedding/log leakage tests;
- threat model and remediation tracking.

Exit criteria:

- no known critical/high issue remains;
- medium risks have accepted owners and timelines.

## Phase 28 — Performance, battery, storage, and reliability hardening

Goal: validate real devices and realistic corpora.

Deliverables:

- device matrix including constrained iPhone/Android and desktop profiles;
- startup, scrolling, search, indexing, migration, rebuild, and model benchmarks;
- memory pressure and worker termination tests;
- battery/thermal profiling;
- storage quota and eviction simulations;
- long-session and account-switch soak tests;
- crash/reload/service-worker update recovery;
- documented budgets and regressions gates.

Exit criteria:

- agreed budgets pass on supported target profiles;
- degraded modes activate correctly under pressure.

## Phase 29 — Accessibility and internationalization certification

Goal: verify the complete application, not just components.

Deliverables:

- WCAG 2.2 AA audit;
- VoiceOver, TalkBack, keyboard, switch/focus testing;
- reduced motion, increased contrast, forced colors, and text scaling;
- RTL layout/icon mirroring;
- CJK, combining characters, emoji, and multilingual search tests;
- accessible Gist and dynamic result announcements;
- remediation and regression suite.

Exit criteria:

- no known blocking accessibility defect remains;
- supported-language search behavior is documented.

## Phase 30 — Legacy removal and architecture convergence

Goal: remove superseded frameworks, icon sets, duplicate state, and compatibility branches safely.

Deliverables:

- usage-proven removal of legacy shell/components;
- removal of unused icon packages;
- elimination of duplicate stores and APIs;
- feature-flag cleanup;
- migration completion and rollback archive;
- bundle and dependency reduction;
- canonical docs updated to current state.

Exit criteria:

- no production code depends on deprecated architecture without an explicit exception;
- build, tests, and migration from supported prior release pass.

## Phase 31 — Production readiness and release governance

Goal: declare readiness based on evidence.

Deliverables:

- release checklist and rollback procedure;
- supported browser/device/backend capability matrix;
- known limitations;
- migration and storage guidance;
- privacy disclosures and user controls documentation;
- incident and broken-release recovery plan;
- final documentation reconciliation;
- staged rollout criteria;
- post-release monitoring using privacy-safe diagnostics.

Exit criteria:

- production readiness review approves code, tests, security, privacy, accessibility, performance, migration, and documentation;
- no phase is marked complete solely because a prototype exists.

## Dependency summary

```text
0 → 1 → 2 → 3
        ├→ 4
        └→ 5 → 6 → 7 → 8 → 9 → 10 → 11

5 + 11 → 12 → 13 → 14 → 15 → 16 → 17 → 18
                                      ├→ 19 → 20
                                      └→ 21 → 22

5 + 6 + 7 + 8 + 12–17 + 19–20 + 23 → 23A

Design/application migrations continue through 23–24. Custom Feeds are added
as Phase 23A without renumbering the established roadmap.
Advanced experiments begin only after measurable baseline: 25.
Native readiness: 26.
Cross-cutting hardening: 27–29.
Convergence and release: 30–31.
```

## Roadmap maintenance

- Add links to PRs and implementation documents under each phase.
- Split a phase only when its dependency and completion criteria remain explicit.
- Do not renumber completed phases casually; append subphases when needed.
- Record deferrals in the phase and ADR register.
- Review the roadmap after every five phases or major architectural discovery.

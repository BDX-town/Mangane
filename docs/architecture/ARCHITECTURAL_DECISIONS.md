# Mangane Architectural Decision Register

Status: **Canonical ADR index**

Last updated: 2026-07-25

This register is append-oriented. A decision may be superseded, but its rationale must remain available. Material implementation changes require an ADR update in the same pull request.

## ADR-001 — Framework7 React is the adaptive presentation framework

Status: Accepted

Decision: Use Framework7 React for navigation, pages, sheets, dialogs, adaptive component behavior, safe areas, and phone/tablet application structure.

Rationale: Mangane needs a PWA that feels close to a high-quality native application while preserving web deployment and later native-wrapper options.

Constraints:

- Framework7 does not own domain, protocol, persistence, or intelligence logic.
- Mangane wraps foundational components where product consistency requires it.
- Platform adaptation cannot create unrelated product identities.

## ADR-002 — Apple HIG is the default quality baseline, not a mandate to impersonate iOS

Status: Accepted

Decision: Apply HIG principles for hierarchy, controls, motion, accessibility, touch targets, focus, and spatial continuity. Adapt behavior for other platforms while retaining Mangane identity.

Rejected: a single rigid iOS skin on every operating system; completely unrelated per-platform products.

## ADR-003 — Mangane is local-first, not local-only

Status: Accepted

Decision: Canonical social data originates from remote protocol servers, while normalized caching, search indexes, intelligence, drafts, and preferences are local-first. Remote services may be optional enrichments with explicit privacy boundaries.

## ADR-004 — Hybrid search replaces semantic-only search

Status: Accepted

Decision: Search combines full-text and semantic retrieval. Exact identifiers, quotes, URLs, names, hashtags, and codes must not depend on embeddings.

Rejected: vector-only search; lexical search merely used as fallback after semantic failure.

## ADR-005 — ObjectBox is an architectural reference for embedded semantic indexing

Status: Accepted

Decision: Emulate vectors as first-class derived projections, HNSW retrieval, incremental maintenance, bounded caches, metadata constraints, and lifecycle repair.

Constraint: Do not assume ObjectBox is the PWA implementation. Browser support, storage, licensing, bundle impact, and conformance must be evaluated.

## ADR-006 — Weaviate informs hybrid orchestration

Status: Accepted

Decision: Emulate parallel lexical/vector retrieval, candidate union, oversampling, fusion, filters versus boosts, reranking, named vectors where justified, and score explanations.

Improvement: use adaptive query planning and robust score calibration rather than a single global alpha or only candidate-relative min-max normalization.

## ADR-007 — Meilisearch informs lexical relevance and search interaction

Status: Accepted

Decision: Emulate typo tolerance, prefix search, matched-word coverage, proximity, exactness, field priority, split/concatenated term recovery, facets, semantic distribution calibration, and embedding templates.

Improvement: combine deterministic social-search rules with BM25F-style scoring and classify identifiers before fuzzy behavior.

## ADR-008 — Canonical records and derived indexes are separate

Status: Accepted

Decision: Local normalized records are authoritative for cached content. Lexical, vector, entity, topic, explanation, and Gist data are rebuildable projections coordinated through a durable index journal.

## ADR-009 — Wikidata and DBpedia enrich local canonical entities

Status: Accepted

Decision: Maintain an internal canonical entity model. External knowledge bases supply aliases, identifiers, descriptions, and relationships with provenance.

Rejected: storing external entity responses as the domain model; sending unnecessary private context during enrichment.

## ADR-010 — Relevance and personalization remain separate

Status: Accepted

Decision: Ranking records canonical relevance separately from personal utility adjustments. Personalization must be local, inspectable, deletable, and account-scoped by default.

## ADR-011 — Phosphor is the canonical product icon system

Status: Accepted

Decision: Use Phosphor for Mangane navigation, social actions, content types, search, intelligence, entities, topics, and editorial surfaces. Use Framework7 icons only for deeply integrated platform affordances.

Migration: inventory and remove visible mixing of Tabler, Feather, Bootstrap Icons, Line Awesome, and other legacy sets through a semantic icon registry.

## ADR-012 — Facebook Paper, Artifact, and Neeva Gist are inspirations, not templates

Status: Accepted

Decision: Borrow Paper's editorial spatiality, Artifact's restrained intelligence, and Neeva Gist's structured synthesis. Do not copy opaque gestures, centralized profiling, source-obscuring summaries, or make every post a story.

## ADR-013 — Composer intelligence is advisory and low burden

Status: Accepted

Decision: Analyze draft/thread context for ambiguity, missing context, sentiment, entity confusion, duplicate discussion, and interpolation. Surface concise, dismissible help. Do not grade, shame, or automatically post.

## ADR-014 — Advanced intelligence must degrade gracefully

Status: Accepted

Decision: Search and core social use remain functional without embeddings, local models, reranking, or entity enrichment. Supported fallback chain: full hybrid → lexical/vector reduced → lexical/entity → remote search plus local filters.

## ADR-015 — Account-scoped derived data is mandatory

Status: Accepted

Decision: Embeddings, semantic profiles, indexes, histories, and caches require explicit account scope. Cross-account sharing is opt-in through a separate approved local profile.

## ADR-016 — No hidden cloud profiling by default

Status: Accepted

Decision: Core personalization and semantic indexing do not require uploading interaction histories, private content, or drafts. Remote models require explicit invocation, disclosure, and minimization.

## ADR-017 — Migration is incremental and reversible

Status: Accepted

Decision: Introduce stable boundaries, feature flags, resumable migrations, compatibility adapters, and rollback paths. Do not replace the entire inherited application in one branch.

## ADR-018 — Documentation is an implementation artifact

Status: Accepted

Decision: Architecture, contracts, migration status, and roadmap completion are updated with code. Conflicting documentation must be removed, superseded, or marked historical. A phase cannot be marked complete based only on code existing somewhere in the repository.

## ADR-019 — Modernization crosses account-scoped application and protocol seams

Status: Accepted

Date: 2026-07-25

Decision: New or migrated behavior crosses domain repository, application command/query, protocol capability, typed error, account-scope, and runtime environment contracts. Legacy transports and state remain behind adapters until equivalence is proven.

Context: Presentation actions previously selected backend endpoints and fallback strategies directly. That coupling makes incremental modernization, account isolation, error consistency, and safe rollback difficult.

Alternatives considered: a full rewrite; component-local service wrappers; direct replacement of Redux actions; untyped feature detection.

Rationale: Explicit seams allow one behavior at a time to move without changing visible effects, while scope binding and runtime validation establish fail-closed authority boundaries.

Consequences and tradeoffs: Transitional adapters add a small amount of indirection. Each migrated feature must test protocol selection and legacy equivalence. Existing presentation debt remains inventoried and drift-gated until removed.

Security/privacy impact: Repositories bind to exact account and instance scope; response data is validated; application errors avoid retaining transport payloads; runtime flag input is allowlisted.

Migration/rollback: `architecture.accountLookupAdapter` defaults to the new account-lookup path. Its registered rollback value restores the prior path. The flag is removed only after Phase 7 equivalence evidence.

## ADR template

```markdown
## ADR-NNN — Title

Status: Proposed | Accepted | Superseded | Deprecated

Date:

Decision:

Context:

Alternatives considered:

Rationale:

Consequences and tradeoffs:

Security/privacy impact:

Migration/rollback:

Supersedes / superseded by:
```

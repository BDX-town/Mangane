# Mangane Architectural Decision Register

Status: **Canonical ADR index**

Last updated: 2026-07-29

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

## ADR-020 — Home and For You are distinct relationship-aware timelines

Status: Accepted

Date: 2026-07-28

Decision: Home and For You are separate built-in timelines. Home is based on
mutual, two-way follow provenance. Initial For You is the latest-first,
deduplicated union of outbound-only, one-way follow provenance and posts from
explicitly followed hashtags. There is no separate Following feed.

Context: The inherited `home` timeline combines server behavior behind one
label and does not provide relationship-classified membership or independent
For You state. Mangane needs a clean mutual-relationship Home and a separate
place for one-way follows and followed hashtags without prematurely
introducing opaque ranking.

Alternatives considered: add a separate Following feed; put all followed
accounts into Home regardless of reciprocity; launch engagement ranking
immediately; merge future Custom Feeds into one Home stream.

Rationale: Distinct source contracts are understandable, testable, and
portable across protocol adapters. A deterministic baseline establishes
observable behavior before personalization experiments.

Consequences and tradeoffs: Phase 5 must store feed membership/order separately
from statuses, and Phase 7 must expose a feed-neutral read model. Relationship
changes must move membership between Home and For You idempotently. Servers
that cannot enumerate followed hashtags keep the outbound-only For You source
available and report the degraded capability rather than fabricating results.

Security/privacy impact: Feed records, checkpoints, and view state are bound to
account and instance scope. Initial For You does not infer sensitive interests
or upload interaction history. Subscriber moderation and server authorization
remain mandatory.

Migration/rollback: Ship through a bounded Phase 8 feature flag. The legacy
Home surface remains the rollback path until parity, account-isolation,
accessibility, and performance gates pass.

## ADR-021 — Custom Feeds are a separate staged phase with a trusted publication authority

Status: Accepted

Date: 2026-07-28

Decision: Custom Feeds are Phase 23A, with private local feeds allowed before
public publication. Public/unlisted publication, discovery, revision
distribution, subscriber counts, and private-feed access require a documented
server protocol or authenticated registry authority. A portable signed recipe
may transport a public definition and prove authorship/integrity, but cannot
authorize stateful or private operations. Client-supplied creator identity is
never authorization.

Context: The requested feature spans non-followed accounts, list
synchronization, keywords, semantic topics, publication, subscription,
discovery, pinning, migration, and resilient multi-source retrieval. The
current repository is a frontend and contains no verified authority for the
community publication operations.

Alternatives considered: expand Phase 8; treat browser storage as the public
authority; silently depend on one backend's list semantics; renumber the
established roadmap.

Rationale: Phase 23A can depend explicitly on the canonical store, sync,
timeline renderer, search/topic/filtering engines, and migrated list/settings
surfaces without reopening or renumbering completed phases.

Consequences and tradeoffs: Private local creation can deliver value earlier,
but cross-device/community claims wait for an authority decision. Published
output may vary by subscriber because visibility, federation reach, and
moderation differ.

Security/privacy impact: Every object action requires authenticated
object-level authorization and account binding. Definitions, memberships,
revisions, resolvers, media, retries, and fan-out are bounded and validated.
Subscriber policy overrides creator selection, and private tuning evidence is
not disclosed.

Migration/rollback: Each Phase 23A slice is additive and feature-flagged.
Definitions and revisions are schema-versioned; disabling publication leaves
private local feeds intact where compatible. Removal follows the documented
purge and tombstone policy.

## ADR-022 — FediBuzz is an optional client-side broader-discovery source

Status: Accepted

Date: 2026-07-29

Decision: Integrate the advertised FediBuzz aggregate public Mastodon-compatible
stream as an optional Phase 23A Custom Feed candidate source through one
account-scoped shared browser connection. Mangane applies indexed hashtag,
author-domain, literal, and semantic rules locally, persists only statuses
accepted by at least one feed, deduplicates by canonical ActivityPub object URI,
and renders accepted posts through the normal timeline components.

The first implementation does not follow generated FediBuzz relay actors, expose
an ActivityPub inbox, operate a relay service, require Cloudflare Tunnel or
ngrok, or add a separate ingestion backend. The source advertises live but not
historical, resumable, or replayable capability.

Context: FediBuzz differs from conventional push-only relays by advertising an
aggregate public streaming endpoint and by exposing filtered hashtag/instance
relay actors. Mangane needs broader public discovery for topic-oriented Custom
Feeds without turning the PWA into federation infrastructure. One aggregate
connection can carry statuses originating from many instances observed by
FediBuzz; it is not a connection to only mastodon.social or another single
origin instance.

Alternatives considered: connect directly to one large instance; open one
connection per feed or hashtag; follow FediBuzz actors through a public Mangane
inbox; operate a Mangane relay/ingestion service; omit broader discovery.

Rationale: A single shared direct stream is the least complex path that broadens
candidate coverage while preserving home-server APIs as historical and
protocol-authoritative sources. Indexed local dispatch avoids per-feed socket
fan-out and unnecessary semantic work.

Consequences and tradeoffs: Coverage depends on what FediBuzz observes and is
not the entire Fediverse. Collection is not guaranteed while the PWA is closed.
Direct browser use depends on a successful CORS/event-schema/mobile capability
probe. Unsupported deployments degrade to account, list, Home, Local, and
native hashtag sources.

Security/privacy impact: FediBuzz is candidate transport, not a moderation or
authorization override. Subscriber blocks, mutes, domain policy, visibility,
and server restrictions remain mandatory. Raw aggregate traffic is not
persisted. All queues, caches, workers, diagnostics, and lifecycle state are
bounded and account scoped.

Migration/rollback: Ship behind an owned feature/capability flag. Rollback closes
the shared reader, cancels worker work, removes source registrations, purges
FediBuzz-only matches according to policy, and retains canonical records that
have independent protocol-source provenance.

## ADR-023 — Durable Streams are a separate optional resumable event phase

Status: Accepted

Date: 2026-07-29

Decision: Add Phase 6A for provider-neutral Durable Streams adoption after Phase
6 foundations. Mangane may use an external durable stream authority for
approved event families that require ordered replay and offset-based catch-up.
Application code depends on opaque-offset, account-scoped resumable event
contracts rather than a vendor SDK. Event effects and the next offset commit in
one local transaction, and every consumer retains a canonical snapshot/reset
and prior polling/local rollback path.

Context: PWAs lose ephemeral SSE/WebSocket continuity during suspension,
termination, refresh, offline periods, and device changes. Durable Streams can
improve feed revision delivery, status lifecycle reconciliation, account moves,
index journals, long-running jobs, notifications, and other Mangane features,
not only FediBuzz or Custom Feeds. Durability, however, requires an external
producer and retained stream; a browser client cannot make an ephemeral
FediBuzz stream durable by itself.

Alternatives considered: treat direct SSE checkpoints as durable resume; make
Durable Streams part of Phase 23A only; adopt one hosted vendor directly in
feature code; require all Mangane deployments to run a stream server; rely only
on polling forever.

Rationale: A separate additive phase preserves architectural clarity and allows
one narrow, high-value event family to prove authorization, replay,
transactionality, reset, retention, mobile performance, and provider exit before
broader adoption.

Consequences and tradeoffs: Durable delivery adds an external authority,
producer, retention, authentication, operations, and cost boundary when used.
It remains optional; cached reading, ordinary protocol polling, local search,
and Phase 6 outbox behavior must continue when the provider is disabled or
unavailable.

Security/privacy impact: Producer/admin credentials never enter the PWA. Read,
append, and administration privileges are separate. Private streams require
object-level authorization and account/tenant isolation. URLs and opaque IDs are
not authorization. Payloads are minimized, bounded, versioned, and excluded from
content-bearing diagnostics.

Migration/rollback: Provider selection requires a later implementation ADR with
conformance, retention, privacy, cost, and exit evidence. Each stream class has
its own feature flag. Rollback cancels readers/producers, preserves committed
canonical state, restores the prior polling/snapshot path, and revokes or purges
provider-specific credentials and checkpoints according to policy.

## ADR-024 — Compression is capability-negotiated and bounded

Status: Accepted

Date: 2026-07-29

Decision: Add Phase 4A for gzip and zstd across deployment response coding, selected local persistence, and export/import boundaries. Browser JavaScript does not set Accept-Encoding or manually decode normal fetch responses. Gzip is the portable baseline; zstd is optional and requires verified browser/server capability, RFC 9659 window limits, measured benefit, bounded worker execution, and an identity fallback.

Context: Mangane can reduce network and storage cost, but HTTP negotiation is user-agent/server controlled, browser zstd support is uneven by operation, and careless decompression or shared secret compression creates security and reliability risks.

Alternatives considered: gzip only forever; mandatory zstd WebAssembly; compress every record; application-controlled HTTP negotiation; deployment-only documentation.

Rationale: A provider-neutral codec boundary and measured per-payload policy preserve portability while allowing zstd where it is genuinely beneficial.

Consequences and tradeoffs: Compression adds CPU, memory, migration, cache-variant, and corruption handling. Small or already-compressed payloads remain identity.

Security/privacy impact: Expanded bytes, ratio, time, window, queue, and recursion are bounded. Secrets and attacker-controlled material do not share unsafe compression contexts. Codec diagnostics contain no payloads or sensitive identifiers.

Migration/rollback: Mixed compressed and identity local records remain readable. Disabling zstd falls back to gzip or identity; disabling local compression preserves canonical data.

## ADR-025 — Origin servers are preferred for public aggregate reconciliation

Status: Accepted

Date: 2026-07-29

Decision: Add Phase 8A to reconcile remote posts against the server controlling the canonical ActivityPub object URI when safe and available. Origin observations may refresh public edits, tombstones, polls, replies, and aggregate counts. Connected-server state remains authoritative for viewer permissions, moderation, local action IDs, and favourited/reblogged/bookmarked/muted state.

Context: Federated copies can lag. ActivityPub routes replies, Likes, Announces, Updates, and Deletes toward the object authority, making the origin the strongest available public aggregate perspective, but not a guaranteed globally complete source. Direct browser access may also be blocked by CORS or authentication.

Alternatives considered: trust only the connected copy; replace the whole connected status with origin JSON; poll every origin continuously; operate a generic CORS proxy; label origin counts globally exact.

Rationale: Field-level authority gains freshness without discarding viewer-aware state or weakening browser security.

Consequences and tradeoffs: Coverage varies by origin capabilities and federation delivery. Adaptive polling, validators, per-origin budgets, and connected-server fallback are required.

Security/privacy impact: Canonical destinations, redirects, schemas, bodies, recursion, concurrency, and credentials are fail-closed and bounded. Connected tokens never go to origin servers, and subscriber moderation still wins.

Migration/rollback: Origin observations and aliases are additive provenance. Rollback stops origin scheduling and returns to connected-server streaming/polling plus local cache without changing viewer state.

## ADR-026 — Timeline position uses semantic local anchors and does not require Durable Streams

Status: Accepted

Date: 2026-07-29

Decision: Add Phase 5E for account-scoped timeline position continuity using canonical item identity, order key, relative visual offset, neighbour hints, layout revision, and optional source checkpoint. Local IndexedDB persistence, bounded hydration, virtualization adapters, and layout stabilization provide same-device restoration. Durable Streams and Mastodon markers remain optional enhancements rather than prerequisites or visual-position authorities.

Context: Native clients preserve reading position, while a PWA must survive asynchronous hydration, variable-height cards, virtualization, media loading, browser refresh, suspension, and new items inserted above the viewport. Raw scrollTop and server last-read IDs are insufficient.

Alternatives considered: raw pixel persistence; always return to newest; require Durable Streams; rely only on browser scroll restoration; use Mastodon markers as exact position.

Rationale: A semantic anchor survives content and layout changes and can be reconstructed from the local-first timeline store and ordinary pagination.

Consequences and tradeoffs: Restoration needs account-scoped records, tab ownership, bounded window hydration, media sizing, compensation, and deterministic missing-anchor recovery.

Security/privacy impact: Position records contain no post body or credentials, are purged with account data, and are not synchronized remotely without explicit authority and privacy policy.

Migration/rollback: Position capture/restoration is feature-flagged and additive. Rollback retains normal browser navigation and canonical timeline data; optional records may be purged by policy.

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
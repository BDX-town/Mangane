# Phase 9 — Origin-Authoritative Conversation Trees and Reading Experience

Status: **Accepted target / queued after Phase 8D and required Phase 8A/Phase 7 dependencies**

Last updated: 2026-07-30

## Purpose

Make long, branched Fediverse conversations easier to understand than either the inherited flat Mangane thread view or Phanpy's current semi-collapsible nested-comment implementation, while preserving Mangane's existing authority, storage, moderation, origin-resolution, context-recovery, pagination, and presentation boundaries.

This phase does not add another conversation source, status store, context fetcher, origin resolver, moderation path, or reply authority. It projects the canonical reply graph already assembled from Mangane's approved authorities into an adaptive, accessible conversation reading model.

## Product outcome

Mangane presents a conversation as a set of understandable branches rather than a single depth-first list.

The default conversation view must make these relationships visible:

- the root post and its canonical author continuation;
- the focused path from the root to the selected reply;
- direct reply branches;
- nested replies within each branch;
- missing, deleted, filtered, unavailable, and depth-truncated links;
- unread and newly active branches;
- the difference between structural order and strict chronology.

A user opening a deeply nested reply should immediately understand what it replies to, where its branch began, what the root author added, and which neighboring branches are collapsed.

## Non-negotiable authority model

### Origin server is the default public source of truth

Phase 8A remains authoritative. The server controlling the canonical ActivityPub object URI is the preferred public authority for:

- canonical object identity and aliases;
- current public content and edits;
- tombstones and deletion state;
- public poll state;
- origin-maintained replies references/context and public reply aggregates;
- public favourite and Shared aggregates where available.

Conversation hydration therefore attempts the approved origin-authority strategies by default whenever safe and technically available. There is no optional product action named "Check original server for more replies" and no assumption that the connected server's federated copy is the primary public truth.

### Connected server remains authoritative for viewer-specific state

The authenticated connected server remains authoritative for:

- whether the signed-in viewer may access the status or context;
- private, followers-only, direct, or otherwise viewer-scoped context;
- connected-server moderation, blocks, mutes, filters, domain policy, and relationship state;
- local status IDs and authenticated action endpoints;
- viewer flags such as favourited, Shared, bookmarked, muted, pinned, or filtered;
- action permissions and write outcomes.

Origin retrieval never receives the connected account's bearer token or cookies. An origin observation may update public fields but cannot clear or invent viewer-specific state.

### Local canonical authority

Mangane's canonical repositories remain authoritative for:

- normalized statuses and canonical URI aliases;
- reply-edge observations and provenance;
- field-level merge revisions and freshness;
- account-scoped conversation projections;
- tombstones, missing-link records, conflict records, and repair outcomes;
- branch expansion, unread, reading-anchor, and focused-path state;
- pending local replies and optimistic mutations;
- the last verified representation used offline.

The presentation layer consumes a projection. It does not parse raw protocol payloads or directly call origin, connected-server, Redux, React Query, or Dexie transports.

## Dependencies and collision boundaries

Phase 9 depends on:

- Phase 5 canonical status, conversation, tombstone, and account-scoped persistence authorities;
- Phase 5E semantic reading-position and virtualization-anchor infrastructure;
- Phase 6 reconciliation and generation fencing for pagination, streaming, hydration, retries, replay, and multi-tab effects;
- Phase 7 feed-neutral repositories, commands, projections, protocol capabilities, typed errors, and rollback seams;
- Phase 8 canonical status/card rendering and Framework7 adaptive surfaces;
- Phase 8A origin-authority reconciliation and canonical URI alias mapping;
- Phase 8D content-type-safe rendering for Markdown and MFM posts;
- the merged bounded Context Recovery Coordinator for missing same-instance ancestor links.

Phase 9 must not duplicate or rename:

- `OriginStatusAuthority` or its origin-discovery, validation, scheduling, and field-level merge policy;
- the Context Recovery Coordinator or canonical `fetchStatus` transport;
- status/context Redux ownership during migration;
- Phase 5 canonical repositories;
- Phase 5E timeline position anchors;
- the Phase 8 status renderer;
- moderation, sanitizer, URL, destination, media, notification, or account-transition authorities;
- later summaries, composer context, AI interpolation, or entity-resolution systems.

The phase name is **Phase 9 — Origin-Authoritative Conversation Trees and Reading Experience**. Internal symbols should use `conversationGraph`, `conversationProjection`, `conversationBranch`, and `conversationViewState`; avoid generic names such as `Tree`, `Node`, `Context`, `ThreadStore`, or `ReplyCache` that collide with existing framework, Redux, protocol, or browser concepts.

## Current Mangane baseline

The inherited status-detail surface currently:

- fetches the focused status and context;
- stores parent-to-child reply relationships and in-reply-to mappings;
- calculates ancestors and descendants;
- walks descendants into a mostly flat ordered set;
- renders vertical connector lines;
- virtualizes the list and supports keyboard movement;
- paginates context and renders tombstones, pending posts, placeholders, compose state, media, and actions;
- now includes bounded missing-parent context recovery and semantic scroll-anchor foundations.

This is a useful compatibility base, but it does not preserve branch identity in the presentation model, does not expose a focused path, and does not provide adaptive branch summaries or durable per-branch reading state.

## Phanpy reference and deliberate improvements

Mangane may emulate these useful Phanpy ideas:

- recursive reply branches rather than a flat list;
- author continuations distinguished from outside discussion;
- semi-collapsible reply groups;
- compact branch summaries with participant and count cues;
- lazy rendering for large discussions;
- remembered expansion and scroll state;
- explicit placeholders for missing ancestors;
- keyboard traversal and branch expansion.

Mangane must improve on Phanpy by:

- never mutating normalized status entities with presentation-only reply arrays;
- using one immutable canonical reply graph with explicit provenance;
- making origin-first hydration the default architecture rather than a manual follow-up;
- preserving exact chronological access alongside structural conversation order;
- providing focused-path navigation for deep links;
- persisting account-scoped expansion, unread, and reading state through approved repositories;
- applying moderation before branch counts, avatars, previews, labels, and unread totals;
- using deterministic, documented branch policy rather than opaque or unstable engagement ranking;
- supporting incomplete, conflicting, cyclic, malformed, and depth-truncated graphs explicitly;
- using ordinary accessible regions, sections, headings, and buttons instead of forcing a fragile ARIA tree interaction model;
- keeping large-thread work bounded and virtualization-compatible.

## Canonical conversation graph

### Data contract

The graph is an immutable derived model over canonical status and edge observations.

```ts
interface ConversationGraph {
  schemaVersion: 1;
  accountScopeKey: string;
  rootCanonicalUri: string;
  focusedCanonicalUri: string;
  revision: string;
  completeness: ConversationCompleteness;
  nodeByCanonicalUri: ReadonlyMap<string, ConversationGraphNode>;
  rootChildUris: readonly string[];
  focusedPathUris: readonly string[];
  diagnostics: ConversationGraphDiagnostics;
}

interface ConversationGraphNode {
  canonicalUri: string;
  statusAliasIds: readonly StatusAliasRef[];
  parentCanonicalUri: string | null;
  childCanonicalUris: readonly string[];
  depth: number;
  branchRootCanonicalUri: string;
  pathCanonicalUris: readonly string[];
  kind:
    | 'root'
    | 'author-continuation'
    | 'direct-reply'
    | 'nested-reply'
    | 'missing'
    | 'tombstone'
    | 'filtered-placeholder'
    | 'depth-truncated';
  provenance: readonly ReplyEdgeObservationRef[];
  moderationState: ConversationModerationState;
  createdAt?: string;
  editedAt?: string;
}

type ConversationCompleteness =
  | 'origin-verified'
  | 'origin-and-viewer-merged'
  | 'connected-fallback'
  | 'cached-stale'
  | 'partial'
  | 'unauthorized'
  | 'unavailable'
  | 'malformed'
  | 'cyclic'
  | 'depth-truncated';
```

The exact implementation may refine names and shapes, but it must preserve these semantic separations.

### Reply-edge authority and merge

Candidate edges may come from:

- origin context or origin replies collections through Phase 8A;
- connected-server context through the authenticated protocol adapter;
- canonical statuses already observed in timelines, notifications, search, or local storage;
- pending local replies;
- the Context Recovery Coordinator's verified ancestor repairs;
- approved discovery candidates only when their canonical `inReplyTo` relationship is verified.

Edges are deduplicated by canonical child URI plus canonical parent URI. Conflicting parents do not silently overwrite one another. They enter a bounded conflict outcome with provenance and deterministic display fallback.

### Validation and graph safety

Required controls:

- canonical URI and alias validation through existing authorities;
- maximum identifier and URI lengths;
- duplicate node and edge elimination;
- cycle detection using visiting/visited sets;
- self-parent rejection unless a verified adapter contract explicitly represents it safely;
- maximum ancestor depth, descendant depth, node count, edge count, bytes, construction time, and per-origin requests;
- stable deterministic sibling ordering;
- no recursive arbitrary-URL crawling;
- no prototype-bearing or mutable raw payload objects in the projection;
- no cross-account viewer-state reuse;
- generation fencing so stale responses cannot replace a newer graph after account, instance, route, or focused-status changes.

## Origin-first conversation hydration pipeline

```text
open status detail / conversation
  -> resolve canonical URI and origin through Phase 8A
  -> read last verified local canonical graph/window
  -> start approved origin public-status/context observation by default
  -> fetch connected viewer-aware context in parallel or capability order
  -> invoke Context Recovery Coordinator only for unresolved verified ancestor links
  -> import all accepted observations through canonical normalizers/repositories
  -> field-level merge origin public truth with connected viewer state
  -> apply authorization and moderation
  -> build immutable conversation graph
  -> derive structural and chronological projections
  -> restore focused path, branch expansion, unread state, and semantic anchor
  -> render through Phase 8/Framework7 presentation adapters
```

The UI may render cached or connected context immediately while origin reconciliation proceeds. Origin retrieval must not block first paint, and late origin results must preserve focus and reading position.

### Retrieval policy

Phase 9 consumes Phase 8A policy outputs; it does not create a new scheduler.

For an actively visible conversation, origin public context is a high-priority refresh condition. Requests must:

- use validators where available;
- honor `Retry-After`;
- use bounded exponential backoff with full jitter;
- share per-origin concurrency and circuit-breaker budgets;
- cancel or fence stale work;
- retain verified cached context when refresh fails;
- distinguish unsupported, unauthorized, unavailable, malformed, rate-limited, offline, and aborted outcomes.

## Conversation projections

### Structural conversation view

Default view groups the conversation into:

1. root post;
2. root-author continuation lane;
3. direct reply branches;
4. nested branch content;
5. compact summaries for collapsed branches.

A root-author continuation is classified only when the canonical parent/author relationship supports it. The UI must not infer continuation solely because two adjacent posts share an account.

### Focused-path view

Opening a nested reply makes the root-to-focused path visible and expanded. Unrelated sibling branches may remain summarized.

The focused path must include explicit missing/tombstone placeholders so the interface never implies a direct relationship across an unavailable intermediate post.

A breadcrumb or equivalent compact cue may show:

```text
Root post > Alice's reply > Bob's branch > Selected post
```

The breadcrumb is navigation, not a substitute for visible context.

### Chronological view

Mangane provides an explicit strict chronological alternative. It must:

- retain parent/branch cues;
- sort by verified timestamps with deterministic tie-breaking;
- avoid pretending timestamps establish reply parentage;
- preserve the same moderation, authority, and completeness rules;
- be reachable without losing the focused status or reading anchor.

The structural view is default; chronological view remains an inspectable truth-preserving alternative.

### Branch summaries

A collapsed branch summary may include:

- branch starter preview from authorized visible content;
- number of direct replies and total visible descendants;
- up to a bounded number of moderation-safe participant avatars;
- last activity time;
- unread/new reply count;
- root-author participation cue;
- missing/hidden content count without actor or content leakage;
- expand/collapse control and link to focused branch view.

Counts must clearly distinguish origin aggregate replies from currently authorized/renderable replies where both are shown. Absence is never converted to zero.

## Adaptive branch policy

Branch expansion is deterministic and user-overridable.

Policy inputs may include:

- total visible conversation size;
- branch visible descendant count;
- focused path membership;
- explicit user expansion/collapse state;
- viewer participation;
- root-author participation;
- unread descendants;
- branch recency;
- bounded estimated rendered height;
- content-warning and media layout cost;
- device viewport and data/memory constraints.

Initial defaults:

- always expand the focused path;
- expand all branches for small conversations within a measured threshold;
- expand a bounded amount of root-author continuation;
- expand branches containing the viewer or unread replies unless the user explicitly collapsed them;
- summarize large or off-path branches;
- never reorder branches solely by reaction or popularity counts;
- never change manual branch state because engagement counts changed;
- expose "Expand all" only when node/render budgets allow it safely.

Thresholds belong in a versioned policy module with tests and telemetry-free local diagnostics, not scattered component constants.

## Conversation overview for large threads

Large conversations receive a compact branch index rather than an unreadable miniature graph.

Example:

```text
Conversation - 42 visible replies - 9 participants - 6 branches
Author continuation       4 posts
Alice's branch            12 posts - 3 unread
Bob's branch               7 posts
Carol's branch            15 posts - active recently
Other replies              4 posts
```

The overview must:

- be generated after moderation;
- avoid leaking hidden actors or content;
- support keyboard, touch, switch, and screen-reader navigation;
- scroll to or focus a branch without losing the current route state;
- work as a sheet on phone and a side panel or inline index on wider layouts;
- avoid creating a second navigation or router authority.

## Reading state and persistence

### Account-scoped view state

Persist only approved bounded state:

```ts
interface ConversationViewState {
  accountScopeKey: string;
  rootCanonicalUri: string;
  projectionRevision: number;
  mode: 'structural' | 'chronological';
  focusedCanonicalUri?: string;
  expandedBranchUris: readonly string[];
  collapsedBranchUris: readonly string[];
  lastSeenCanonicalUri?: string;
  lastSeenAt?: string;
  newestSeenReplyObservedAt?: string;
  semanticAnchor?: ConversationSemanticAnchor;
  updatedAt: string;
}
```

Requirements:

- bounded arrays and record counts;
- canonical URI alias migration;
- account/instance isolation and cross-account IDOR tests;
- expiry and retention policy;
- logout/account-removal purge;
- multi-tab coordination and generation fencing;
- corruption validation and self-healing;
- no reply bodies, draft text, tokens, or sensitive relationship data in diagnostics.

### Unread semantics

Unread state is branch-aware but does not create a second notification authority.

Mangane may show:

- "3 new replies in Alice's branch";
- "Continue where you left off";
- "New branch since your last visit."

A reply is not marked read by prefetch, background hydration, branch-summary calculation, or offscreen rendering. Meaningful foreground presentation follows the same visibility and receipt principles used by other Mangane reading-state phases.

## Moderation, privacy, and visibility

Moderation is applied before projection and summary generation.

Required order:

1. validate source/provenance;
2. reconcile origin public fields and connected viewer state;
3. enforce authorization and visibility;
4. apply blocks, mutes, domain policy, filters, conversation controls, and content warnings;
5. derive branch counts, avatars, previews, labels, unread totals, and summaries;
6. render.

A collapsed branch must not expose a blocked or inaccessible account through:

- avatar stacks;
- participant counts that imply identity where policy forbids it;
- preview content;
- alt text or accessible labels;
- branch names;
- unread indicators;
- hidden DOM or data attributes;
- analytics or diagnostics.

Where policy permits, the UI may state a bounded generic fact such as "2 replies hidden by your filters" without exposing actor identity or content.

Private and direct conversations never use unauthenticated origin retrieval. Their graph is built only from viewer-authorized connected/local observations.

## Missing, deleted, and incomplete context

Every unavailable link receives an explicit typed presentation:

- deleted/tombstoned;
- filtered by viewer policy;
- inaccessible/unauthorized;
- unavailable/not found;
- network-degraded;
- malformed/conflicting;
- cyclic;
- depth-truncated;
- unresolved origin alias.

The UI must not collapse distinct outcomes into "deleted" or silently remove a node that changes conversational meaning.

The origin remains the default public authority, but no server is guaranteed to possess a mathematically complete Fediverse-wide graph. Product copy must avoid "all replies" or "complete conversation" unless a future protocol can prove that claim.

## Pending replies and live updates

A locally pending reply appears in the correct branch through a temporary local canonical identity and optimistic edge.

On confirmation:

- migrate temporary identity to canonical URI transactionally;
- preserve branch expansion, focus, anchor, and unread state;
- deduplicate streaming/pagination echoes;
- reconcile server-adjusted parent identity;
- surface typed conflict if the confirmed parent differs unexpectedly.

Incoming replies while reading must not jump the focused post. They update branch summaries or insert in place according to semantic-anchor compensation. The user receives a non-disruptive new-replies affordance when appropriate.

## Framework7 and responsive presentation

### Phone

- root/focused content in the main page;
- branches as vertically nested sections with bounded indentation;
- deeper levels flatten visually after a small depth while retaining textual parent cues;
- branch overview in a Framework7 sheet or page;
- no horizontal-only tree navigation;
- 44x44 minimum interactive targets and safe-area handling.

### Tablet

- main conversation plus optional branch index panel;
- selected branch can remain visible while navigating summaries;
- orientation changes preserve semantic anchor and focus.

### Desktop

- main selected path/branch in the reading column;
- optional conversation overview in the secondary panel;
- keyboard navigation across visible posts and branch controls;
- no dependence on hover.

### Motion

Expansion, focused-path transitions, and panel movement use restrained spatial continuity. Reduced-motion mode removes nonessential animation and uses immediate or minimal transitions without losing focus context.

## Accessibility contract

Do not force the whole conversation into ARIA `tree` semantics.

Use:

- a named conversation region;
- sections for branches;
- headings or labelled branch starters;
- real buttons for expand/collapse with `aria-expanded` and `aria-controls` where stable;
- explicit text for reply relationships;
- semantic lists only where list semantics remain truthful;
- live announcements only for meaningful user-triggered or foreground updates;
- deterministic focus restoration after expansion, collapse, refresh, mode switch, and branch navigation;
- hidden descendants removed from focus and accessibility traversal;
- keyboard shortcuts as optional accelerators, never the only operation path;
- forced-colors, high contrast, RTL, localization, zoom, reflow, and 320 CSS-pixel acceptance tests.

Example accessible label:

```text
Reply by Bob to Alice, branch level 2, 3 replies, collapsed.
```

The label is derived after moderation and must not announce unavailable identities.

## Performance and bounded rendering

Required budgets and techniques:

- graph construction linear or near-linear in accepted nodes/edges;
- no repeated full-array parent search inside descendant loops;
- indexed maps for canonical URI and parent/child lookup;
- structural sharing or memoized projections by graph revision;
- branch-level lazy rendering;
- virtualization that preserves focused-path and semantic-anchor correctness;
- bounded preview extraction and participant lists;
- no unbounded `Expand all`;
- cancellation and stale-generation rejection;
- memory-pressure degradation to focused path plus summaries;
- measured phone, tablet, and desktop fixtures including hundreds of replies, deep chains, wide branching, media, content warnings, missing nodes, and rapid live updates.

Performance optimization must never discard canonical reply edges or moderation truth. Presentation windows are rebuildable projections.

## Failure and degraded behavior

When origin access fails, Mangane renders the latest verified local/connected graph and records the typed degraded state internally.

When connected viewer context fails but a public origin graph is available, Mangane must not assume viewer action permissions or expose content that requires connected authorization.

When local graph construction fails validation:

- keep the focused canonical status readable where authorized;
- fall back to the existing flat compatibility thread projection behind the phase flag;
- emit content-free diagnostics;
- offer bounded retry/rebuild;
- never clear canonical statuses or viewer state as a repair shortcut.

## Feature flags and rollback

Use owned, registered flags with removal criteria, for example:

```text
conversation.originAuthoritativeGraph
conversation.branchProjection
conversation.focusedPath
conversation.branchReadingState
```

Flags may be consolidated if the registry requires fewer rollout surfaces, but ownership and rollback must remain explicit.

Rollback:

- disables graph/branch projections and restores the inherited flat thread presentation;
- keeps Phase 8A origin reconciliation active independently;
- keeps the Context Recovery Coordinator active independently;
- preserves canonical statuses, edges, aliases, tombstones, viewer state, and pending replies;
- ignores or purges optional conversation view-state records according to retention policy;
- introduces no reverse data migration for canonical social data.

## Implementation slices

### 9.0 — Repository and authority reconciliation

- inventory current thread components, selectors, reducers, context actions, pagination, recovery coordinator, origin authority, status renderer, virtualization, compose integration, and styles;
- inspect every active branch and open PR for newer conversation work before implementation;
- record exact ownership and collision map;
- add representative protocol fixtures for Mastodon, Akkoma, Pleroma, Mitra, Misskey-compatible federation, missing ancestors, private context, and origin/connected divergence;
- establish phase flags and rollback owner;
- do not change runtime behavior.

Exit gate: one reviewed authority map; no duplicate conversation fetcher, store, or renderer proposed.

### 9.1 — Canonical reply-edge and graph contracts

- define immutable graph, node, edge observation, provenance, completeness, conflict, and diagnostic types;
- adapt existing context relationships and canonical URI aliases into the graph builder;
- add cycle, duplicate, conflict, depth, node, edge, byte, and time bounds;
- preserve typed Context Recovery Coordinator outcomes;
- add property and adversarial tests.

Exit gate: deterministic graph output for identical observations regardless of ingestion order; no status mutation.

### 9.2 — Origin-first conversation query coordination

- compose Phase 8A public origin observation, connected viewer context, cached canonical state, and recovery coordinator through application queries;
- do not introduce new transport clients or scheduler ownership;
- merge by field authority and provenance;
- support cancellation, validators, backoff, circuit breakers, stale-generation fencing, offline use, and typed degraded outcomes;
- verify private/direct context never uses unauthenticated origin fetch.

Exit gate: origin public context is attempted by default where allowed; connected viewer authority remains intact; no token reaches origin.

### 9.3 — Structural and chronological projections

- derive root-author continuation, direct branches, nested branches, focused path, missing placeholders, and strict chronological projection;
- define deterministic sibling ordering and tie-breaking;
- keep projection rebuildable and independent of raw payloads;
- test edits, deletes, alias changes, account moves, conflicts, pending replies, and pagination.

Exit gate: complex fixtures preserve exact parentage and offer both structural and chronological inspection.

### 9.4 — Adaptive branch policy and summaries

- implement versioned deterministic expansion policy;
- create moderation-safe summaries, counts, avatars, previews, unread cues, and root-author participation indicators;
- preserve manual state;
- lazy render large branches;
- add small, deep, wide, media-heavy, filtered, and adversarial fixtures.

Exit gate: summaries leak no hidden identity/content and remain stable across refresh and count changes.

### 9.5 — Focused-path and branch navigation

- expand and anchor the root-to-selected path;
- add breadcrumb/equivalent navigation and large-thread overview;
- integrate browser back/forward and Framework7 page/sheet behavior without a second router;
- preserve focus and semantic position when selecting branches or switching modes;
- add keyboard, touch, screen-reader, and switch-control tests.

Exit gate: a deep-linked reply is understandable immediately and navigation never strands focus.

### 9.6 — Durable conversation reading state

- add account-scoped bounded persistence for mode, branch state, last seen, unread, focused item, and semantic anchor;
- implement alias migration, expiry, purge, corruption repair, multi-tab ownership, and generation fencing;
- ensure prefetch/offscreen rendering cannot mark read;
- integrate without duplicating notification state.

Exit gate: reload, PWA relaunch, account switch, logout, alias migration, and concurrent-tab tests pass without cross-account leakage.

### 9.7 — Live updates, optimistic replies, and virtualization

- place pending and confirmed replies in the correct branch;
- reconcile pagination, stream, hydration, and retry echoes idempotently;
- compensate semantic anchors for above-viewport changes;
- add non-disruptive new-reply affordances;
- validate large-thread virtualization and memory-pressure degradation.

Exit gate: replies arriving during reading do not jump the user or duplicate nodes.

### 9.8 — Framework7 adaptive migration and accessibility completion

- ship phone, tablet, and desktop branch surfaces through canonical controls and semantic icons;
- complete reduced-motion, forced-colors, high-contrast, RTL, localization, zoom, reflow, target-size, and focus tests;
- add deterministic cross-engine visual and accessibility baselines;
- retain flat-thread rollback until parity is proven.

Exit gate: all supported layouts and input/assistive modes pass acceptance criteria.

### 9.9 — Hardening, repair, rollout, and closure

- run fuzz/property tests for malformed graphs and hostile payloads;
- benchmark graph build, projection, hydration, rendering, memory, and live updates;
- verify origin/connected outages, rate limits, CORS failure, offline, corruption, tombstones, moderation changes, account transitions, purge, and rollback;
- document operations, diagnostics, flags, migration, rollback, and removal plan;
- update roadmap status only after code and tests merge.

Exit gate: no known correctness, privacy, security, accessibility, or performance blocker remains.

## Required test matrix

### Graph correctness

- direct reply, nested reply, deep chain, wide branch, multiple roots rejected;
- duplicate deliveries and aliases;
- conflicting parents;
- cycles and self-parent attacks;
- missing, deleted, filtered, unauthorized, malformed, and depth-truncated nodes;
- root-author continuation and ordinary same-author replies;
- deterministic ingestion-order independence.

### Authority and federation

- origin newer than connected copy;
- connected viewer state newer than origin public state;
- origin omits fields without clearing connected values;
- origin context plus connected private context union;
- CORS blocked origin fallback;
- rate limit, timeout, malformed content type, redirect mismatch, object-ID mismatch, and offline cache;
- private/direct conversations never fetched anonymously from origin;
- connected credentials never sent cross-origin.

### Moderation and privacy

- blocked/muted/domain-filtered participants absent from summaries and accessible labels;
- hidden count policy;
- content warning and sensitive media behavior;
- account switch, logout, purge, stale responses, multi-tab, and cross-account IDOR attempts;
- diagnostics contain no status body, canonical URI, actor ID, token, or private relationship details.

### Interaction and accessibility

- expand/collapse, focused path, overview, chronology switch, browser history, refresh, and deep link;
- keyboard-only and touch alternatives;
- screen-reader labels and focus restoration;
- reduced motion, forced colors, high contrast, RTL, long localization, 200 percent zoom, and narrow reflow;
- hidden descendants removed from tab and accessibility order.

### Performance and resilience

- hundreds of replies;
- deep and wide graphs;
- rapid stream updates;
- media layout shifts;
- memory pressure;
- interrupted persistence migration;
- corrupted view state self-healing;
- origin and connected-server partial failure;
- rollback to flat thread.

## Completion criteria

Phase 9 is complete only when:

- the origin server is the default preferred public conversation authority through Phase 8A, not a manual user action;
- connected viewer authorization, moderation, local IDs, and action state remain authoritative;
- one immutable canonical conversation graph replaces flat-only presentation logic without replacing canonical status/context authorities;
- structural, focused-path, and chronological views all preserve protocol truth;
- adaptive branch summaries are deterministic, bounded, moderation-safe, and user-overridable;
- missing and incomplete context is explicit and honest;
- branch reading/unread state is account-scoped, durable, purgeable, and IDOR-tested;
- pending replies, pagination, streams, hydration, retries, aliases, deletes, edits, and moderation changes converge deterministically;
- phone, tablet, desktop, keyboard, touch, screen reader, reduced motion, forced colors, RTL, localization, zoom, and reflow acceptance tests pass;
- large-thread performance budgets pass on representative mid-range mobile hardware;
- no second origin resolver, context coordinator, status store, reply store, moderation path, renderer, router, pagination system, or AI dependency exists;
- rollback to the inherited flat conversation view is tested and documented;
- canonical documentation, ADRs, registry, implementation evidence, CI, and review state are reconciled before merge.

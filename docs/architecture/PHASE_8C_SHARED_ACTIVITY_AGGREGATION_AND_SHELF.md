# Phase 8C — Shared Activity Aggregation and Shared Shelf

Status: **Accepted target / queued**

Last updated: 2026-07-29

## Purpose

Phase 8C defines Mangane's client-side handling of repeated ActivityPub shares and high-density shared-content runs. It combines an improved emulation of Phanpy's Boost Carousel with a stricter event-preserving deduplication and resurfacing architecture.

The product-facing terminology is **Share** and **Shared**. Protocol and adapter boundaries continue to use their native terms where correctness requires them, including Mastodon-compatible `reblog`, ActivityPub `Announce`, and backend-specific request or response fields. Presentation code must not leak those backend terms to users.

This phase is separate from:

- Phase 5 canonical storage and timeline membership;
- Phase 5E timeline position continuity;
- Phase 6 synchronization and exact event idempotency;
- Phase 8 Home and For You source contracts and renderer migration;
- Phase 8A origin-authority reconciliation;
- Phase 8B entity resolution and creator attribution;
- Phase 19 personalization and general repetition controls;
- Phase 23 notification grouping.

It depends on the stable Phase 5–8 boundaries rather than creating a second timeline, status store, pagination model, moderation path, or renderer.

## Product outcomes

Mangane should:

1. never render duplicate copies caused by repeated delivery, overlapping pagination, streaming reconciliation, or cache hydration;
2. preserve every legitimate distinct share event internally;
3. group multiple people sharing the same canonical post into one presentation object;
4. retain useful social context such as who shared the post and how many distinct eligible people shared it;
5. prevent many distinct shared posts from displacing original posts vertically by using an adaptive Shared Shelf;
6. avoid continuously moving an already-visible card when another person shares it;
7. allow a previously seen post to resurface only when time or materially new activity justifies another presentation;
8. preserve strict chronology where the surface or user-selected mode requires it;
9. keep pagination, restoration, moderation, visibility, deletion, and account isolation correct when presentation items are grouped;
10. use Share/Shared consistently throughout user-facing copy, accessibility labels, notifications, settings, menus, and documentation without renaming protocol contracts incorrectly.

## Terminology contract

### User-facing language

Use:

- Share
- Shared
- Shared by Alice
- Shared by Alice, Bob, and 4 others
- Undo share
- Hide shares from this account
- Shared posts
- Shared Shelf

Do not expose these legacy or backend-specific terms in migrated presentation surfaces:

- Boost / Boosted
- Reblog / Reblogged
- Retoot / Retweeted
- Announce

### Internal and protocol language

Keep native identifiers where they are part of an API, wire contract, persisted migration, compatibility adapter, or upstream type:

- `reblog`
- `reblogs`
- `reblogged`
- `show_reblogs`
- `exclude_reblogs`
- ActivityPub `Announce`
- backend endpoint names and capability fields

Do not perform a repository-wide blind symbol replacement. The terminology migration must classify each occurrence as one of:

1. user-visible copy to replace;
2. accessibility text to replace;
3. documentation/product terminology to replace;
4. CSS/test fixture names that may be migrated with compatibility aliases;
5. internal domain terminology eligible for a deliberate rename;
6. protocol/API terminology that must remain unchanged;
7. historical evidence that must remain unchanged and visibly classified as historical.

A generated, shrinking terminology inventory must prevent new user-facing Boost/Reblog wording while allowing explicitly classified protocol and historical references.

## Architecture overview

```text
remote page / stream / hydration / replay
                  |
                  v
      validate and normalize event
                  |
                  v
 exact event idempotency by event identity
                  |
                  v
 visibility, moderation, mute, and filter policy
                  |
                  v
 canonical original-object resolution
                  |
                  v
 same-object share aggregation
                  |
                  v
 distinct display items in server-relative order
                  |
                  v
 Shared Shelf density and surface policy
                  |
                  v
 adaptive resurfacing and stable presentation
```

The phase distinguishes three identities:

- **event identity:** one original status event or one person's share wrapper/action;
- **content identity:** the canonical original post being displayed;
- **presentation identity:** the current inline card, aggregated share card, or shelf item shown to the viewer.

These identities must never be collapsed into one database key.

## Canonical keys

### Event key

The event key identifies one delivered timeline event and is used for exact idempotency.

Preferred sources:

1. canonical ActivityPub activity URI when available and authenticated;
2. adapter-scoped server event/status ID;
3. connected account plus backend plus event ID fallback.

The key must include account and adapter scope wherever an identifier is not globally canonical.

### Content key

The content key identifies the original post referenced by an original event or share event.

Resolution order:

1. validated canonical ActivityPub object URI;
2. validated origin URL or normalized authoritative URI;
3. protocol plus origin host plus origin object ID;
4. connected instance plus local API status ID as a bounded fallback.

Text, rendered HTML, media hashes, timestamps, or author-plus-content hashes must not be primary identity because separate posts may contain identical content and edits may change content without changing object identity.

Phase 8A may improve canonical origin resolution. Phase 8C consumes that authority and must not create a competing canonicalization system.

### Presentation key

A presentation key is derived from:

- account scope;
- feed identity;
- content key;
- presentation generation or resurfacing epoch;
- presentation mode.

It exists to preserve stable React keys, virtualization measurements, focus, and Phase 5E anchors while permitting a later justified resurfacing of the same content as a new presentation event.

## Data contracts

```ts
interface SharedTimelineEvent {
  accountScope: string;
  feedId: string;
  eventKey: string;
  contentKey: string;
  kind: 'original' | 'share';
  actorId: string;
  serverOrderKey: string;
  occurredAt: number | null;
  receivedAt: number;
  source: 'pagination' | 'streaming' | 'hydration' | 'backfill' | 'replay';
  statusId: string;
}

interface SharedContentGroup {
  accountScope: string;
  feedId: string;
  contentKey: string;
  originalStatusId: string;
  originalEventKey?: string;
  shareEventKeys: string[];
  eligibleSharerIds: string[];
  firstServerOrderKey: string;
  latestServerOrderKey: string;
  firstSeenAt: number;
  lastActivityAt: number;
  moderationRevision: string;
}

interface SharedPresentationRecord {
  accountScope: string;
  feedId: string;
  contentKey: string;
  generation: number;
  firstPresentedAt: number;
  lastPresentedAt: number;
  lastMeaningfulActivityAt: number;
  impressionState: 'not-presented' | 'presented' | 'meaningfully-viewed';
  expanded: boolean;
  dismissed: boolean;
  latestKnownShareCount: number;
  policyRevision: string;
}
```

The final implementation may adapt field names to established Phase 5 and Phase 7 domain contracts. It must not introduce parallel raw-status persistence.

## Processing rules

### 1. Validate and normalize

Every incoming status or timeline event must pass the existing protocol adapter, input validation, visibility normalization, and projection boundaries. Presentation code may not parse raw Mastodon, Akkoma, Pleroma, or ActivityPub payloads.

Malformed identifiers, impossible timestamps, oversized arrays, unknown event kinds, and scope mismatches fail closed or degrade to an ungrouped safe representation. They must not produce cross-account keys.

### 2. Exact event idempotency

Exact duplicate event delivery is suppressed by event key before presentation grouping.

This covers:

- overlapping timeline pages;
- streaming events later repeated in pagination;
- hydration followed by remote refresh;
- reconnect replay;
- retry delivery;
- multi-tab ingestion races;
- future Durable Streams replay.

An event-idempotency hit must not increment share counts or create a second actor attribution.

### 3. Apply safety policy before attribution

Before an actor or post is included in a share group, apply:

- visibility and audience authorization;
- blocks and domain blocks;
- account mutes;
- per-follow share/reblog suppression;
- keyword and content filters;
- hidden or deleted status state;
- backend policy and local moderation decisions.

A blocked, muted, filtered, or unauthorized actor must not leak through names, counts, avatars, accessible labels, off-screen shelf content, analytics, or cached attribution.

Where policy changes after grouping, recompute the safe projection from preserved events rather than mutating counts heuristically.

### 4. Aggregate by canonical content object

All eligible share events referencing the same content key form one `SharedContentGroup`.

The group preserves:

- every distinct event key;
- every distinct eligible sharer;
- earliest and latest server order positions;
- original status identity;
- source provenance;
- undo/delete relationships;
- enough information to repair after policy or canonical-key changes.

The group does not merge distinct original posts with matching text or URLs merely because they look similar.

### 5. Choose representative attribution

The visible attribution should prefer, in order:

1. an explicitly prioritized or favorited relationship when such a user-controlled signal exists;
2. a close/high-interaction followed account using local, explainable signals;
3. the most recent eligible sharer;
4. the first eligible share in server order as a stable fallback.

The initial Phase 8C slice may use deterministic recency/server order only. It must preserve the contract so later Phase 19 personalization can improve representative choice without replacing aggregation.

Display at most a small bounded number of names and avatars, followed by an aggregate count. The complete eligible actor list may be available in an accessible detail sheet with virtualization and bounded loading.

### 6. Preserve server-relative order

Grouping changes presentation density, not the underlying source order.

The group's initial position derives from the earliest qualifying event in the current presentation window unless the selected surface explicitly uses latest-share ordering. Additional shares update attribution in place and must not continuously move a visible group to the top.

The server cursor and timeline membership remain based on source events. A grouped presentation ID must never be used as a backend pagination cursor.

## Improved Phanpy-inspired Shared Shelf

### Purpose

The Shared Shelf compresses a run or high density of **distinct shared content objects** into one bounded presentation unit. It is not the same-object deduplication mechanism.

Input example:

```text
Alice shared X
Bob shared X
Carol shared Y
Diego shared Z
Erin shared X
Fatima shared Q
```

After same-object aggregation, the shelf receives four items:

```text
X — shared by Alice, Bob, and Erin
Y — shared by Carol
Z — shared by Diego
Q — shared by Fatima
```

It must never receive six independent slides for the raw events above.

### Shelf eligibility

A shelf is considered only when all conditions hold:

- the surface permits editorial grouping;
- at least three distinct eligible shared-content groups exist in the rolling window;
- the fetched/rolling window is large enough to avoid unstable decisions;
- the transformation does not cross a hard chronological or semantic boundary;
- no selected accessibility or user preference disables the shelf.

The initial policy should use a versioned combination of:

- ratio of distinct shared groups to total display groups;
- longest consecutive run of shared groups;
- projected vertical height occupied by shares;
- current column width and interaction modality;
- content-warning/filtered-item treatment;
- whether the window spans a pagination boundary.

Phanpy-like initial reference thresholds may be evaluated, not copied as immutable product policy:

- more than one quarter shared content in a sufficiently large window; or
- at least three consecutive shared items;
- move the shelf after originals when shares overwhelmingly dominate the window.

Thresholds must be measured against grouped content objects, not raw share events.

### Rolling-window behavior

Shelf decisions must not depend solely on one network page. A bounded rolling presentation window may include the tail of the previous page and head of the next page.

Requirements:

- source cursors remain untouched;
- no event is fetched repeatedly to fill an unbounded shelf;
- page fill uses a strict request and item budget;
- a viral single object does not cause an infinite fetch loop;
- window recomputation preserves already-presented keys and scroll anchors;
- offline hydration reproduces the same result for the same policy revision and records.

### Responsive presentation

#### Phone and narrow columns

Use a horizontally scrollable, snap-aligned Shared Shelf when it improves vertical density.

Requirements:

- one full card plus a partial next-card affordance where space allows;
- explicit item count;
- previous/next controls where pointer or keyboard use requires them;
- no trapping of vertical scroll gestures;
- reduced-motion behavior;
- keyboard and screen-reader access to every item;
- stable focus when items update or disappear;
- no reliance on swipe alone.

#### Tablet and desktop

Do not assume a horizontal carousel is always best. Depending on actual column width, use one of:

- horizontal shelf with explicit controls;
- compact two-column shelf;
- expandable vertical shared-content stack;
- one-card pager in narrow secondary columns.

The decision must use content-column width, not total viewport width. Automated tests must cover multi-column layouts, browser zoom, reflow, RTL, and forced colors.

### Insertion policy

The shelf should retain the approximate position of the grouped events without pretending strict chronology.

Default behavior:

- mixed original/shared windows: insert near the median position of the grouped shared events while preserving original-post order;
- share-dominated windows: place original posts first and then the shelf, with a visible Shared heading;
- consecutive share runs: replace the run in place;
- strict chronology mode: disable shelf transformation and render distinct grouped share cards inline.

The insertion algorithm and policy revision must be deterministic and testable.

## Adaptive resurfacing

A content object that has already been presented should not automatically produce a new card for every later share.

### In-place updates

While the existing card or shelf item remains in the active presentation window:

- add newly eligible sharers;
- update bounded attribution and count;
- update a quiet activity indicator if useful;
- do not jump the item to the top;
- preserve focus and measurements;
- announce changes only when useful and not excessively noisy.

### Resurfacing eligibility

A new presentation generation may be created only when a versioned deterministic policy determines that renewed value exceeds repetition cost.

Signals may include:

- wall-clock time since last presentation;
- whether the user meaningfully viewed or expanded the post;
- explicit dismissal;
- number and velocity of new distinct eligible shares;
- a newly sharing prioritized account;
- material edit or corrected origin state;
- substantial new reply activity;
- renewed relevance supplied by an explicit feed rule;
- current surface and user-selected presentation mode.

Initial conservative defaults for evaluation:

- hard no-resurface interval of approximately 15–30 minutes;
- strong grouping for approximately 4–8 hours;
- conditional resurfacing thereafter when meaningful new signals exist;
- ordinary eligibility after approximately 24 hours;
- no ordinary resurfacing after explicit dismissal unless material content or authorization state changes.

These are evaluation starting points, not hardcoded universal truth. Policy revisions must be migration-safe and observable through content-free diagnostics.

### No opaque AI requirement

The baseline resurfacing policy must be local, deterministic, inspectable, and testable. Phase 19 may provide user-controlled personalization signals, but Phase 8C must remain coherent when personalization and intelligence are disabled.

## Surface policy

### Enabled by default or eligible

- Home;
- For You;
- pinned Custom Feeds that reuse the Phase 8 renderer;
- optional calm/catch-up presentation modes;
- selected list timelines after evaluation.

### Normally disabled

- account profile activity histories;
- the user's own share history;
- bookmarks and favourites;
- search result ordering;
- moderation and audit surfaces;
- notifications;
- media-only timelines;
- explicit strict chronology mode.

Same-object event aggregation may still operate internally on these surfaces where safe, but shelf transformation and adaptive resurfacing must follow the surface contract.

## User controls

Provide understandable product-level choices rather than exposing raw thresholds.

### Shared-post presentation

- **Balanced:** aggregate repeated shares and use a shelf when shared posts would dominate;
- **Chronological:** aggregate exact duplicate deliveries but keep distinct shared-content groups inline in server-relative order;
- **Compact:** prefer a shelf or collapsed stack for shared content;
- **Hidden:** hide shares where capability and local policy permit.

### Resurfacing controls

Optional controls may include:

- show again when many more people share it;
- show again when a prioritized person shares it;
- show again when discussion becomes active;
- never show the same post again automatically.

Defaults and labels require usability and accessibility evaluation. Account-specific hide-shares settings remain distinct from global presentation mode.

## Pagination and fill contract

Client grouping occurs after a page is received, but source pagination remains event-based.

The loader must:

1. consume official adapter cursor or `Link` metadata;
2. persist every accepted event and source membership before presentation grouping;
3. group after validation and policy filtering;
4. fetch another bounded page only when too few display groups remain;
5. stop at strict request, event, byte, and time budgets;
6. return honest partial state when the budget is exhausted;
7. retain the latest consumed source cursor even when many events collapse;
8. never derive cursors from original-content IDs or shelf positions.

Tests must cover pages containing mostly one viral object, mostly distinct shares, deletions between pages, overlapping cursors, backwards pagination, and offline continuation.

## Streaming and multi-source reconciliation

Streaming events should enter a staged new-item queue rather than immediately reshuffling the viewport.

Requirements:

- exact event-key deduplication before grouping;
- group staged shares by content key;
- show an honest new-item count;
- merge when the user requests or reaches the top;
- reconcile staged events against later pagination and hydration;
- fence stale account generations and disconnected streams;
- use the existing multi-tab ingestion/lease authority;
- support future Durable Streams replay without changing presentation identity rules.

## Undo, deletion, edit, and canonical-key changes

### Undo share

An undo removes only the matching actor/event relationship.

- remove that event from the group;
- recompute eligible sharers and attribution;
- retain the group if another qualifying event or original membership remains;
- remove or replace the presentation only when no qualifying source event remains;
- preserve focus and anchor recovery when the visible item disappears.

### Original deletion or loss of authorization

- remove or tombstone every presentation of that content;
- do not retain stale preview content in a shelf cache;
- retain bounded tombstone identity to prevent resurrection from stale hydration or replay;
- do not disclose whether a now-inaccessible post still exists remotely.

### Edit

An edit updates the canonical content record rather than creating another share group. A material edit may contribute to resurfacing eligibility, but must not bypass moderation or audience checks.

### Canonical-key upgrade or merge

When Phase 8A resolves a stronger canonical URI or detects aliases:

- migrate group and presentation references transactionally;
- merge event sets with exact deduplication;
- preserve the earliest source order and latest activity metadata according to documented rules;
- update Phase 5E anchors through alias mapping;
- keep a bounded tombstone/alias so stale records cannot recreate the old group;
- provide repair after interrupted migration.

## Storage, retention, and privacy

- all state is account scoped;
- feed-specific presentation state must not leak between Home, For You, lists, or Custom Feeds unless an explicit shared-seen policy is approved;
- booster/sharer arrays are bounded and normalized;
- old event detail may be compacted only after undo, reconciliation, and repair requirements permit it;
- presentation records use TTL/LRU bounds consistent with Phase 5 quota policy;
- no raw HTML or protocol payload is stored by this phase;
- no social-graph or interaction telemetry leaves the device by default;
- diagnostics expose counts, timings, policy revisions, and error classes, not actor IDs, content, URLs, or account identifiers;
- account purge removes events, groups, shelf state, resurfacing state, aliases, and diagnostics for that account.

## Failure and degraded behavior

Fail safely to the simplest correct presentation:

- canonical-key failure: use adapter-scoped fallback and avoid unsafe cross-origin merging;
- storage unavailable: perform bounded in-memory exact deduplication for the current session;
- policy evaluation failure: omit uncertain attribution and render the post safely inline;
- shelf-layout failure: render grouped shared posts vertically;
- resurfacing-state corruption: suppress aggressive resurfacing and rebuild bounded state;
- origin authority unavailable: use connected-server identity and freshness;
- missing actor details: show a count without guessing names;
- partial page-fill budget exhaustion: show available items with normal continuation.

The feature must not make the timeline unavailable merely because grouping or shelf presentation failed.

## Accessibility requirements

- the shelf has a programmatic heading and item count;
- every item has a stable accessible name that uses Shared terminology;
- actor attribution is concise and not repeated excessively;
- hidden off-screen items remain navigable without exposing filtered content;
- keyboard users can enter, traverse, activate, and leave the shelf predictably;
- focus remains valid after undo, deletion, filtering, canonical merge, or page recomputation;
- horizontal movement has visible controls and is not swipe-only;
- reduced motion removes inertial or animated repositioning;
- screen-reader announcements for new shares are rate limited and user meaningful;
- RTL behavior, 200%/400% zoom, forced colors, text scaling, and narrow reflow pass automated and manual testing;
- strict chronology remains available where the shelf impairs comprehension.

## Performance requirements

- aggregation is linear or near-linear in the bounded processing window;
- canonical and event maps have explicit maximum sizes and eviction rules;
- no unbounded actor arrays, DOM nodes, requests, retries, or observers;
- shelf cards reuse the canonical Phase 8 status/media renderer rather than duplicating rich-content rendering;
- expensive canonical resolution and policy recomputation occur off the critical render path where possible;
- virtualization measurements are stable across attribution-count changes;
- target-device benchmarks cover low-memory mobile, long sessions, viral share storms, and multi-column desktop;
- performance failure degrades to grouped inline cards rather than dropping content.

## Security and adversarial requirements

Tests must include:

- cross-account event, group, presentation, and seen-state IDOR attempts;
- maliciously colliding local IDs from different instances;
- forged canonical URLs and unsafe schemes;
- Unicode/IDNA host confusion;
- blocked or muted actor attribution leakage;
- unauthorized/private post existence leakage;
- stale stream events after logout or account switch;
- replay storms and duplicate event IDs;
- one actor producing many malformed share wrappers;
- huge sharer lists and oversized API pages;
- canonical-key merge cycles;
- undo arriving before share;
- deletion followed by stale hydration;
- hostile timestamps and order keys;
- pagination loops and repeated cursors;
- cache poisoning across feeds or accounts;
- shelf accessibility labels containing hidden content;
- blind terminology replacement breaking protocol requests or persisted data.

## Feature flags and rollback

Use separately owned flags for:

1. same-object share aggregation;
2. Shared Shelf presentation;
3. adaptive resurfacing;
4. user-facing Share terminology migration where staged compatibility is required.

Rollback order:

- disable adaptive resurfacing;
- disable shelf and render grouped share cards inline;
- disable same-object presentation aggregation while preserving exact event idempotency;
- retain protocol adapters, canonical data, and source membership;
- revert user-facing terminology only if a critical localization or compatibility defect requires it, without renaming wire fields.

Disabling Phase 8C must not delete source timeline events or invalidate Phase 5 timeline membership.

## Implementation slices

### Slice 8C-0 — Inventory and terminology authority

- enumerate current boost/reblog/share code, copy, accessibility labels, localization keys, tests, styles, settings, notifications, analytics, documentation, and API fields;
- classify every occurrence using the terminology contract;
- add a generated shrinking user-facing legacy-term baseline;
- prove protocol and historical allowlists are exact and fail closed;
- identify current server-side deduplication differences across supported backends;
- record existing timeline grouping, cursor, streaming, and renderer ownership.

Exit gate: no runtime rename or grouping work begins from an incomplete occurrence or ownership inventory.

### Slice 8C-1 — Event and content identity foundation

- add feed-neutral event/content/presentation identity contracts through Phase 5/7 authorities;
- implement exact event idempotency across page, stream, hydration, and replay paths;
- add canonical-content-key resolution using Phase 8A authority and safe fallback;
- add migrations, alias repair, bounded retention, and account purge;
- test cross-account, collision, malformed, and canonical-upgrade cases.

Exit gate: duplicate delivery cannot create duplicate events or counts, and legitimate shares by different actors remain distinct internally.

### Slice 8C-2 — Same-object share aggregation

- build deterministic groups after safety policy;
- preserve all eligible distinct events and actor attribution;
- implement undo, deletion, edit, policy revision, and canonical merge behavior;
- expose a presentation projection with no raw payload access;
- render grouped shared cards inline behind a flag.

Exit gate: repeated shares of one original become one stable card with accurate safe attribution and reversible event state.

### Slice 8C-3 — Shared terminology migration

- replace user-facing Boost/Boosted/Reblog wording with Share/Shared across migrated and legacy-compatible UI;
- update localization keys with compatibility aliases or migration tooling where necessary;
- update accessibility labels, menus, confirmations, settings, empty states, help text, and tests;
- preserve API field names and adapter contracts;
- add screenshot, localization, and semantic-query tests;
- shrink the legacy-term baseline to protocol/historical exceptions only.

Exit gate: users do not encounter Boosted terminology in active product surfaces, and all supported share actions still call the correct backend contract.

### Slice 8C-4 — Shared Shelf

- add rolling-window density evaluation over grouped distinct content;
- implement phone/narrow-column shelf and desktop/tablet adaptive alternatives;
- preserve source cursors, approximate chronology, virtualization, and anchors;
- implement strict-chronology fallback and user settings;
- test pagination boundaries, page fill budgets, RTL, zoom, reduced motion, keyboard, screen readers, and multi-column widths.

Exit gate: share-heavy feeds use less vertical space without hiding inaccessible content, breaking navigation, or corrupting pagination.

### Slice 8C-5 — Adaptive resurfacing

- persist bounded presentation/impression state;
- implement conservative deterministic resurfacing policy;
- update active items in place;
- add meaningful-view, dismissal, reply-growth, material-edit, and prioritized-sharer signals where authorities exist;
- integrate optional Phase 19 signals without requiring them;
- add explanation strings for why an item returned where appropriate.

Exit gate: renewed activity can reintroduce useful content without producing repetitive or unstable timelines.

### Slice 8C-6 — Hardening, evaluation, and rollout

- run representative Mastodon, Akkoma, Pleroma, slow-feed, high-volume, offline, multi-account, and viral-event fixtures;
- compare chronological, Phanpy-like, grouped-inline, and adaptive-shelf modes;
- measure unique original-post visibility, repeated-content impressions, scroll depth, missed shared content, latency, memory, and accessibility outcomes;
- verify migration, rollback, repair, purge, corruption, and policy revisions;
- remove temporary compatibility paths only after equivalence evidence.

Exit gate: all completion criteria below pass in CI and documented target-device evaluation.

## Evaluation metrics

Use privacy-preserving local fixtures and opt-in research where approved. Do not introduce production telemetry by default.

Measure:

- exact duplicate event rate after reconciliation;
- number of raw share events per grouped content object;
- vertical viewport space consumed by shares;
- number of original posts displaced per 100 source events;
- repeat impressions of the same content object;
- percentage of shelf items reached by touch, pointer, keyboard, and assistive technology testing;
- page-fill request amplification;
- grouping and recomputation latency;
- memory per 1,000 events;
- anchor/focus failures;
- undo/delete/canonical-merge repair correctness;
- false merges and missed merges;
- user comprehension of Shared attribution and chronology.

No single engagement metric is allowed to override correctness, accessibility, privacy, or chronology controls.

## Completion criteria

Phase 8C is complete only when:

- exact duplicate deliveries never create duplicate timeline events, actors, counts, or shelf items;
- legitimate shares by different actors remain preserved internally;
- same-object shares render as one safe, stable content group with accurate bounded attribution;
- Shared Shelf decisions operate on distinct grouped content objects and are deterministic across pagination and hydration;
- server cursors and Phase 5 timeline membership remain event-based and correct;
- undo, deletion, edits, canonical aliases, moderation changes, account moves, and stale replay reconcile correctly;
- blocked, muted, filtered, private, or inaccessible actors and content do not leak through aggregation;
- user-facing active product surfaces consistently use Share/Shared, while protocol fields remain compatible;
- phone, tablet, desktop, multi-column, RTL, reduced-motion, zoom, keyboard, screen-reader, and forced-color tests pass;
- page fill, storage, memory, rendering, and request budgets pass on target devices;
- account switch, logout, purge, corruption repair, migration interruption, rollback, and cross-account IDOR tests pass;
- disabling the shelf or the entire phase preserves a complete usable timeline;
- documentation and implementation authority registries match actual behavior;
- no duplicate timeline, canonicalization, moderation, renderer, or seen-state authority is introduced.

## Explicit non-goals

Phase 8C does not:

- change ActivityPub `Announce` semantics;
- require servers to adopt Mangane's grouping policy;
- erase or merge legitimate share activities in remote state;
- claim globally exact share counts;
- infer that identical text means identical posts;
- implement quote-post semantics;
- replace notification grouping;
- introduce opaque cloud ranking or mandatory AI;
- create a new timeline backend;
- make horizontal carousels mandatory on every device or surface;
- rename protocol/API fields merely to match product copy;
- sacrifice strict chronology as an available presentation mode.

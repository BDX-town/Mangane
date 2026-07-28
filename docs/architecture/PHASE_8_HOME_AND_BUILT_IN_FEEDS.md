# Phase 8 Home and Built-in Feeds

Status: **Accepted target / blocked on Phase 5–7 exit criteria**

Last updated: 2026-07-28

## Outcome

Phase 8 delivers two distinct built-in timelines:

- **Home** contains posts attributable to mutual, two-way follow
  relationships.
- **For You** contains posts attributable to outbound-only, one-way follows
  plus eligible posts from hashtags the viewer follows.

There is no separate Following feed. Home and For You have separate timeline,
pagination, update, and restoration state. Future pinned Custom Feeds may
appear beside them, but remain separate subscriptions and are not blended into
either built-in timeline.

The first For You release is deterministic and chronological. It does not use
opaque engagement ranking, inferred interests, or cloud profiling. Later
ranking may be added only through the account-scoped, inspectable, resettable
personalization work in Phases 19 and 25.

## Current verified behavior

The current Home surface:

- loads the Redux `home` timeline directly through
  `expandHomeTimeline`;
- selects timeline records directly from the Redux timeline slice;
- mixes statuses, pending insertions, gaps, and suggestions in
  `StatusList`;
- uses a large legacy status component for presentation and behavior;
- persists `soapbox:scrollData:${scrollKey}` in `sessionStorage`;
- does not scope that key by deployment, instance, account, or feed identity;
- parses the stored JSON without a guarded validation boundary;
- restores by list index, measured offset, and document scroll position.

The current Phase 5 schema stores normalized statuses but has no account-scoped
timeline-entry table. It therefore cannot preserve feed identity, source
provenance, server ordering, gaps, cursor ownership, or stable deduplication
independently of a status record.

The Phase 5 bridge hydrates cached statuses and notifications. It does not yet
prove that representative timelines and conversations hydrate from canonical
local records, so Phase 5 remains in progress.

## Product contract

### Timeline navigation

The primary timeline surface presents a semantic tab list:

```text
Home | For You | [future pinned feeds]
```

Each tab owns independent load, error, stale, queued-update, anchor, and scroll
state. Switching tabs must not reset or merge another feed's state.

### Home

Home includes an eligible status when the account relationship that qualifies
the status is mutual: the viewer follows that account and that account follows
the viewer.

For an original post, the qualifying relationship account is the author. For a
boost/repost, the account that introduced the boost is also qualifying
provenance. Repost attribution remains visible.

One-way outbound follows and hashtag-only candidates do not belong in Home.

Backend-specific Home behavior must be normalized behind a timeline source
adapter. Presentation components must not infer relationship or capability
rules from raw API payloads.

### For You

The initial For You feed is the chronological, deduplicated union of:

1. eligible posts attributable to accounts the viewer follows that do not
   follow the viewer back; and
2. eligible posts from hashtags the viewer explicitly follows.

Rules:

- mutual-relationship provenance takes precedence and routes the status to
  Home, preventing the same candidate from remaining in For You merely because
  it also matches a followed hashtag;
- subscriber blocks, mutes, filters, language settings, content warnings,
  visibility, and server policy are applied before display;
- canonical object URI is the preferred deduplication key, with a scoped
  server-status identity fallback;
- repost attribution is preserved;
- source provenance is retained for reconciliation but is not shown as a
  persistent “recommended because” label;
- partial hashtag-source failure leaves successful and cached content visible;
- unsupported followed-hashtag capability leaves the outbound-only source
  available and shows a clear, non-fatal degraded status;
- ordering is latest-first with a deterministic tie-breaker;
- no hidden interest inference or engagement score is used.

Relationship changes must reconcile both feeds idempotently. When an
outbound-only relationship becomes mutual, affected membership moves from For
You to Home. When a mutual relationship becomes outbound-only, affected
membership moves from Home to For You. Stale checkpoints or retries must not
leave the same relationship-qualified entry in both feeds.

The client must not claim global completeness. Remote content remains limited
to what the connected server can resolve and authorize.

## Required application boundary

Phase 7 must expose a feed-neutral read model. A representative contract is:

```ts
type BuiltInFeedId = 'home' | 'for-you';

type TimelineEntry = {
  accountScopeId: string;
  feedId: BuiltInFeedId | `custom:${string}`;
  statusId: string;
  canonicalUri?: string;
  sortKey: string;
  sourceKinds: Array<
    'mutual-relationship'
    | 'outbound-only-relationship'
    | 'followed-hashtag'
  >;
};
```

This is an illustrative contract, not an instruction to copy the type without
validation. The implementation must keep canonical status records separate
from feed membership/order records and must expose commands and queries rather
than Dexie, Redux, or protocol payloads to presentation components.

## Phase 5 prerequisite gaps

Before Phase 8 runtime implementation, the canonical store must address:

| Gap | Required contract |
|---|---|
| Timeline identity and order | Account-scoped feed definitions, entries, stable sort keys, cursors, gaps, and source checkpoints |
| Visibility parity | Preserve supported values, including `local`, without unsafe coercion to a more public value |
| Editorial status parity | Quote identity, edit state, filters, translations, cards, reactions, counts, group/capability fields, and safe fallbacks |
| Media layout | Dimensions, aspect ratio, duration, preview metadata, and external-video capability data |
| Conversation preview | Safe ancestor/reply projection sufficient for context without parsing `raw` |
| UI boundary | No component may parse `raw` to recover a missing domain field |

Schema changes require versioned, resumable migrations, corruption tests,
account-purge coverage, and rollback behavior. Unknown visibility must fail
closed or retain an explicit unknown state; it must not default to `public`.

## Scroll restoration contract

Browser storage is attacker-influenced and must be parsed defensively.
Restoration state must:

- use a versioned key scoped by deployment, instance, account, and feed;
- contain no tokens, post text, private membership, or model data;
- validate schema, field types, lengths, timestamps, and numeric bounds;
- catch storage and JSON errors and delete invalid records;
- expire through a bounded TTL;
- restore primarily from a stable status anchor plus viewport offset;
- tolerate missing, deleted, moderated, or evicted anchors;
- fall back safely to the newest loaded position rather than looping;
- purge on logout, account removal, relevant instance change, Custom Feed
  unpin/unsubscribe, and schema incompatibility;
- preserve independent state for Home, For You, and every pinned feed;
- avoid animated corrective scrolling when reduced motion is requested.

Index and raw pixel restoration alone are insufficient because media loading,
content-warning expansion, quote previews, moderation removal, and queued
insertions change item height and order.

## Security and privacy

- Every query, entry, checkpoint, view state, and mutation is bound to an
  immutable account-and-instance scope.
- Client-side tab visibility is not authorization. Servers and trusted
  adapters remain responsible for resource authorization.
- Persisted values and remote payloads are validated before use.
- Remote URLs use the central destination policy; active URL schemes and
  untrusted authenticated request destinations are rejected.
- User content continues through the existing reviewed sanitization boundary;
  feed assembly never parses unsanitized HTML for rendering.
- Diagnostics contain counts, source classes, timings, and typed error codes,
  not content, account handles, hashtag names, tokens, or entity identifiers.
- Retry is limited to transient failures, honors server rate limits, uses
  exponential backoff with jitter and a ceiling, supports cancellation, and
  never retries authorization or validation failures indefinitely.

## Slices

### 8A — Compatibility contract and fixtures

- enumerate current Home behaviors and backend-specific actions;
- create editorial status/media/conversation projections;
- add Akkoma, Pleroma, and Mastodon fixtures;
- define Home and For You inclusion, relationship precedence, ordering,
  deduplication, transition reconciliation, and degraded
  behavior;
- prove moderation and visibility parity.

### 8B — Scoped timeline read model

- add versioned timeline membership/order storage;
- expose feed-neutral application queries and commands;
- implement account-scoped source adapters and checkpoints;
- reconcile duplicate, deleted, edited, and out-of-order events;
- add safe partial-failure and bounded retry behavior.

### 8C — Editorial post card

- compose the Phase 2 controls and semantic icons;
- preserve content warnings, media, quotes, polls, reactions, translation,
  moderation, visibility, and backend-specific actions;
- keep the renderer feed-neutral.

### 8D — Timeline states and restoration

- implement independent Home and For You state;
- implement anchor-based, scoped restoration;
- cover queued insertions, gaps, stale/offline data, cache eviction, account
  switching, and missing anchors;
- validate keyboard, touch, pointer, and reduced-motion behavior.

### 8E — Parity, accessibility, and performance

- run capability parity fixtures;
- run WCAG 2.2 AA interaction and screen-reader checks;
- measure mid-range mobile scrolling, memory, and long-session behavior;
- retain rollback through a bounded feature flag until equivalence is proven.

## Tests required

- mutual relationship inclusion in Home;
- outbound-only relationship inclusion in For You;
- one-way-to-mutual and mutual-to-one-way reconciliation;
- followed-hashtag inclusion and unsupported-capability degradation;
- canonical-URI deduplication across both sources;
- block, mute, filter, visibility, CW, and language enforcement;
- source partial failure, cancellation, rate limiting, and retry ceilings;
- cross-account read/write/restore IDOR attempts;
- corrupt, oversized, expired, and cross-scope scroll records;
- missing-anchor and layout-shift restoration;
- account switch, logout, unpin, and unsubscribe purge;
- no `raw` parsing in migrated presentation code;
- renderer parity across backend fixtures;
- keyboard tabs, focus restoration, announcements, reduced motion, text scale,
  forced colors, and touch targets;
- realistic-feed performance and memory budgets.

## Exit criteria

Phase 8 is complete only when:

1. Home and For You are distinct built-in timelines and no Following feed is
   introduced.
2. Home uses mutual-relationship provenance; For You uses outbound-only
   relationship and followed-hashtag provenance.
3. Each feed has account-scoped membership, ordering, checkpoints, state, and
   anchor-based restoration.
4. Existing moderation, visibility, CW, media, quote, poll, reaction,
   translation, and backend-specific actions have parity evidence.
5. No migrated presentation component reads Redux, Dexie, transport clients,
   or raw protocol payloads directly.
6. Failure, offline, stale, empty, loading, queued-update, and recovery states
   are accessible and tested.
7. Mobile performance budgets and cross-account security tests pass.
8. CI and review are clean and rollback remains verified.

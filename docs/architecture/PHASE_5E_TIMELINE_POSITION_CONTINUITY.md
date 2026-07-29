# Phase 5E Timeline Position Continuity

Status: **Accepted target / queued within Phase 5 before broad Phase 8 rollout**

Last updated: 2026-07-29

## Purpose

Preserve a user's reading position in each Mangane timeline across route changes,
refreshes, PWA suspension, process termination, application updates, offline
relaunch, and account switching.

A PWA can provide high-quality local timeline restoration without Durable
Streams. Durable Streams can later improve remote replay and cross-device
continuity, but it is not required to remember where a browser was reading.

The core design stores a semantic anchor—timeline identity, canonical item,
relative visual offset, ordering context, and source checkpoint—rather than only
a fragile pixel value.

## Product behavior

Each timeline retains independent state, including:

- Home;
- For You;
- Local and federated/public timelines;
- lists;
- hashtags;
- notifications where supported;
- Custom Feeds;
- profile and account-status timelines where product policy enables restoration.

Expected behavior:

1. leaving a timeline and returning restores the same visible post and nearby
   content;
2. refreshing or reopening the installed PWA restores the last meaningful
   reading position when retained data is available;
3. new posts arriving above the anchor do not move the user's current reading
   position;
4. deleted, filtered, or evicted anchors recover to the nearest deterministic
   surviving neighbour;
5. switching accounts never restores another account's position;
6. tapping the active timeline tab may scroll to the newest post only through an
   explicit product action, not merely because the timeline rerendered;
7. the user can intentionally jump to newest and replace or clear the prior
   anchor.

## Why a pixel offset is insufficient

A raw `scrollTop` becomes unreliable when:

- posts above the viewport are inserted, deleted, edited, expanded, or collapsed;
- images load after initial layout;
- fonts, accessibility text size, orientation, or viewport dimensions change;
- virtualization recycles DOM nodes;
- content warnings, translations, polls, and media alter row height;
- a PWA update changes card layout;
- the browser restores history before data hydration finishes.

Mangane therefore stores both semantic and geometric information.

## Position model

```ts
interface TimelinePosition {
  schemaVersion: number;
  accountScopeId: string;
  timelineKey: string;
  anchorCanonicalUri: string;
  anchorOrderKey: string;
  anchorOffsetPx: number;
  anchorIndexHint?: number;
  precedingCanonicalUri?: string;
  followingCanonicalUri?: string;
  sourceCheckpoint?: string;
  capturedAt: string;
  viewportHeight: number;
  layoutRevision: number;
  intent: 'reading' | 'newest';
}
```

Definitions:

- `anchorCanonicalUri`: the first stable item intersecting the reading viewport;
- `anchorOffsetPx`: the anchor element's top relative to the restoration viewport
  origin, not the document's absolute scroll position;
- `anchorOrderKey`: canonical timeline ordering metadata from Phase 5;
- neighbour URIs: deterministic recovery hints if the anchor disappears;
- `sourceCheckpoint`: optional paging/stream position used to refill the local
  window, not a substitute for the visual anchor;
- `layoutRevision`: invalidates unsafe geometry while preserving semantic
  restoration.

Server-local IDs must not be the sole identity for remote posts.

## Capture policy

Capture position through one coordinated timeline-position controller.

Use:

- `IntersectionObserver` or the virtualization library's visible-range callback
  to identify the anchor;
- passive scroll observation;
- throttled in-memory updates during active scrolling;
- durable writes after scrolling settles, on route departure, visibility change,
  page freeze/pagehide, and controlled application shutdown opportunities;
- a final best-effort synchronous in-memory snapshot without relying on an
  asynchronous write completing during unload.

Do not write IndexedDB on every scroll event.

The controller must ignore transient positions during programmatic restoration so
it does not overwrite the saved anchor before restoration completes.

## Local persistence

Positions are account-scoped canonical local records.

Storage requirements:

- compound key of account scope plus stable timeline key;
- versioned schema and resumable migration;
- bounded number of retained timeline positions;
- deterministic purge on logout, account removal, emergency reset, or privacy
  settings change;
- cross-tab coordination so stale tabs cannot overwrite a newer position;
- monotonic local revision or compare-and-swap semantics;
- no post body, private draft, or secret data in the position record.

A position may persist longer than the associated cached post. Recovery rules
handle that case.

## Restoration state machine

```text
idle
  -> loading-position
  -> hydrating-window
  -> locating-anchor
  -> applying-offset
  -> stabilizing-layout
  -> restored
  -> tracking
```

Failure states:

```text
anchor-missing
window-unavailable
layout-incompatible
storage-unavailable
account-mismatch
```

Restoration steps:

1. bind the exact account and timeline scope;
2. read the position before starting ordinary newest-edge scrolling;
3. hydrate a local window containing the anchor where possible;
4. if absent, page using canonical ordering/checkpoints toward the anchor within
   hard request and item limits;
5. render enough preceding and following items to stabilize layout;
6. scroll the anchor into view;
7. apply the stored relative offset;
8. compensate for bounded late layout changes;
9. enable normal tracking only after restoration is stable;
10. expose a quiet recovery action if the position cannot be reconstructed.

## Layout stabilization

Use scroll anchoring deliberately rather than fighting the browser.

Requirements:

- reserve media dimensions from attachment metadata;
- use stable aspect-ratio boxes and skeleton dimensions;
- wait for critical fonts/layout data only within a strict deadline;
- use `ResizeObserver` to compensate when content above the anchor changes during
  the stabilization window;
- cap total compensation distance and duration;
- honor reduced motion and avoid animated restoration;
- prevent focus jumps and preserve keyboard/screen-reader context;
- stop compensating after the user manually scrolls.

`history.scrollRestoration` may assist conventional browser history navigation,
but Mangane must use `manual` restoration where SPA routing, virtualization, and
asynchronous hydration would otherwise restore the wrong pixel position.

## New-post insertion

When new statuses arrive above the visible anchor:

- insert them into canonical ordering and local membership;
- preserve the current anchor and relative offset;
- show a restrained “new posts” affordance when useful;
- do not force-scroll to the top;
- tapping the affordance moves to newest through an explicit command;
- preserve the prior reading anchor until the jump commits or product policy
  intentionally replaces it.

## Virtualized timelines

Virtualization must support item-key and offset restoration.

Required adapter contract:

```ts
interface TimelineViewportAdapter {
  getVisibleAnchor(): VisibleTimelineAnchor | null;
  restoreToAnchor(input: {
    itemKey: string;
    relativeOffsetPx: number;
    indexHint?: number;
    signal: AbortSignal;
  }): Promise<RestoreResult>;
  compensate(deltaPx: number): void;
}
```

The adapter must not depend on a specific virtual-list package. Phase 7
presentation boundaries own the implementation.

Variable-height estimates must be corrected after measurement without large
visual jumps.

## Anchor recovery

If the exact anchor is unavailable:

1. try the stored preceding neighbour;
2. try the following neighbour;
3. locate the closest surviving item by canonical order key;
4. use the source checkpoint to fetch a bounded window;
5. fall back to the nearest locally available reading-era item;
6. fall back to newest only with an honest, subtle indication that the prior
   position could not be restored.

Deletion, moderation, visibility loss, and retention eviction are legitimate
reasons an anchor may disappear. Never resurrect hidden content merely to restore
position.

## Mastodon markers

Where supported, the Mastodon Markers API can synchronize the last-read status ID
for Home and notifications.

Markers are useful but insufficient because they:

- cover only specific server-defined timelines;
- store a last-read ID, not relative visual position;
- use server-local IDs;
- do not cover Mangane Custom Feeds, Local, hashtags, lists on all backends, or
  arbitrary profile timelines;
- cannot restore card expansion, media/layout state, or independent tab scroll
  positions.

Mangane may use markers as an optional remote coarse checkpoint while retaining
its local semantic anchor as the visual authority.

Marker updates must handle version conflicts, rate limits, unsupported backends,
and account scope. Failure must not break local restoration.

## Relationship to Durable Streams

### Without Durable Streams

Mangane can restore locally using:

- IndexedDB position records;
- canonical timeline membership/order;
- cached status windows;
- ordinary paginated server APIs;
- connected-server streaming after reopen;
- optional Mastodon markers for coarse Home/notification progress.

This is sufficient for same-device continuity.

### With Durable Streams

A future Durable Streams provider may improve:

- exact replay of timeline membership changes missed while the PWA was closed;
- rebuilding the window around an old anchor without relying only on server
  pagination;
- synchronized account-level reading progress across devices when explicitly
  designed;
- durable Custom Feed revision/membership continuity;
- deterministic recovery after long offline periods.

Durable Streams does not automatically know the user's visual offset. Mangane
must still store and synchronize an explicit position resource if cross-device
visual continuity is desired.

Read progress synchronization is a privacy/product decision. It must not become a
public read receipt or leak which posts the user viewed.

## Cross-tab behavior

One tab is the active writer per account/timeline lease. Other tabs may observe
position changes but cannot overwrite a newer revision from stale UI state.

Handle:

- tab crash and stale lease;
- simultaneous windows on different timelines;
- two tabs on the same timeline;
- browser session restore;
- account switch in one tab;
- storage events arriving out of order.

Last-writer-wins by wall-clock time alone is not sufficient. Use record revisions
and active-view ownership.

## Privacy and security

- bind every record to exact account scope;
- use canonical timeline keys from trusted route/application definitions;
- do not allow arbitrary keys to create unbounded storage;
- purge positions with account data;
- do not sync positions remotely without explicit accepted authority and privacy
  policy;
- never include access tokens, private content, full search queries, or post text;
- treat private timeline identifiers as sensitive metadata in logs/telemetry;
- prevent IDOR access to another account's position repository;
- apply moderation before locating or rendering an anchor.

## Performance budgets

- no durable write for every scroll frame;
- restoration work must yield to input and rendering;
- bounded page requests, hydrated items, memory, and compensation cycles;
- no full-timeline scan;
- position lookup indexed by account/timeline/URI/order key;
- restoration should display useful cached content immediately where available;
- mobile startup and battery impact must be measured.

## Feature flags and rollback

Suggested flags:

```text
timeline.positionPersistence
timeline.positionRemoteMarkers
timeline.positionCrossDevice
```

Rollback disables capture/restoration while leaving canonical timeline records
intact. Position records may be retained for a bounded rollback period or purged
according to policy. Browser-native history behavior must remain usable.

## Implementation slices

### 5E.1 Position schema and repository

- account/timeline-scoped schema;
- revision and lease semantics;
- migration, retention, export exclusion, and purge;
- IDOR and corruption tests.

### 5E.2 Viewport adapter

- visible-anchor capture;
- semantic item-key restoration;
- relative-offset application;
- virtualization-independent contract;
- reduced-motion and accessibility behavior.

### 5E.3 Hydration and recovery

- anchor-window local hydration;
- bounded pagination toward missing anchors;
- neighbour/order-key fallback;
- deleted/filtered/evicted recovery;
- offline behavior.

### 5E.4 Layout stabilization

- media dimension reservation;
- ResizeObserver compensation;
- late font/media/content handling;
- user-scroll cancellation;
- mobile/orientation/text-size tests.

### 5E.5 Multi-tab and lifecycle capture

- active-writer lease;
- visibility/pagehide/freeze capture;
- stale-tab protection;
- PWA update/reload and process-termination scenarios.

### 5E.6 Optional server markers

- Mastodon Home/notification marker capability;
- conflict-safe writes and coarse checkpoint merge;
- unsupported backend fallback;
- no dependency for local restoration.

### 5E.7 Future durable/cross-device extension

- separate authorized position resource;
- explicit privacy and conflict policy;
- Durable Streams replay integration where adopted;
- device-local versus account-global setting.

## Test requirements

### Unit

- timeline key and account scope;
- anchor selection;
- record revision/CAS behavior;
- neighbour and order-key recovery;
- layout-revision invalidation;
- marker conflict handling;
- retention and purge.

### Integration

- route away/back;
- browser refresh;
- installed-PWA termination/relaunch;
- new posts inserted above;
- anchor edit, deletion, filter, and eviction;
- images loading late;
- orientation and text-size change;
- virtualization remount;
- offline restore and later reconnect;
- account switch and multi-tab handoff;
- application/service-worker update.

### Security/adversarial

- cross-account record access;
- unbounded timeline-key creation;
- malformed/oversized position records;
- stale tab overwriting a newer revision;
- private timeline metadata leakage;
- malicious canonical URI/ordering data;
- restore attempt to content now blocked or unauthorized.

### Accessibility/performance

- no unexpected focus movement;
- screen-reader virtual cursor remains usable;
- reduced-motion restoration has no animation;
- keyboard navigation resumes near the anchor;
- no large layout jump after stabilization;
- scrolling remains  responsive while capture is active;
- bounded startup, memory, database-write, network, and battery costs.

## Explicit non-goals

- relying only on raw `scrollTop`;
- requiring Durable Streams for same-device restoration;
- treating Mastodon markers as precise visual position;
- synchronizing reading activity without explicit consent and authority;
- restoring content the user can no longer access;
- keeping unlimited cached history solely for restoration;
- forcing users to newest when new posts arrive;
- allowing stale tabs to win silently.

## Exit criteria

Phase 5E is complete only when:

1. every supported timeline has a stable account-scoped key;
2. semantic anchor plus relative offset survives route changes, refresh, PWA
   relaunch, and ordinary layout changes;
3. new content above the anchor does not move the reader;
4. missing anchors recover deterministically without exposing hidden content;
5. virtualization, media loading, orientation, accessibility text size, and
   application updates are covered;
6. capture is throttled, transactional, bounded, and coordinated across tabs;
7. logout/account removal purges positions and cross-account tests pass;
8. local restoration works with no Durable Streams provider;
9. optional server markers degrade cleanly and never replace visual authority;
10. cross-device synchronization remains separately authorized and private;
11. mobile performance, battery, accessibility, and visual-stability budgets
    pass;
12. CI and review are clean.

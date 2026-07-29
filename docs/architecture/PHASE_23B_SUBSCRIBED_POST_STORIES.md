# Phase 23B — Subscribed Post Stories

Status: **Accepted target / queued**

Date: 2026-07-29

Owner dependencies: Phases 1, 2, 3, 5, 6, 7, 8, 23; Phase 5E timeline-position continuity; Phase 8A origin-authority reconciliation. Phase 6A Durable Streams is optional and is not required for the first implementation.

## 1. Purpose

Mangane already exposes a profile-level notification-bell interaction whose product meaning is: notify the signed-in user when that account publishes eligible public posts. Phase 23B changes the primary presentation of those subscribed-post notifications from an ordinary notification-list item into an optional, story-shaped reading tray.

Mangane Subscribed Post Stories are not Pixelfed Stories and are not ephemeral ActivityPub objects. They are a presentation, queueing, and shared read-state layer over ordinary statuses and their existing notification-subscription relationship.

The source post:

- remains an ordinary status on its origin and connected servers;
- keeps its original visibility, edits, replies, favourites, boosts, bookmarks, moderation, and deletion semantics;
- does not receive a synthetic expiry time;
- is not copied into a second canonical content record;
- remains available in profiles, timelines, conversations, search, bookmarks, and other clients according to normal protocol behavior.

The story-shaped item is considered complete when the subscriber meaningfully views it. Completion clears that item’s unread presentation state. An author ring is unread while at least one eligible queued item for that author remains unread.

## 2. Naming and collision policy

The canonical phase identifier is **Phase 23B**. Phase 23A is already assigned to Custom Feeds, and Phase 23 owns the broader Notifications, Profiles, Bookmarks, Lists, and Settings migration. Phase 23B is therefore a subordinate feature phase of Phase 23 and must not be renamed to Phase 24 or reuse any existing phase suffix.

Canonical internal names:

- feature: `subscribedPostStories`;
- queue item: `SubscribedPostStoryItem`;
- author group: `SubscribedPostStoryGroup`;
- local receipt: `SubscribedPostStoryReceipt`;
- shared notification projection: `SubscribedPostNotificationProjection`.

Avoid the following ambiguous names in domain code:

- `Story` without a qualifier;
- `PixelfedStory` for this feature;
- `Moment` unless a later product decision explicitly adopts it;
- `StoryNotification`, which obscures whether the status or notification is authoritative;
- `stories` as a persistence table name without a namespace.

Presentation copy may use “Stories” after onboarding explains the feature, but domain types and storage keys must retain the `subscribedPost` qualifier so future native Pixelfed support cannot collide with this model.

## 3. Product contract

When the feature is enabled:

```text
profile notification bell enabled
        ↓
server or local capability records account-post subscription intent
        ↓
eligible post notification/event is ingested
        ↓
canonical status is resolved or queued for resolution
        ↓
one deduplicated queue item is attached to the author group
        ↓
unread author ring appears in the Stories tray
        ↓
subscriber meaningfully views the item
        ↓
shared read receipt is committed
        ↓
notification-list and Stories unread projections update together
        ↓
author ring clears when no unread eligible items remain
```

When the feature is disabled:

- no story tray is rendered;
- existing profile-bell subscriptions remain unchanged;
- subscribed-post notifications continue through the ordinary Notifications surface;
- canonical statuses, notifications, and subscription relationships are not deleted;
- optional story-specific local view-position records may be retained for a bounded grace period or purged according to policy.

Disabling the feature must never silently disable the user’s notification bell subscriptions.

## 4. Current-state verification gate

The user-visible profile-bell behavior is known product behavior, but implementation must not begin from an assumed endpoint or state shape. Slice 23B-0 must inventory and document:

- the profile component and command that toggles the bell;
- the protocol request and relationship field used by Akkoma, Pleroma, Mastodon-compatible, and Mangane-specific paths;
- whether the server exposes `notifying`, `notify`, or another relationship capability;
- the notification/event type emitted for a subscribed account’s new post;
- whether replies, boosts, quotes, polls, and local-only posts are included by each backend;
- push-worker, streaming, polling, Redux, React Query, and persistence call sites;
- whether ordinary notification dismissal/read state is server-side, local-only, or mixed;
- account-switch, logout, and relationship-refresh behavior;
- existing duplicate-notification handling.

The inventory must be added to the backend capability matrix and API/protocol callsite authority before runtime implementation. Unsupported backends must not be labeled as supporting server-authoritative account-post subscriptions.

## 5. Authority model

Phase 23B separates four authorities.

### 5.1 Subscription authority

The connected account server is authoritative when it provides a verified profile-notification subscription capability. Mangane stores a cached projection and pending mutation state, but must reconcile to the server relationship response.

For a backend without this capability, a later local-only subscription fallback may be offered only when:

- it is explicitly labeled “This device” or equivalent;
- it does not claim server push or cross-device delivery;
- it uses bounded polling and respects visibility/moderation;
- its state is not merged with a server-authoritative bell without provenance.

The first implementation should prefer verified existing server behavior and may omit local-only fallback.

### 5.2 Content authority

The canonical status store owns the normalized post. The story queue stores only identity, provenance, ordering, and read-state references.

Phase 8A may refresh public content and aggregate fields from the origin server. Connected-server viewer state remains authoritative for permissions, local action IDs, moderation, and user-specific action fields.

### 5.3 Notification-event authority

The connected server’s notification or verified stream event is the preferred evidence that a subscribed account published an eligible post. Poll reconciliation may repair missed delivery but must not create a second logical item for the same account/status/subscription generation.

### 5.4 Read-state authority

Mangane’s account-scoped receipt is authoritative for whether the item has been meaningfully viewed in the story presentation. If the backend exposes compatible notification read/dismiss semantics, an adapter may synchronize the shared notification state, but remote dismissal must not be assumed to encode exact story-frame viewing.

The Notifications page and Stories tray must derive unread state through one application-level projection, not independent booleans.

## 6. Canonical data contracts

Illustrative TypeScript contracts follow. Final field names must conform to the Phase 5 schema conventions and account-scope types.

```ts
type SubscriptionAuthority =
  | 'connected-server'
  | 'local-device';

type DeliverySource =
  | 'server-notification'
  | 'server-stream'
  | 'push-reconciliation'
  | 'poll-reconciliation'
  | 'durable-stream';

type ItemLifecycle =
  | 'pending-status-resolution'
  | 'ready'
  | 'seen'
  | 'dismissed'
  | 'ineligible'
  | 'tombstoned';

interface SubscribedPostStoryItem {
  key: string;
  accountScope: string;
  subscriptionKey: string;
  subscriptionGeneration: number;

  authorUri: string;
  canonicalStatusUri: string;
  connectedStatusId?: string;
  notificationIds: string[];

  publishedAt: string;
  firstObservedAt: string;
  lastObservedAt: string;
  primaryDeliverySource: DeliverySource;
  observedSources: DeliverySource[];

  lifecycle: ItemLifecycle;
  eligibilityRevision: number;
  statusSnapshotVersion?: number;

  createdAt: string;
  updatedAt: string;
}

interface SubscribedPostStoryReceipt {
  accountScope: string;
  itemKey: string;

  firstPresentedAt?: string;
  meaningfullyViewedAt?: string;
  completedAt?: string;
  markedUnreadAt?: string;
  dismissedAt?: string;

  viewerRevision: number;
  updatedAt: string;
}

interface SubscribedPostStoryGroup {
  accountScope: string;
  authorUri: string;

  unreadCount: number;
  totalRetainedCount: number;
  newestPublishedAt: string;
  oldestUnreadPublishedAt?: string;
  currentItemKey?: string;

  orderRevision: number;
  updatedAt: string;
}
```

The item key must be deterministic and collision-resistant:

```text
hash(
  schema-version,
  account-scope,
  subscription-key,
  subscription-generation,
  canonical-status-uri
)
```

Do not use notification ID alone. Multiple delivery channels or server retries can produce multiple notification identifiers for one logical status.

Do not use local status ID alone. The same ActivityPub object can have different local IDs on different connected instances or after account migration.

## 7. Subscription generations

A user may disable the bell and later re-enable it. Old events must not automatically become unread under the new subscription unless the product explicitly offers backlog import.

Each transition from disabled to enabled creates or observes a new `subscriptionGeneration` with an effective start boundary:

```ts
interface AccountPostSubscription {
  accountScope: string;
  subscriptionKey: string;
  authorUri: string;
  authority: SubscriptionAuthority;
  generation: number;
  enabled: boolean;
  effectiveFrom: string;
  serverRelationshipRevision?: string;
  updatedAt: string;
}
```

Eligibility requires the post to be published or first validly observed after the generation’s effective boundary, subject to a small documented clock-skew allowance. Reconciliation must not backfill an author’s entire profile after a new bell subscription.

## 8. Eligibility policy

The first release must have a deterministic, documented default.

Include by default:

- original statuses published by an actively subscribed account;
- public or otherwise subscriber-visible statuses that the connected server authorizes;
- media posts, text posts, polls, and supported quote posts;
- local visibility only when the signed-in account and backend authorize it and the capability is explicitly modeled.

Exclude by default:

- boosts/reblogs/announces;
- replies;
- direct messages;
- statuses older than the subscription generation boundary;
- deleted, blocked, muted, filtered, or inaccessible statuses;
- events lacking a safely resolvable canonical status URI;
- malformed or schema-invalid payloads.

Replies and boosts may become separate per-subscription preferences only after backend capability and notification semantics are verified. A preference unavailable on the server may only filter Mangane presentation; it must not be represented as a server subscription setting.

Eligibility is re-evaluated when moderation, visibility, subscription, status, or account-move state changes. An item that becomes ineligible is removed from the active tray without exposing content in diagnostics or transition animations.

## 9. Deduplication and idempotency

Deduplication is mandatory across notifications, streaming, push, polling, origin reconciliation, hydration, and future Durable Streams.

### 9.1 Identity normalization

Resolution order:

1. validated canonical ActivityPub object URI from the normalized status;
2. canonical URI alias already known in the local store;
3. connected-server status URI resolved through the protocol adapter;
4. temporary pending-resolution key scoped to account, author, notification, and delivery source.

A pending key must be replaced transactionally by the canonical key once resolved. Merge, do not copy, all notification IDs and delivery provenance.

### 9.2 Upsert rule

Every ingestion path calls one application command:

```ts
upsertSubscribedPostEvent(event): Promise<UpsertResult>
```

No presentation component, worker, or transport directly inserts queue rows.

The command must transactionally:

- validate account and subscription scope;
- resolve or record canonical identity;
- verify subscription generation and eligibility;
- create or merge the queue item;
- append unique notification IDs and delivery-source provenance;
- update author-group counters from canonical item/receipt state;
- persist the source checkpoint only after effects commit;
- enqueue status hydration or reconciliation exactly once where possible.

Repeated, reordered, or concurrent calls with the same logical object must converge to one queue item.

### 9.3 Alias and move handling

Account moves, redirects, status URL aliases, and origin/connected-server URL differences must use the canonical alias registry. Author groups may be re-keyed after a verified account move, preserving receipts and queue order without duplicating items.

### 9.4 Notification-list deduplication

Subscribed-post events remain one logical notification obligation even when represented in two surfaces.

The canonical projection exposes:

```ts
interface SubscribedPostNotificationProjection {
  itemKey: string;
  notificationIds: string[];
  unread: boolean;
  presentation: 'stories' | 'notifications';
  seenAt?: string;
}
```

Stories enabled:

- the tray is the primary unread presentation;
- the Notifications page may retain history but must not increment a second unread badge;
- opening the same item from Notifications completes the shared receipt;
- completing it in Stories clears the corresponding notification projection.

Stories disabled:

- subscribed-post events use the Notifications presentation;
- no story-only unread counter remains.

## 10. Meaningful-view contract

Prefetch, hydration, intersection calculation, animation setup, or route opening does not count as a view.

A view may be committed when all required conditions hold:

- the item is the active viewer item;
- the document/application is foregrounded;
- the item’s primary content region is visibly rendered above a defined threshold;
- no blocking content-warning cover is still hiding the post;
- a minimum foreground presentation interval has elapsed;
- the account scope and viewer session still match.

The interval must be configurable and covered by fake-timer tests. Initial target: approximately one second for ordinary content, with no need to complete a video or read the entire text.

The view command must be idempotent:

```ts
markSubscribedPostStoryViewed({
  accountScope,
  itemKey,
  viewerRevision,
}): Promise<void>
```

It transactionally updates the receipt, author-group unread count, global story badge, and shared notification projection. Remote notification dismissal, when supported, occurs through a separate retryable outbox operation so local completion is not rolled back by a network failure.

Users may explicitly mark an item unread. This creates `markedUnreadAt`, clears completion for the current receipt revision, and restores one unread obligation without manufacturing a new server notification.

## 11. Queue ordering and retention

Initial group ordering:

1. groups with unread items before fully read groups;
2. among unread groups, oldest unread publication time first so subscriptions are not starved;
3. deterministic tie-break by canonical author URI;
4. optional “recently viewed” groups after unread groups, newest completion first.

Within an author group:

1. unread items in publication order, oldest first;
2. then recently viewed items if history is enabled;
3. deterministic tie-break by canonical status URI.

The implementation must not use opaque engagement ranking in the first release.

Queues are bounded by account, author, age, count, and storage budget. Suggested initial policy, subject to measurement:

- maximum active unread items per author: 50;
- maximum active unread items per account: 500;
- recently viewed retention: 7 days or 200 items, whichever is lower;
- pending unresolved item retention: 24 hours;
- tombstone metadata retention: according to the canonical store policy.

Overflow must not be silently represented as “all caught up.” When a cap is reached, show a bounded “Older subscribed posts are available in the profile/notifications” continuation and record a non-content diagnostic counter.

Retention never deletes the canonical status merely because its story queue entry is evicted.

## 12. Ingestion and reconciliation

Preferred sources, in order:

1. connected-server account-post notification;
2. authenticated connected-server streaming event;
3. safe push-triggered notification reconciliation;
4. bounded polling reconciliation;
5. optional Durable Stream event in a later slice.

Push payloads are hints, not trusted content. A push event must be resolved through authenticated application APIs before exposing a story item.

Polling is repair, not continuous per-author hammering. It must use:

- one account-scoped scheduler;
- per-origin and global concurrency caps;
- conditional requests/cursors where supported;
- exponential backoff with full jitter;
- visibility and foreground awareness;
- battery/data-saver constraints;
- cancellation on logout, account switch, feature disable, or subscription disable;
- a maximum retry horizon and user-visible degraded state where material.

Poll reconciliation starts from stored subscription checkpoints and generation boundaries. It must not scan every subscribed profile from the beginning.

## 13. Viewer and tray behavior

The tray is optional and may appear above the appropriate built-in timeline after Phase 8 migration. Placement must not obscure primary navigation or force horizontal scrolling on users who disable it.

Each group exposes:

- author identity and avatar through canonical account records;
- unread ring and accessible unread count;
- muted/blocked/inaccessible handling;
- a context action to disable the profile bell;
- an optional “mark all from this author read” action;
- no implication that the source post expires.

Viewer controls:

- explicit Previous, Next, Pause, Close, View original post, and More actions;
- keyboard arrows and Escape;
- swipe/tap gestures only as redundant shortcuts;
- preserved focus and exact position when opening a composer, poll, media viewer, or conversation;
- no forced auto-advance for text, polls, content warnings, or complex cards;
- optional timed progression only for simple media and disabled under reduced motion or explicit pause preferences;
- new items arriving above/within the queue do not move the currently viewed item.

The viewer renders the same canonical post projection and action commands as other migrated surfaces. It must not fork sanitization, moderation, media, translation, or engagement implementations.

## 14. Timeline-position integration

Phase 5E provides the semantic-anchor pattern. Phase 23B stores a viewer-specific continuation record:

```ts
interface SubscribedPostStoryPosition {
  accountScope: string;
  authorUri?: string;
  itemKey?: string;
  relativeContentOffset?: number;
  viewerLayoutRevision: number;
  sourceCheckpoint?: string;
  updatedAt: string;
}
```

Restoration is local and same-device in the first release. Missing, deleted, filtered, or evicted anchors recover deterministically to the nearest eligible unread item, then the next group, then the tray.

Durable Streams are not required. A future slice may synchronize ordered events and coarse cross-device completion, but exact visual offset remains a local presentation concern unless an explicit private synchronization authority is approved.

## 15. Multi-tab and concurrency rules

Only one tab may own foreground story-view progression and active receipt writes for an account at a time. Use the canonical tab-coordination mechanism with a renewable lease and bounded expiry.

Other tabs:

- observe receipt/group changes through the approved cross-tab channel;
- may open the tray and request ownership;
- must not double-fire remote dismiss mutations;
- must recover when the leader closes or is suspended.

All mutations use optimistic concurrency or revision checks. Group counters are derived/repaired from items and receipts rather than trusted as irrecoverable truth.

A repair command must rebuild group counts and unread projections from canonical rows after interrupted migration or corruption.

## 16. Security and privacy

Mandatory invariants:

- every row, cache key, query key, worker message, checkpoint, and mutation is bound to exact account and instance scope;
- no cross-account item, receipt, group, or media cache reuse without an explicitly approved safe shared-content layer;
- object-level authorization is rechecked before rendering and before actions;
- blocks, mutes, domain blocks, filters, content warnings, and server visibility win over story presentation;
- connected-server access tokens are never sent to origin or media hosts;
- push payloads and URLs are untrusted hints;
- media and external destinations use the canonical URL/destination policy;
- content-bearing payloads, author identifiers, notification IDs, and status URIs are excluded from telemetry and ordinary diagnostics;
- prefetch does not create view receipts;
- service-worker caching cannot expose private/follower/local content across accounts;
- logout, account deletion, emergency reset, and account switch deterministically cancel work and purge account-scoped records;
- hidden/inaccessible items do not leak through unread counts, alt labels, animations, or timing-sensitive preview fetches;
- queue and media preloading are bounded to prevent resource exhaustion.

Threat tests must include IDOR attempts, forged account scope, forged notification IDs, replayed events, alias collisions, malicious redirects, duplicate push/stream delivery, stale relationship state, blocked-author races, and account switching during view completion.

## 17. Accessibility

The feature must meet WCAG 2.2 AA and the repository accessibility contracts.

Required:

- 44×44 minimum touch targets;
- keyboard-complete operation;
- visible focus;
- semantic group labels such as “3 unread posts from Alice”;
- progress announced without noisy repeated live-region output;
- captions/alt text and content-warning behavior inherited from canonical cards;
- reduced-motion behavior with no required timed progression;
- no color-only unread distinction;
- pause controls for moving/timed content;
- screen-reader navigation that does not mark offscreen prefetched items viewed;
- correct focus return to the tray group after closing.

## 18. Performance and media policy

The tray must not preload every queued status or media asset.

Initial preload budget:

- current item;
- next item in current author group;
- optionally the first item in the next group when network/data-saver policy permits.

Use abortable requests, known media dimensions, poster frames, object-URL cleanup, and visibility-driven video pause. Story-specific code must not add a second media cache.

Performance gates must measure:

- tray first render;
- open-to-content latency from warm and cold local state;
- main-thread long tasks;
- memory under maximum bounded queue;
- IndexedDB write rate during viewing;
- multi-tab propagation;
- data transferred by prefetch;
- mid-range mobile scrolling and viewer transitions.

## 19. Failure and degraded behavior

The feature must degrade without breaking Notifications or ordinary timelines.

Examples:

- subscription capability unavailable: hide/disable the bell through the existing capability contract; do not fabricate support;
- notification event lacks a status: retain a bounded pending record and retry safe resolution;
- status deleted before viewing: render a non-leaking unavailable/tombstone state, complete or remove according to policy, and continue;
- server read/dismiss mutation fails: keep local shared completion, queue bounded retry, and expose non-disruptive status only if user action is required;
- IndexedDB unavailable/corrupt: fall back to ordinary Notifications presentation and do not claim durable seen state;
- streaming unavailable: use bounded poll reconciliation;
- all ingestion unavailable: preserve cached items and show stale/degraded state;
- feature flag disabled remotely or locally: return presentation to Notifications without changing subscriptions.

## 20. Feature flags and rollback

Owned flags must be registered with owner, default, dependencies, rollout, and removal criteria. Suggested flags:

- `notifications.subscribedPostStories` — master presentation flag;
- `notifications.subscribedPostStoriesViewer` — viewer rollout;
- `notifications.subscribedPostStoriesPollingRepair` — polling reconciliation;
- `notifications.subscribedPostStoriesRemoteDismissSync` — optional server read/dismiss synchronization;
- `notifications.subscribedPostStoriesDurableEvents` — future Phase 6A integration.

Rollback procedure:

1. stop viewer progression and capture no new receipts;
2. cancel poll/stream tasks and outbox work owned solely by this feature;
3. switch subscribed-post notification projection to ordinary Notifications;
4. retain canonical statuses, server subscriptions, notification history, and compatible local receipts;
5. remove story groups/positions after the documented grace period if required;
6. verify no unread obligation is lost or counted twice.

## 21. Implementation slices

### 23B-0 — Verified inventory and contracts

- locate and document existing bell UI, relationship command, endpoints, fields, notifications, streams, push paths, stores, and tests;
- update backend capability and callsite matrices;
- define exact eligibility per backend;
- add fixtures for representative responses;
- stop if no reliable mapping exists between subscription event and canonical status.

### 23B-1 — Schema, repository, and migration

- add account-scoped subscription generation, item, receipt, group, and position records;
- add unique indexes and deterministic canonical keys;
- add transactional upsert, merge, view, mark-unread, dismiss, purge, and repair commands;
- add resumable migration and corruption recovery;
- add IDOR and cross-account tests.

### 23B-2 — Notification projection and deduplication

- route every delivery source through one upsert command;
- merge notification IDs and source provenance;
- create one shared unread projection for Stories and Notifications;
- prove duplicate/out-of-order/concurrent convergence;
- preserve ordinary Notifications fallback.

### 23B-3 — Tray and accessible viewer

- implement Framework7 tray and canonical post viewer;
- implement meaningful-view threshold;
- implement group/item ordering and bounded history;
- integrate canonical engagement, moderation, CW, media, and conversation actions;
- implement keyboard, screen-reader, reduced-motion, and focus behavior.

### 23B-4 — Streaming, push, polling, and lifecycle reconciliation

- connect verified server notification/stream paths;
- treat push as a reconciliation hint;
- add bounded polling repair;
- handle edits, deletes, account moves, relationship changes, filters, and origin refresh;
- add cancellation, backoff, jitter, stale state, and multi-tab leases.

### 23B-5 — Hardening, rollout, and rollback proof

- adversarial/security suite;
- performance and storage benchmarks;
- offline/relaunch/account-switch/browser-termination tests;
- migration interruption and repair tests;
- staged feature rollout;
- explicit rollback drill proving no lost/double unread state.

### 23B-6 — Optional Durable Streams extension

Deferred until Phase 6A provider and authority gates pass.

- consume ordered subscribed-post lifecycle events through provider-neutral contracts;
- atomically apply event effects and checkpoints;
- support retention-expired snapshot reset;
- optionally synchronize coarse completion across devices under an approved private-data policy;
- retain notification/stream/poll fallback and local visual-position authority.

## 22. Test matrix

Unit tests:

- deterministic keys and alias normalization;
- generation boundaries and clock skew;
- eligibility for originals/replies/boosts/visibility values;
- meaningful-view timing and foreground checks;
- group ordering, counts, overflow, retention, and repair;
- mark unread/dismiss transitions;
- feature-disabled projection.

Integration tests:

- duplicate notification + stream + poll delivery creates one item;
- pending notification resolves to an existing canonical item;
- two tabs complete one item without duplicate remote mutation;
- Notifications and Stories unread badges remain identical;
- bell disable cancels future inclusion without deleting canonical posts;
- bell re-enable creates a new generation without old backlog;
- edit/delete/filter/block/account-move reconciliation;
- origin-authority update changes the shared status, not the queue identity;
- logout/account switch purges and cancels correctly;
- IndexedDB failure returns to Notifications fallback.

End-to-end tests:

- enable bell, receive post, open tray, view, clear ring/badge;
- view from Notifications and observe story ring clear;
- mark unread and observe one shared unread obligation;
- refresh/relaunch/offline restoration;
- keyboard/screen-reader/reduced-motion operation;
- new event arrives while viewing without moving current content;
- overflow continuation and author subscription controls.

Adversarial tests:

- forged account scope and notification ID;
- replay and out-of-order events;
- canonical URI collision/alias attack;
- private post delivered through malformed push;
- block or visibility change between prefetch and view;
- malicious media/redirect URL;
- decompression/resource exhaustion through fetched content where applicable;
- race between logout and receipt commit;
- service-worker or cache cross-account leakage.

## 23. Completion gates

Phase 23B is complete only when:

- current profile-bell behavior and backend differences are verified and documented;
- the phase identifier and domain names do not collide with Phase 23A or native Pixelfed Story concepts;
- one logical subscribed post produces one queue item across all delivery paths;
- Notifications and Stories share one unread obligation and never double count;
- viewing requires meaningful foreground presentation and is idempotent;
- canonical status content is not duplicated;
- subscription generations prevent accidental historical backfill;
- queue, retry, polling, media, storage, and diagnostics are bounded;
- account isolation, object authorization, moderation, and purge tests pass;
- ordinary Notifications remain a tested rollback path;
- accessibility and performance gates pass on target devices;
- all CI passes and no actionable review comments remain;
- documentation describes actual implementation state without claiming Pixelfed-style ephemerality or server capabilities that were not verified.

## 24. Explicit non-goals

Phase 23B does not:

- implement Pixelfed Stories;
- create or federate a new ActivityPub `Story` object;
- expire or delete ordinary statuses after viewing or after 24 hours;
- provide author viewer lists;
- notify an author that a subscriber viewed the post;
- require Mangane-operated media or Story infrastructure;
- guarantee cross-device seen state in the first implementation;
- replace the connected server’s subscription relationship;
- bypass server visibility, moderation, blocks, or filters;
- introduce opaque engagement ranking;
- duplicate status rendering, media handling, sanitization, or action logic.

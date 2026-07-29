# FediBuzz Custom Feed Source

Status: **Accepted target / Phase 23A source plan**

Last updated: 2026-07-29

## Purpose

FediBuzz is an optional broader-public candidate source for Mangane Custom
Feeds. It supplements the connected account's normal Home, local, list,
account-status, and hashtag APIs. It does not replace those sources and is not
an authority for complete Fediverse history.

The initial integration is intentionally client-side and does not require a
Mangane ActivityPub actor, public inbox, relay service, Cloudflare Tunnel,
ngrok endpoint, or separately operated ingestion backend.

## Verified external model

FediBuzz/BuzzRelay differs from a conventional push-only ActivityPub relay.
The public service advertises a Mastodon-compatible aggregate streaming
endpoint for direct consumption:

```text
https://fedi.buzz/api/v1/streaming/public
```

The public service also exposes generated ActivityPub relay actors for
hashtag- and instance-domain filtering, including URLs shaped like:

```text
https://relay.fedi.buzz/tag/{hashtag}
https://relay.fedi.buzz/instance/{domain}
```

The direct aggregate stream is the accepted initial Mangane integration. The
generated relay actors require an ActivityPub inbox and are therefore deferred
unless Mangane later gains an independently justified federation-ingestion
service.

Authoritative external references:

- <https://relay.fedi.buzz/>
- <https://github.com/astro/buzzrelay>
- <https://fedi.buzz/api/v1/streaming/public>

## Meaning of one shared connection

Mangane maintains at most one live connection to the FediBuzz aggregate stream
per active browser account context, not one connection to one origin instance
and not one connection per feed.

The statuses carried by that connection may originate from many Fediverse
instances observed by FediBuzz. FediBuzz is the aggregate transport source;
the post's original actor, instance, canonical object URI, and authorship remain
unchanged.

```text
many observed instances
          |
          v
FediBuzz aggregate public stream
          |
          v
one Mangane source connection
          |
          +--> Custom Feed A
          +--> Custom Feed B
          +--> Custom Feed C
```

"One connection" is a connection-budget and battery decision. It is not a
claim that the stream contains only one instance, and it is not a claim of
complete Fediverse coverage.

## Product wording

The normal creator interface must not expose relay terminology. The optional
source is presented as:

```text
Broader Fediverse
```

Supporting copy:

> Include additional public posts observed through participating Fediverse
> streams. Coverage varies and is not the entire Fediverse.

The product must never claim "the whole Fediverse," complete delivery, or a
complete historical archive.

## Relationship to Custom Feeds

FediBuzz is useful when a feed contains one or more of:

- selected hashtags;
- literal keywords;
- semantic topics;
- semantic exclusions;
- optional author-instance domain constraints.

It is normally unnecessary for a feed composed only of explicitly selected
accounts. Explicit account timelines and native list sources remain the more
predictable source for those feeds.

Posts accepted from FediBuzz render through the same normalized timeline and
post components as Home. The subscriber does not see a FediBuzz badge,
keyword highlight, semantic score, match reason, or search-result treatment.
Hashtags remain normally linkified.

Creator-only preview and diagnostics may state that a candidate was found
through Broader Fediverse discovery and explain the feed-rule decision.

## Source contract

The implementation must cross the Phase 1 protocol/runtime seams and expose a
feed-neutral event source rather than importing FediBuzz behavior into
presentation components.

```ts
interface FeedEventSource {
  readonly id: string;
  readonly capabilities: {
    live: boolean;
    replay: boolean;
    resumable: boolean;
    historical: boolean;
  };

  connect(input: {
    accountScope: AccountScope;
    cursor?: string;
    signal: AbortSignal;
  }): AsyncIterable<FeedSourceEvent>;
}

type FeedSourceEvent =
  | { type: 'status.upsert'; status: NormalizedStatus; cursor?: string }
  | { type: 'status.delete'; canonicalUri: string; cursor?: string }
  | { type: 'source.health'; state: FeedSourceHealth }
  | { type: 'source.reset-required'; reason: string };
```

The initial FediBuzz implementation declares:

```ts
{
  live: true,
  replay: false,
  resumable: false,
  historical: false,
}
```

It must not invent a durable cursor or imply recovery of events emitted while
the application was closed.

## Transport selection and capability probe

The currently advertised integration is the public HTTP streaming endpoint.
The implementation must verify the live service before enabling the source in
production:

1. cross-origin browser access from a real Mangane deployment origin;
2. response content type and event framing;
3. event names and payload schema;
4. heartbeat and idle-timeout behavior;
5. redirect behavior;
6. update and delete event behavior, if provided;
7. mobile browser reconnection behavior;
8. sustained connection and resource usage;
9. operator limits and acceptable-use requirements.

SSE is sufficient because delivery is one-way. WebSocket support may be probed
only as an optional transport optimization; Mangane must not depend on an
undocumented hosted WebSocket endpoint.

If direct browser use is blocked by CORS or materially incompatible behavior,
the source remains capability-unavailable. This phase does not silently add a
new proxy or backend service.

## Shared connection ownership

One account-scoped connection manager owns the live source.

Required behavior:

- connect only while at least one enabled feed needs Broader Fediverse input;
- share one connection across all eligible feeds in that account context;
- never open one connection per feed, hashtag, domain, tab, or route;
- prevent concurrent duplicate connection attempts;
- stop when no feed needs the source;
- cancel deterministically on logout, account switch, purge, or feature disable;
- coordinate multiple tabs so only the elected leader consumes the stream;
- distribute normalized accepted events to follower tabs through an approved
  same-origin mechanism such as `BroadcastChannel`;
- bind every cache, queue, checkpoint, diagnostic, and worker request to exact
  account and instance scope.

A tab-leadership failure must recover without producing duplicate persisted
records. Canonical URI deduplication remains mandatory.

## Candidate dispatch

Mangane must not compare every stream event against every Custom Feed.
Maintain bounded, account-scoped indexes for cheap candidate selection:

```ts
interface CustomFeedCandidateIndex {
  byHashtag: Map<string, Set<FeedId>>;
  byAuthorDomain: Map<string, Set<FeedId>>;
  byActorUri: Map<string, Set<FeedId>>;
  byLiteralTerm: Map<string, Set<FeedId>>;
  semanticFeeds: Set<FeedId>;
}
```

Processing order:

1. validate the event envelope and bounded payload;
2. normalize the Mastodon-compatible status through the canonical protocol
   adapter;
3. derive canonical object identity and reject malformed records;
4. apply global account-scope, domain, block, mute, visibility, sensitive
   content, and language policy;
5. use exact indexes to identify plausible feed candidates;
6. run literal and semantic feed rules only for plausible feeds;
7. deduplicate against Home, local, list, hashtag, account, and cached sources;
8. persist one canonical status plus feed-membership references only when at
   least one feed accepts the status;
9. emit updates to active timeline projections.

Subscriber policy always overrides the creator's feed definition.

## Semantic processing

Semantic inclusion and exclusion use the Phase 12-17 and Phase 19-20 contracts.
FediBuzz does not create a separate semantic engine.

Requirements:

- perform semantic work in a bounded worker path rather than the render thread;
- run cheap exact and lexical checks before model inference;
- batch compatible feed rules where safe;
- bound queue length, text length, model memory, evaluation time, and retained
  decisions;
- discard or degrade predictably under backpressure;
- never upload post text or private feed definitions to an external model
  without an independently accepted privacy boundary;
- preserve lexical/hashtag operation when semantic capability is unavailable.

## Persistence and retention

Mangane must not persist the raw aggregate stream.

```text
candidate matches no active feed -> discard
candidate matches one or more feeds -> store once, reference from each feed
```

Persisted records include:

- the normalized canonical status;
- source provenance identifying FediBuzz as one candidate source;
- feed membership/match references;
- feed-rule and semantic-model versions where applicable;
- received, updated, and expiry timestamps.

Retention is bounded by age, per-feed entries, total byte budget, and device
storage capability. Exact production limits require measurement and must be
configurable. Eviction must preserve currently visible anchors and user-owned
bookmarks where those records have independent authority.

## Deduplication

The same post may arrive through multiple server and stream paths. Deduplicate
primarily by canonical ActivityPub object URI. Server-local status ID is never
a global identity.

When a post already exists, merge source provenance and update the canonical
record according to the Phase 5 record/version contract. Never render duplicate
copies merely because one came from FediBuzz.

## Updates and deletions

Where the upstream provides edit or delete events:

- update the canonical record idempotently;
- re-evaluate affected keyword, topic, and exclusion rules;
- add or remove feed entries transactionally;
- remove all feed references after a verified deletion while preserving the
  required tombstone;
- tolerate replayed or out-of-order events.

If the upstream does not provide a required lifecycle event, the capability
must be recorded as degraded. Mangane must not claim deletion-complete or
history-complete behavior.

## Connection lifecycle and retry

Use an explicit state machine:

```text
idle -> connecting -> connected
                    -> reconnecting
                    -> offline
                    -> paused
                    -> unsupported
```

Retry requirements:

- exponential backoff with full jitter;
- bounded maximum delay and attempt telemetry without content leakage;
- honor `Retry-After` and provider rate limits where available;
- reset only after a stable healthy interval;
- do not retry permanent schema, policy, or unsupported-capability failures;
- pause while the browser reports offline;
- avoid reconnect storms after visibility or network changes;
- keep the rest of the feed usable during source failure.

## Closed-app and background behavior

The client-only source is live only while Mangane is running and the browser
permits the connection. Service workers and installed-PWA status do not provide
a guarantee of continuous collection.

On reopen, Mangane reconnects at the current live edge. Ordinary account, list,
hashtag, Home, and local APIs provide pageable history where supported;
FediBuzz remains supplemental broader discovery.

The UI must not show exact FediBuzz-derived unread counts unless they can be
proved from durable history. A generic "new posts available" indicator is
acceptable when backed by actual local state.

## Failure and fallback

Failure of FediBuzz must not fail a Custom Feed. Continue with:

- account timelines;
- native list timelines;
- synchronized list membership;
- Home and local candidates;
- native hashtag timelines;
- locally cached accepted posts.

Creator diagnostics may report:

> Broader Fediverse discovery is temporarily unavailable.

Ordinary subscribers should receive a subtle partial-refresh state only when it
materially affects the feed.

## Privacy, moderation, and security

Required controls include:

- account-scoped storage and deterministic purge;
- strict runtime schema validation;
- bounded payload, text, media, queue, cache, and worker sizes;
- safe HTML normalization through the canonical sanitizer boundary;
- no active-content execution from incoming posts;
- no authenticated browser request to user-controlled origins;
- subscriber and instance block/mute/domain policy before display;
- privacy-safe diagnostics without post text, topics, member identities,
  handles, URLs containing secrets, or access tokens;
- no use of FediBuzz to evade the connected instance's known moderation policy;
- operator endpoint and feature control through allowlisted configuration, not
  arbitrary user-supplied streaming URLs.

## Feature flag and rollback

Ship behind a registered flag such as:

```text
customFeeds.fedibuzzSource
```

The flag owner, rollout state, expiration/review date, and rollback value must
be recorded in the canonical feature-flag registry.

Rollback disables the live source, closes the connection, clears transient
queues, and leaves ordinary feed sources and previously accepted canonical
records intact subject to retention policy.

## Implementation slices

### FB.1 - Contract and live capability probe

- add the feed-event-source contract and FediBuzz capability descriptor;
- build an abortable browser probe and fixture-based parser tests;
- record CORS, event framing, lifecycle events, and provider limits;
- do not expose the product toggle until the probe passes.

### FB.2 - Shared account-scoped connection

- one connection manager;
- tab leadership and follower-tab distribution;
- lifecycle state machine, cancellation, backoff, and health state;
- logout, account-switch, and purge integration.

### FB.3 - Normalization, dispatch, and persistence

- canonical status normalization;
- candidate indexes;
- moderation and capability checks;
- URI deduplication and source-provenance merge;
- matched-only persistence and bounded retention.

### FB.4 - Semantic worker integration

- cheap prefiltering;
- bounded semantic evaluation;
- topic/exclusion rule versions;
- degraded lexical mode;
- creator-only match diagnostics.

### FB.5 - Product integration and hardening

- Broader Fediverse creator control;
- feed preview and partial-source states;
- normal subscriber rendering;
- performance, battery, memory, accessibility, and adversarial testing;
- operator-disable and rollback verification.

## Explicit non-goals

- running a Mangane relay;
- exposing an ActivityPub actor or inbox;
- Cloudflare Tunnel or ngrok;
- following generated FediBuzz relay actors in the initial implementation;
- one connection per feed, hashtag, domain, or tab;
- retaining the raw public stream;
- guaranteed background collection;
- exact replay after suspension;
- globally complete Fediverse coverage;
- bypassing subscriber or instance moderation;
- making FediBuzz a required dependency for Custom Feeds.

## Exit criteria

The FediBuzz source is complete only when:

1. the live hosted endpoint has passed the documented browser capability probe;
2. exactly one account-scoped leader connection is used regardless of eligible
   feed count;
3. account switch, logout, offline, visibility, multi-tab, and purge paths close
   or transfer ownership safely;
4. malformed, oversized, duplicate, edited, deleted, and out-of-order fixtures
   reconcile idempotently;
5. only statuses accepted by at least one feed are persisted;
6. canonical URI deduplication prevents copies across all source types;
7. subscriber moderation and server policy are applied before display;
8. semantic unavailability degrades to lexical/hashtag behavior;
9. FediBuzz outage leaves every feed usable through remaining sources;
10. the UI accurately describes variable coverage and non-durable closed-app
    behavior;
11. storage, CPU, memory, network, battery, and rendering budgets pass on target
    mobile devices;
12. security, privacy, account-isolation, accessibility, and rollback tests pass;
13. documentation and implementation remain in the same clean, reviewed PR.

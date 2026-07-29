# Phase 8A Origin Authority Reconciliation

Status: **Accepted target / queued after Phase 7 and the Phase 8 timeline baseline**

Last updated: 2026-07-29

## Purpose

Improve the freshness and accuracy of remote-post content, reply context, reply
counts, favourite counts, and boost/repost counts by consulting the server that
originated the canonical post whenever doing so is safe and technically
available.

The originating server is the best available public aggregate authority for an
object because ActivityPub directs replies, Likes, Announces, Updates, and
Deletes toward the actor responsible for that object. It is not guaranteed to
have a mathematically complete view of the entire Fediverse, and an
unauthenticated origin response is not authoritative for the connected user's
private viewer state.

This phase therefore implements **origin-authority reconciliation**, not blind
cross-origin polling and not a claim of globally exact metrics.

## Terminology

- **Connected server**: the instance where the Mangane user is authenticated.
- **Origin server**: the host controlling the canonical ActivityPub object URI
  for the original post.
- **Origin representation**: a representation fetched from the origin server,
  usually ActivityStreams JSON or a compatible public API status.
- **Connected representation**: the connected server's federated copy and
  viewer-aware API status.
- **Public aggregate fields**: content revision, deletion/tombstone state,
  public poll state, replies collection/count, likes/favourites count, and
  shares/boosts count where supplied.
- **Viewer fields**: whether the connected user has favourited, boosted,
  bookmarked, muted, pinned, filtered, or is permitted to see/interact with the
  object.

## Authority model

Mangane keeps field-level authority rather than replacing one status object with
another wholesale.

### Origin-preferred fields

Where verified and visible:

- canonical object identity and origin host;
- current public content and edit timestamp;
- deletion or tombstone state;
- public poll options, expiry, and aggregate vote counts;
- origin-maintained replies collection or count;
- origin-maintained likes/favourites aggregate;
- origin-maintained shares/Announce aggregate.

### Connected-server-authoritative fields

- access authorization and visibility available to the signed-in user;
- `favourited`, `reblogged`, `bookmarked`, `muted`, `pinned`, and similar
  viewer-specific flags;
- connected-server moderation, filters, domain policy, and relationship state;
- local IDs required for authenticated API actions;
- action permissions and write endpoints;
- private or followers-only context known through the connected account.

### Local canonical authority

- source provenance;
- merge revisions and observed timestamps;
- tombstones and conflict records;
- timeline membership/order and scroll anchors;
- pending local mutations and optimistic state;
- the last successfully verified representation for offline use.

An origin refresh must never clear a viewer-specific flag merely because an
unauthenticated origin representation lacks that field.

## Accuracy limitations

Origin-server totals are normally the strongest public estimate because the
origin is responsible for the object's `likes`, `shares`, and `replies`
collections. They can still be incomplete or access-dependent because:

- remote servers may fail or refuse delivery;
- activities may be delayed, filtered, rejected, or later undone;
- implementations may not expose all collections or counts;
- replies and reactions may have audiences the requesting user cannot see;
- moderation may hide or remove activities;
- different software counts repeated Announces or reactions differently;
- an origin may be offline, migrated, compromised, or stale.

UI language must not label counts as globally exact. The product should simply
show the freshest verified value and expose source diagnostics only in developer
or creator tooling.

## Origin discovery

The origin is derived from validated canonical identity, not from arbitrary
links in post HTML.

Preferred identity order:

1. canonical ActivityPub object URI from the normalized status;
2. verified original status URL when it resolves to the same object;
3. attributed actor origin only when object identity is absent and the protocol
   adapter explicitly supports that fallback.

Requirements:

- HTTPS in production, with only existing approved loopback development
  exceptions;
- reject credentials, fragments, non-HTTP schemes, IP literals where policy
  forbids them, localhost/private/link-local destinations, and malformed IDNs;
- enforce the central URL and destination policy;
- follow only bounded redirects and revalidate every redirect destination;
- prevent DNS rebinding and SSRF-style destination changes in any trusted proxy
  or native wrapper;
- never use a display URL, attachment URL, mention, or HTML link as origin
  authority.

## Retrieval strategies

Strategies are capability-ordered and independently observable.

### Strategy A: direct ActivityPub object retrieval

For public objects, request the canonical URI with an ActivityStreams-compatible
`Accept` value when browser CORS and origin policy permit.

Expected media types may include:

```text
application/activity+json
application/ld+json; profile="https://www.w3.org/ns/activitystreams"
```

Requirements:

- strict content type, schema, object-ID, actor, and origin validation;
- verify the returned object ID matches the requested canonical URI after
  approved normalization;
- reject active HTML or unrelated JSON returned at the object URL;
- use conditional requests with `ETag` or `Last-Modified` where available;
- bound response bytes, nesting, collections, strings, and recursive fetches;
- do not recursively crawl arbitrary replies or collection links.

Direct ActivityPub retrieval is often limited by CORS and authorization. Failure
is a normal capability outcome, not a reason to weaken browser security.

### Strategy B: origin-compatible public API

When the origin advertises a compatible public status API and Mangane can safely
resolve the canonical object to an origin-local status ID, fetch the origin's
public status and context endpoints.

Mangane must not assume a remote ID from the connected server is valid on the
origin. Resolution requires a verified mapping keyed by canonical URI.

This path remains optional because some origins require authentication, disable
public API access, omit CORS, or run non-Mastodon software.

### Strategy C: connected-server resolution and refresh

Use the authenticated connected server to resolve or refresh the canonical URI
through its supported Mastodon/Akkoma/Pleroma capability, including search
resolution or status/context endpoints.

This representation may lag the origin but provides:

- viewer authorization;
- local action IDs;
- moderation/filter state;
- private context available to the user;
- the reliable fallback when direct origin access is unavailable.

### Strategy D: cached canonical state

When neither server can refresh, retain the last verified local record and mark
its aggregate fields stale internally. Do not zero counts or fabricate a fresh
state.

## Origin refresh contract

```ts
interface OriginStatusAuthority {
  resolve(input: {
    accountScope: AccountScope;
    canonicalUri: string;
    signal: AbortSignal;
  }): Promise<OriginResolution>;

  refresh(input: {
    accountScope: AccountScope;
    resolution: OriginResolution;
    validators?: HttpValidators;
    signal: AbortSignal;
  }): Promise<OriginStatusObservation>;
}

interface OriginStatusObservation {
  canonicalUri: string;
  originHost: string;
  observedAt: string;
  representationKind: 'activitypub' | 'mastodon-api' | 'compatible-api';
  validators?: HttpValidators;
  publicRevision?: NormalizedPublicStatusRevision;
  aggregate?: {
    replies?: number;
    favourites?: number;
    boosts?: number;
  };
  replies?: NormalizedReplyReference[];
  tombstone?: boolean;
}
```

The interface returns an observation. The canonical repository decides how to
merge it with connected-server and local state.

## Merge and conflict policy

Merge by field authority and observation freshness.

Rules:

- canonical URI is the global identity; origin and connected local IDs remain
  provenance-specific aliases;
- a verified origin edit may replace public content while preserving connected
  viewer flags and local timeline membership;
- a verified origin tombstone wins for public display, while a tombstone record
  preserves identity and purge obligations;
- origin aggregate counts may replace older connected aggregate counts when the
  origin observation is newer and semantically compatible;
- connected-server counts remain when the origin omits the field;
- never convert absence into zero;
- never reduce a count solely because a partial or access-filtered collection
  exposes fewer visible items;
- pending optimistic local actions remain separate until the connected server
  confirms them;
- contradictory actor, object, or edit provenance fails closed and enters a
  bounded diagnostic/conflict path.

## Reply reconciliation

A conversation may be fragmented across servers. Mangane should merge:

- connected-server context;
- origin replies collection references or origin context;
- locally cached replies received from timelines/notifications;
- approved FediBuzz or other discovery candidates only when they canonically
  reply to the object.

Deduplicate by canonical reply URI. Apply visibility, blocks, mutes, filters,
domain policy, and conversation controls before display.

The origin replies count and the number of replies currently renderable to the
user may differ. Mangane may show the origin aggregate count while rendering only
the authorized subset, but must not imply hidden replies can be fetched.

Recursive reply retrieval is bounded by depth, count, bytes, time, and origins.
There is no unbounded cross-instance crawler.

## Adaptive polling policy

Mangane does not poll every post continuously.

High-priority refresh conditions:

- a status detail/conversation screen is visible;
- a post is currently visible and receiving active local updates;
- the user explicitly refreshes;
- a poll is near expiry or recently completed;
- a pending local action needs reconciliation;
- a stream event indicates an edit or interaction change.

Low-priority or stopped conditions:

- post is far outside the viewport;
- route is hidden or application is backgrounded;
- device is offline, constrained, or in data-saver mode;
- origin is rate-limiting or unhealthy;
- content is old and interaction velocity is low;
- the object is deleted, inaccessible, or permanently unsupported.

Suggested adaptive intervals are policy outputs, not fixed constants. They must
use exponential backoff with full jitter, honor `Retry-After`, and reset only
after a stable healthy response.

One scheduler coordinates origin requests across tabs and visible statuses.
Hard limits apply per origin and globally.

## Streaming interaction

Connected-server streaming remains the fastest viewer-aware source. Origin
polling reconciles fields that may be stale in the federated copy.

```text
connected stream event
  -> update local/connected representation
  -> schedule bounded origin verification when useful
  -> field-level merge
```

No origin poll should block rendering a connected-server update.

## Caching and validators

Store per-object/per-origin validators and health state:

```ts
interface OriginRefreshState {
  canonicalUri: string;
  originHost: string;
  etag?: string;
  lastModified?: string;
  lastCheckedAt?: string;
  lastChangedAt?: string;
  nextEligibleAt?: string;
  failureClass?: string;
  capability: 'supported' | 'degraded' | 'unsupported' | 'unknown';
}
```

Use stale-while-revalidate behavior locally. A `304 Not Modified` updates
freshness metadata without rewriting canonical content.

Purge and account-switch behavior must prevent cross-account viewer state from
being associated with shared public observations. Public origin observations may
be shared locally only through an explicit approved account-neutral cache that
contains no viewer state.

## Security and privacy

Required controls:

- central safe-URL policy and redirect revalidation;
- strict CORS compliance in browser mode;
- no connected-account bearer token sent to an origin server;
- no cookies or credentials on cross-origin public fetches;
- no arbitrary user-configured polling origins;
- bounded bodies, collections, recursion, timeouts, and concurrency;
- safe HTML normalization through the canonical sanitizer;
- content-signature/provenance checks where supported;
- no logging of private content, tokens, exact sensitive URLs, or reply bodies;
- subscriber moderation always applies after origin reconciliation;
- per-origin circuit breakers and abuse throttles;
- fail closed on origin mismatch, redirect ambiguity, or schema confusion.

## Offline and degraded behavior

When offline or origin access fails:

- display the last canonical local record;
- continue connected-server actions when available;
- retain viewer-specific state;
- mark aggregate freshness internally;
- retry only when policy permits;
- never replace missing data with zero or remove replies based on a failed fetch.

Origin reconciliation is an enhancement, not a required dependency for reading,
posting, or moderation.

## Feature flags and rollback

Ship behind independently owned flags such as:

```text
status.originAuthorityRefresh
status.originReplyReconciliation
```

Rollback:

- stops origin scheduling and direct requests;
- preserves canonical records and connected aliases;
- retains safe tombstones already verified;
- falls back to connected-server streaming/polling and local cache;
- clears origin-only validators and health metadata according to retention
  policy;
- does not alter viewer flags or pending mutations.

## Implementation slices

### 8A.1 Authority and capability contracts

- canonical URI/origin validation;
- field-level authority matrix;
- origin observation and typed-error contracts;
- protocol fixtures for ActivityPub and compatible API representations.

### 8A.2 Safe direct-origin probe

- CORS/public-access capability testing;
- strict ActivityStreams media/schema validation;
- redirect, DNS, body, recursion, and timeout controls;
- conditional requests and per-origin health state.

### 8A.3 Connected-server resolver

- canonical URL resolution through supported backend APIs;
- origin-local and connected-local ID alias storage;
- viewer-aware status/context refresh;
- fallback and unsupported-capability reporting.

### 8A.4 Field-level reconciliation

- transactional merge of edits, tombstones, polls, and aggregates;
- preservation of viewer state and optimistic mutations;
- contradiction and stale-observation handling;
- provenance and deduplication tests.

### 8A.5 Reply union

- origin/connected/local reply-source union;
- canonical reply deduplication;
- bounded traversal and authorization filtering;
- count-versus-visible-subset UI behavior.

### 8A.6 Adaptive scheduler

- viewport/detail/action priority;
- per-origin/global concurrency and token budgets;
- backoff, jitter, `Retry-After`, circuit breaker, and tab leadership;
- offline, background, data-saver, and battery-aware behavior.

## Test requirements

### Unit

- canonical URI and origin derivation;
- field authority and merge precedence;
- missing versus zero counts;
- alias mapping;
- validators and 304 handling;
- adaptive interval classification;
- typed permanent/transient failure behavior.

### Integration

- origin edit plus connected viewer state;
- origin tombstone;
- stale connected aggregate replaced by newer origin aggregate;
- origin missing a count;
- origin and connected context union;
- CORS denial fallback;
- rate limiting and circuit recovery;
- offline/reopen behavior;
- tab leadership and account switch.

### Security/adversarial

- canonical-URI SSRF and DNS rebinding attempts;
- malicious redirects;
- origin returning a different object ID or actor;
- oversized/deep ActivityStreams documents;
- recursive replies loops;
- HTML returned as JSON;
- credential leakage to origin;
- cross-account viewer-state contamination;
- malicious count overflow/negative values;
- origin spoofing and Unicode hostname confusion.

### Performance/accessibility

- no per-card polling storm during fast scroll;
- scrolling remains responsive during reconciliation;
- bounded memory and worker/network queues;
- refresh indicators do not produce repetitive screen-reader announcements;
- stale data remains readable without distracting errors.

## Explicit non-goals

- claiming any server has globally exact federation counts;
- sending the user's connected-server token to the origin;
- replacing viewer-aware connected-server state with public origin JSON;
- polling every timeline item continuously;
- crawling the entire reply graph;
- bypassing CORS with an unapproved generic proxy;
- trusting server-local status IDs across instances;
- using origin refresh to bypass moderation or private visibility.

## Exit criteria

Phase 8A is complete only when:

1. canonical origin discovery is strict and safe;
2. origin, connected, and local authority are defined per field;
3. viewer-specific flags and permissions cannot be overwritten by public origin
   observations;
4. direct origin retrieval is capability-gated and has a connected-server
   fallback;
5. edits, tombstones, polls, counts, aliases, and reply unions reconcile
   transactionally and idempotently;
6. missing fields never become fabricated zeros;
7. polling is viewport/detail-aware, bounded, conditional, backoff-driven, and
   coordinated across tabs;
8. SSRF, redirect, CORS, credential leakage, recursion, oversized input, and
   cross-account tests pass;
9. feeds and conversations remain usable when all origin paths fail;
10. mobile network, CPU, memory, battery, and scroll budgets pass;
11. documentation and UI avoid claims of globally exact counts;
12. CI and review are clean.

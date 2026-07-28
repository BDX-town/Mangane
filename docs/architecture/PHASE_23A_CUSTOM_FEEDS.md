# Phase 23A Custom Feeds

Status: **Accepted target / queued**

Last updated: 2026-07-28

## Placement

Custom Feeds are a new Phase 23A rather than an expansion of Phase 8.
Renumbering completed or established phases would create avoidable roadmap
drift.

The complete feature depends on:

- Phase 5 canonical records, feed membership/order, revisions, and storage;
- Phase 6 durable, idempotent synchronization and bounded retry;
- Phase 7 feed-neutral application boundaries;
- Phase 8 the shared renderer, timeline state, and pinned-feed shell;
- Phases 12–17 lexical, semantic, topic, fusion, and explanation contracts;
- Phases 19–20 local personalization and semantic-filter controls;
- Phase 23 lists, profiles, settings, and remaining high-use migrations.

Phase 18 Gist synthesis is completed earlier in the canonical sequence but is
not a direct Custom Feeds dependency.

Some contracts and private local prototypes may be developed earlier, but the
phase cannot be called complete until its dependencies and exit criteria are
met.

## Outcome

Users can create playlist-like timelines from selected accounts, server lists,
hashtags, literal keywords, semantic topics, and optional broad candidate
sources. Public or unlisted feeds can be discovered and subscribed to; private
feeds remain creator-only. Subscription and pinning are separate. Pinned feeds
reuse the Phase 8 renderer and retain independent state.

Custom Feeds never alter the follow graph and may include accounts the viewer
does not follow when the connected server can resolve and authorize their
visible posts.

## Non-negotiable product rules

- Creation and tuning are separate from everyday reading.
- Feed intelligence changes selection, not post-card presentation.
- Lists remain account collections and may be copied or synchronized as feed
  sources; they do not become Custom Feeds.
- Subscription saves a feed; pinning adds a subscribed feed to Home.
- Unpinning retains the subscription; unsubscribing also unpins and applies
  the documented cache policy.
- The composer creates ordinary Fediverse posts and never implies posting
  “into” a Custom Feed.
- Feed artwork and creator identity belong to discovery, profile, management,
  and sharing surfaces, not a persistent banner above the timeline.
- Subscriber blocks, mutes, filters, visibility, server policy, and domain
  restrictions always override creator rules.

## Required authority boundary

The current repository is a frontend client and does not contain a verified
server authority for global feed publication, discovery, subscriber counts, or
revision distribution. Those capabilities must not be simulated with
client-only trust.

Before stateful public/unlisted publication or any private-feed operation
ships, adopt and document one of:

1. a versioned server protocol exposed by the connected instance;
2. a separately operated, authenticated feed registry with explicit privacy,
   moderation, abuse, retention, and availability policies.

The chosen authority must authenticate the acting account and authorize every
create, edit, publish, delete, subscribe, and private-read operation. A
client-supplied creator ID or account-context ID is never sufficient.

A portable signed recipe may supplement either authority for transporting a
public feed definition and verifying its authorship and integrity. A recipe
alone cannot authenticate subscribers, enforce private access, revoke a
published feed, distribute revisions authoritatively, or authorize stateful
operations. It is therefore never a substitute for the server or registry
authority required above.

Private local feeds can precede that authority, but the UI must label them
accurately and must not claim community publication or cross-device
synchronization.

## Feed model

A feed has:

- a stable public identity where published;
- an authenticated creator identity;
- schema and revision versions;
- name, description, square cover, and optional banner;
- public, unlisted, or private visibility;
- draft or published state;
- people, copied/synchronized lists, hashtags, keywords, topics, exclusions,
  and optional followed-account or local candidates;
- original/reply/repost/media/language controls;
- disclosure settings that never reveal private examples or hidden members;
- latest-first ordering for the initial release.

Canonical status records remain separate from:

- feed definitions and revisions;
- member identities and multi-origin provenance;
- subscriptions and pin order;
- per-source cursors and checkpoints;
- timeline entries and overflow candidates;
- creator-only relevance decisions;
- independent view state.

Every persisted record is schema-versioned and account scoped.

## Identity, membership, and reconciliation

Member identity uses canonical actor URI plus server-local resolution data.
Storing only a local numeric ID is insufficient.

Membership provenance supports multiple simultaneous origins so removing a
synchronized list does not remove an account also added manually.

Migration handling must:

- verify the strongest available old/new actor relationship;
- bound traversal and detect cycles, conflicts, and duplicates;
- retain logical membership identity and minimal history;
- invalidate affected cursors and deduplicate old/new actor content;
- require creator review after five automatic migration hops.

Lookup failure is not deletion. Explicit deletion and suspension produce
tombstones; ambiguous failure becomes temporarily unavailable and retries with
bounded exponential backoff, full jitter, rate-limit awareness, and reset on
success. Permanent authorization, validation, block, or not-found outcomes do
not retry indefinitely.

## Retrieval and assembly

Protocol-aware source adapters cover:

- explicit account timelines;
- native list timelines;
- synchronized list membership;
- hashtag timelines;
- followed-account and local candidates;
- future native Custom Feed endpoints.

Mastodon-compatible servers generally require followed accounts for native
lists, so non-followed accounts require client-managed membership and
authorized account-status retrieval. Akkoma/Pleroma adapters may use their
broader list capabilities where verified.

Assembly:

1. fetch bounded pages with cancellable, per-host concurrency;
2. validate and normalize records;
3. enforce authorization, visibility, subscriber moderation, and server
   policy;
4. apply content-type, hashtag, and literal rules;
5. apply semantic inclusion/exclusion when available;
6. deduplicate by canonical object URI with a scoped fallback;
7. order deterministically;
8. emit a stable page while retaining per-source cursors and overflow.

Partial source failure returns successful and cached results with a recoverable
status. It does not replace the whole feed with a fatal error.

## Semantic and privacy contract

Semantic processing is local-first, versioned, bounded, and optional.
Normalized plain text may include intentionally selected post text, content
warnings, hashtags, alt text, language, and permitted quote/preview fields.
Unsanitized HTML is never model input.

If the local model is unavailable, the feed degrades to lexical and hashtag
matching and reports the degraded mode. A remote model is never contacted
without an approved privacy boundary, explicit disclosure, minimization, and
transport controls.

Semantic failure never bypasses authorization, visibility, moderation,
blocks, mutes, or server policy. Internal scores, thresholds, negative
examples, hidden membership, and moderation safeguards are not exposed to
subscribers.

## Security and abuse controls

Threats include IDOR, forged creator identity, unauthorized revisions,
private-feed access, stale-revision replay, SSRF, unsafe URLs, malicious
artwork, HTML injection, migration forgery, membership resurrection, model
cache poisoning, cross-account leakage, subscriber-count manipulation,
revision races, hidden-member disclosure, retry amplification, and abusive
fan-out.

Required controls:

- server-side or trusted-authority object-level authorization for every
  resource and action;
- opaque stable IDs plus authenticated ownership checks, not secrecy of IDs;
- optimistic concurrency or equivalent revision preconditions;
- signed/versioned definitions where recipes cross authority boundaries;
- strict URL scheme, host, redirect, DNS rebinding, size, content-type, and
  timeout controls in any server-side resolver or image fetcher;
- no authenticated browser request to a user-controlled origin;
- image dimension/byte limits, safe decoding, generated filenames, and active
  content rejection;
- account-scoped encryption/key policy if sensitive private definitions ever
  leave the device;
- bounded definitions, members, sources, payloads, concurrency, queues,
  retries, and cache sizes;
- privacy-safe diagnostics without content, member identities, topics, or
  tokens;
- fail-closed schema validation and tombstones that stale sync cannot
  resurrect;
- transaction or compare-and-swap handling for list sync and feed revisions.

## Slices

### 23A.1 — Contracts and private local feeds

- stable schema, identity, revisions, membership provenance, subscriptions,
  pins, entries, checkpoints, and view state;
- private local creation/editing and creator preview;
- manual people, hashtags, keywords, and list copy;
- migrations, purge, quota, and account-isolation tests.

### 23A.2 — Protocol sources and resilient assembly

- non-followed account resolution;
- synchronized lists;
- protocol adapters;
- canonical-URI deduplication;
- bounded fan-out, cancellation, rate-limit handling, backoff, partial results,
  and reconciliation.

### 23A.3 — Library, discovery-ready identity, and Home pinning

- Feeds destination with Pinned, Subscribed, Created by You, and Discover
  sections;
- feed profile, artwork, creator identity, share contract, and accessible pin
  reordering;
- Phase 8 renderer and independent anchor-based restoration.

### 23A.4 — Publication, discovery, and subscriptions

- implement only after a trusted authority decision;
- public/unlisted/private authorization;
- revision distribution and replay protection;
- discovery/search, subscriber privacy, deletion, moderation, and abuse
  response;
- cross-client and cross-account conformance tests.

### 23A.5 — Semantic topics and tuning

- local-first topics and exclusions;
- Loose, Balanced, and Strict product controls mapped to versioned policy;
- creator-only diagnostics and positive/negative examples;
- lexical fallback and model lifecycle controls;
- relevance, overblocking, privacy, and adversarial tests.

## Explicit deferrals

- nested Boolean query builders;
- opaque engagement ranking;
- feed monetization or ranking marketplace;
- collaborative editing;
- continuous browser background crawling;
- guaranteed global Fediverse completeness;
- notifications triggered by semantic matches;
- arbitrary server-independent federation ingestion.

## Exit criteria

Phase 23A is complete only when:

1. private, public, and unlisted behavior accurately reflects the selected
   authority and capability support;
2. create, edit, publish, delete, subscribe, pin, unpin, unsubscribe, and
   private-read paths pass ownership and cross-account IDOR tests;
3. non-followed accounts work through verified adapters without changing the
   follow graph;
4. list copy and synchronization preserve multi-origin membership;
5. migration, deletion, suspension, outage, rate-limit, revision-race, and
   partial-source fixtures reconcile safely;
6. hashtags, keywords, topics, and exclusions are predictable and creator
   preview is private;
7. subscriber policy always overrides creator selection;
8. pinned feeds use the shared renderer and independent scoped restoration;
9. storage, request fan-out, latency, memory, battery, and accessibility
   budgets pass;
10. documentation distinguishes current, degraded, unsupported, and deferred
    behavior, and CI/review are clean.

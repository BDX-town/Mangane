# Phase 6A Durable Streams

Status: **Accepted target / queued after Phase 6 foundations**

Last updated: 2026-07-29

## Placement

Durable Streams is a separate Mangane reliability and synchronization phase.
It is not part of FediBuzz, and FediBuzz is not a prerequisite for this phase.

Phase 6A follows the Phase 6 durable outbox and reconciliation foundations and
uses:

- Phase 1 account, protocol, runtime, error, and capability boundaries;
- Phase 4 PWA offline, update, purge, and service-worker contracts;
- Phase 5 canonical records, versioned storage, checkpoints, tombstones, and
  account-scoped transactions;
- Phase 6 idempotency, retry classification, ordered reconciliation, and
  conflict behavior;
- Phase 7 feed-neutral and module-neutral application boundaries where migrated
  consumers are involved.

Individual read-only experiments may begin earlier, but the phase cannot be
called complete until Phase 6 invariants are present and the selected stream
provider passes the authority, privacy, retention, and rollback gates below.

## Outcome

Mangane gains an optional provider-neutral durable event layer for ordered,
resumable, replayable application events. A browser may disconnect, refresh,
move between networks, be suspended, or reopen later and continue from a saved
opaque offset when the selected stream retains that history.

The phase is broader than Custom Feeds. Approved uses may include:

- canonical status create/update/delete delivery;
- notification and conversation reconciliation;
- account relationship and migration events;
- Custom Feed definition revisions and, where justified, matched feed events;
- local-first index journal distribution;
- multi-device preference and progress synchronization;
- long-running intelligence-job progress;
- reliable push-notification input;
- operator or moderation-policy revision delivery.

Every use must have its own data-minimization, authority, retention, access,
and failure contract. Adopting the transport does not authorize every possible
event type.

## External protocol

Durable Streams is an open HTTP protocol for persistent ordered streams with
opaque offsets, historical reads, and live tailing. The TypeScript client and
protocol are evaluated from the project-maintained sources:

- <https://electric.ax/blog/2025/12/09/announcing-durable-streams>
- <https://github.com/durable-streams/durable-streams>
- <https://github.com/durable-streams/durable-streams/blob/main/PROTOCOL.md>

Mangane must pin a reviewed implementation version and conformance evidence
before production use. Blog claims are not sufficient implementation evidence.

## Core distinction

Durable Streams provides replay only when an external durable producer and
stream authority continue to retain events while the PWA is unavailable.
Adding a browser client library cannot make an ephemeral upstream stream
durable by itself.

```text
ephemeral upstream
      |
      v
continuous authorized producer
      |
      v
durable ordered stream
      |
      v
Mangane PWA resumes by opaque offset
```

For example, making FediBuzz delivery durable would require a continuously
running producer outside the browser that consumes FediBuzz and appends bounded
validated events to a protected stream. Phase 23A's initial client-only
FediBuzz source therefore remains non-durable and independent.

## Architectural decision gate

Before implementation, record an ADR selecting one of:

1. a connected-instance Durable Streams capability;
2. a Mangane-operated authenticated stream authority;
3. a reviewed hosted Durable Streams provider plus a separately secured
   producer;
4. a self-hosted user/operator provider behind the same capability contract.

The ADR must define:

- stream ownership and tenant isolation;
- who may append, read, create, delete, and change retention;
- authentication and token rotation;
- public, private, account, and device stream boundaries;
- producer placement and secret custody;
- regional/data-residency implications;
- retention and deletion guarantees;
- cost and quota controls;
- availability objectives;
- portability and provider-exit strategy;
- audit and abuse response;
- exact rollback behavior.

No stream write credential may be embedded in the public PWA.

## Provider-neutral contracts

Domain and presentation code consume application events rather than Durable
Streams protocol responses.

```ts
interface DurableEventProvider {
  readonly id: string;
  readonly capabilities: DurableEventCapabilities;

  read(input: {
    stream: StreamIdentity;
    offset?: OpaqueStreamOffset;
    limit?: number;
    signal: AbortSignal;
  }): Promise<DurableEventBatch>;

  tail(input: {
    stream: StreamIdentity;
    offset?: OpaqueStreamOffset;
    signal: AbortSignal;
  }): AsyncIterable<DurableEventBatch>;

  append?(input: AuthorizedAppendRequest): Promise<AppendReceipt>;
}

interface DurableEventCapabilities {
  replay: boolean;
  live: boolean;
  append: boolean;
  retentionIntrospection: boolean;
  idempotentProducer: boolean;
}
```

Offsets are opaque branded values. Mangane must never parse, increment, compare,
or derive ordering from their internal representation.

```ts
type OpaqueStreamOffset = string & {
  readonly __brand: 'OpaqueStreamOffset';
};
```

## Stream identity and scope

A stream identity must include explicit authority and scope rather than an
untrusted arbitrary URL.

```ts
interface StreamIdentity {
  providerId: string;
  streamId: string;
  accountScopeId?: string;
  resourceType: StreamResourceType;
  resourceId?: string;
}
```

Allowed providers and URL templates come from trusted configuration or a
verified connected-instance capability. Users must not be able to make Mangane
send authenticated requests to arbitrary stream origins.

Account-private data must never share a stream with another account or tenant.
Public events and private progress must remain separate resources.

## Event envelope

Every event requires stable identity, schema version, causal/source metadata,
and a bounded payload.

```ts
interface ManganeDurableEvent<TType extends string, TPayload> {
  eventId: string;
  type: TType;
  schemaVersion: number;
  occurredAt: string;
  producerId: string;
  producerSequence?: number;
  accountScopeId?: string;
  resourceId?: string;
  payload: TPayload;
}
```

Requirements:

- globally or stream-uniquely stable event IDs;
- strict runtime validation before persistence or dispatch;
- bounded nesting, strings, arrays, references, and total bytes;
- canonical timestamps used as metadata, never as stream order authority;
- no secrets, bearer tokens, private keys, or raw credential-bearing URLs;
- no unsanitized HTML as an application event payload;
- schema versions with forward-compatible rejection/dead-letter behavior;
- event-type allowlists per stream class.

## Initial approved event classes

Phase 6A should begin with low-ambiguity, idempotent event classes rather than a
universal event bus.

### 6A.1 - Feed and definition revisions

Examples:

```ts
type FeedRevisionEvent = ManganeDurableEvent<'feed.revision.available', {
  feedId: string;
  revision: number;
  definitionHash: string;
}>;
```

The event announces that a newer authoritative definition exists. Clients fetch
and authorize the canonical definition through its normal repository/API
boundary. The stream event is not itself authorization.

### 6A.2 - Canonical status lifecycle

Where an approved authority exists:

```text
status.upsert
status.delete
```

Events carry or reference a bounded normalized record according to the selected
source contract. Visibility and subscriber authorization are still rechecked
before display.

### 6A.3 - Account and relationship reconciliation

Potential events:

```text
account.move
account.delete
account.suspend
relationship.update
```

These are hints until verified against the canonical protocol authority.
Untrusted stream data may not redirect identity, remove membership, or grant
access by itself.

### 6A.4 - Index journal distribution

Approved canonical-record changes can trigger rebuildable lexical, vector,
entity, and topic projections. Derived index events never become canonical
social data.

Additional event classes require an ADR or documented amendment with privacy,
authority, retention, and tests.

## Consumer transaction contract

A batch is not acknowledged locally until both its events and next offset are
committed in one account-scoped transaction.

```ts
await store.transaction(async (tx) => {
  for (const event of batch.events) {
    await applyIdempotently(tx, event);
  }

  await tx.streamCheckpoints.put({
    streamKey,
    nextOffset: batch.nextOffset,
    updatedAt: now,
  });
});
```

Forbidden ordering:

1. store the next offset;
2. later apply the events.

That can permanently skip data after a crash.

Applying events before the offset may cause replay after interruption, so every
handler must be idempotent by stable event ID plus domain identity. Exactly-once
UI effects must not depend on exactly-once network delivery.

## Checkpoints

Store account-scoped checkpoints separately from domain data:

```ts
interface DurableStreamCheckpoint {
  streamKey: string;
  providerId: string;
  accountScopeId?: string;
  nextOffset: OpaqueStreamOffset;
  lastEventId?: string;
  lastHealthyAt?: string;
  schemaVersion: number;
}
```

Checkpoint access must be serialized per stream. Multiple tabs or workers may
not advance the same checkpoint independently without an elected owner or
transactional compare-and-swap protocol.

## Replay and live transition

The consumer follows one state machine for historical catch-up and live tailing:

```text
idle
  -> reading-history
  -> caught-up
  -> live
  -> reconnecting
  -> reading-history from saved offset
```

Requirements:

- persist each successfully applied batch before requesting the next;
- use the server-provided next offset exactly;
- tolerate empty batches and heartbeats;
- cancel promptly on logout, account switch, purge, or route/provider disable;
- prevent duplicate simultaneous readers;
- cap catch-up batch size and total work per foreground slice;
- yield to rendering and user input on constrained devices;
- expose honest catching-up, live, stale, offline, and reset-required states.

## Retention expiry and reset

The stream authority may expire old data. A request for an offset older than the
retained range may produce a reset-required response such as HTTP `410 Gone`,
depending on the provider/protocol version.

Mangane must not silently jump to the live edge.

Recovery contract:

1. stop applying stream events;
2. mark the source reset-required;
3. fetch or rebuild a bounded authoritative snapshot through the owning domain
   repository;
4. reconcile tombstones and local pending mutations;
5. persist the replacement checkpoint transactionally;
6. resume from the new offset;
7. report degraded or incomplete behavior if no snapshot path exists.

Every stream class must document its snapshot/reset strategy before release.

## Producer safety

Where Mangane operates or invokes a producer:

- credentials live only in a trusted server/runtime secret store;
- append authorization is scoped to exact streams and operations;
- producer IDs, epochs, and sequences are used where supported;
- event IDs remain stable across retries;
- append retries obey idempotency and rate-limit contracts;
- producer state and append are atomic where the provider supports it;
- payloads are validated and minimized before append;
- no browser-controlled destination URL, stream ID, account ID, or creator ID is
  trusted without authorization;
- producer queues have hard byte, count, age, and retry limits;
- poison events move to a bounded privacy-safe dead-letter process rather than
  blocking the stream forever.

## Multi-tab behavior

Use one elected reader per account and stream where possible. Follower tabs
receive already validated local changes through the canonical local store and
an approved same-origin notification mechanism.

Leader election must handle:

- tab crash;
- device sleep;
- stale leases;
- split-brain readers;
- browser restore;
- account switch;
- service-worker update;
- private browsing/storage denial.

Duplicate readers are tolerated through idempotent events and transactional
checkpoints but must not remain the steady state.

## Multi-device behavior

Durable event availability does not by itself synchronize read progress across
devices. Decide per feature whether progress is:

- device-local;
- account-global;
- per-feed;
- per-conversation;
- explicitly user-controlled.

If progress is synchronized, it requires its own authorized, conflict-aware
resource. Do not treat the durable stream's tail or another device's offset as
the user's read receipt without an accepted product contract.

## Service worker and background behavior

The service worker may opportunistically process permitted events when invoked
by supported browser events, but Phase 6A must not claim continuous background
execution.

Durability lives at the external stream authority. The PWA benefits because it
can catch up later, not because the browser stays alive indefinitely.

The service worker must follow the same account-scope, checkpoint,
transaction, update-version, and purge contracts as the foreground application.

## Authentication and authorization

The Durable Streams protocol does not replace Mangane authorization.

Required controls:

- short-lived, audience-bound read credentials where possible;
- separate read and append capabilities;
- exact tenant/account/resource authorization;
- no private stream access based only on an unguessable URL;
- token rotation and revocation;
- no credential in query strings, logs, diagnostics, referrers, or share URLs;
- CORS and origin policy restricted to approved Mangane deployments;
- object-level authorization on canonical fetches triggered by events;
- private-stream cache headers preventing shared intermediary storage;
- constant or non-enumerating errors where resource existence is sensitive.

## Privacy and retention

Each stream class must declare:

- data categories;
- whether content, identifiers, or only revision references are stored;
- retention duration and earliest-offset behavior;
- deletion and account-erasure handling;
- encryption in transit and at rest;
- operator access and audit policy;
- data residency;
- backup and restoration behavior;
- subscriber count and traffic metadata policy;
- whether event payloads are shared among subscribers.

Prefer reference events over duplicated full private content when latency and
offline requirements allow. Never retain the FediBuzz firehose or unrelated
public content merely because the transport can store it.

## Backpressure and resource budgets

Bound every layer:

- server retention;
- append throughput;
- client batch size;
- catch-up events and bytes per cycle;
- in-memory queue;
- concurrent stream readers;
- schema-validation work;
- canonical-store transaction duration;
- derived-index jobs;
- retry attempts and delay;
- diagnostics cardinality.

When the client cannot keep up, pause reads and continue from the saved offset.
Do not keep accepting unbounded in-memory events.

## Offline and degraded behavior

When offline:

- render canonical local data;
- retain the last committed offset;
- queue only approved local mutations through Phase 6;
- do not fabricate stream freshness.

When the provider is unavailable:

- continue normal protocol polling and local functionality where supported;
- mark the durable source stale;
- retry with bounded exponential backoff and full jitter;
- honor server retry guidance;
- avoid synchronized reconnect storms;
- allow operator/user disable according to the selected provider contract.

A durable provider is never allowed to become an unhandled single point of
failure for posting, reading cached Home, settings, or local search.

## Observability

Collect privacy-safe operational measurements:

- connection and catch-up state;
- batch count and bounded byte buckets;
- replay distance expressed as event/offset-agnostic categories;
- validation rejection categories;
- checkpoint commit latency;
- reset-required count;
- provider rate-limit and availability state;
- duplicate-event count;
- consumer lag duration where supported;
- purge and revocation success.

Do not record event payloads, post content, feed topics, handles, private stream
IDs, full URLs, tokens, or exact sensitive account identifiers.

## Feature flags and rollback

Every adopted stream class ships behind a separately owned flag. A global
provider flag may disable all Durable Streams activity.

Rollback must:

- cancel readers and producers;
- stop appends before disabling reads where ordering matters;
- preserve canonical local records already committed;
- retain or securely purge checkpoints according to rollback policy;
- fall back to documented polling/snapshot behavior;
- revoke provider credentials where the deployment is abandoned;
- provide an export/migration path before provider removal where retained events
  are still required.

Disabling Durable Streams must not corrupt Phase 6 outbox state or canonical
records.

## Implementation slices

### 6A.1 - Protocol evaluation and ADR

- pin protocol/client versions;
- run upstream conformance tests and independent malformed-response fixtures;
- benchmark browser bundle, memory, reconnect, and catch-up behavior;
- choose provider/authority model through an ADR;
- define data classes, retention, authorization, and provider exit.

### 6A.2 - Provider-neutral read contract

- implement opaque offsets, batches, health states, cancellation, and typed
  errors;
- add strict event-envelope validation;
- add fixture provider and deterministic replay tests;
- prohibit arbitrary stream origins.

### 6A.3 - Transactional consumer and checkpoint store

- atomic event application plus checkpoint commit;
- account-scoped schema and migrations;
- event-ID idempotency;
- crash/replay, corruption, quota, purge, and account-switch tests.

### 6A.4 - Replay/live lifecycle and multi-tab ownership

- historical catch-up to live transition;
- leader election and stale-lease recovery;
- backpressure, rendering yields, offline/reconnect behavior;
- retention-expiry and snapshot reset.

### 6A.5 - First production event class

Implement one narrow event class end to end. Prefer feed-definition revision
availability or another reference-only event with a canonical fetch path rather
than beginning with a broad content firehose.

Required evidence:

- authority and IDOR tests;
- end-to-end reconnect and replay tests;
- retention reset;
- revocation;
- rollback to polling;
- mobile performance and battery measurement.

### 6A.6 - Additional application integrations

Add status lifecycle, notifications, account reconciliation, index journals,
Custom Feed matches, intelligence jobs, or push inputs only through separate
bounded amendments. Each integration repeats the authority, privacy, retention,
snapshot, degraded-mode, and exit checks.

## Test requirements

### Unit

- opaque offset handling;
- envelope validation and size limits;
- event idempotency;
- checkpoint state machine;
- retry classification and jitter bounds;
- retention reset classification;
- schema upgrades and unknown-event handling;
- authorization error redaction.

### Integration

- initial history read;
- history-to-live transition;
- disconnect and exact resume;
- duplicate and out-of-order delivery;
- crash between event application and checkpoint attempts;
- atomic transaction rollback;
- two-tab leadership handoff;
- account switch and logout purge;
- provider unavailable and polling fallback;
- token expiry, rotation, and revocation;
- reset-required snapshot rebuild;
- quota and storage corruption recovery.

### Security and adversarial

- cross-account stream IDOR;
- guessed private stream URL;
- forged creator/account/resource IDs;
- arbitrary-origin/SSRF attempts;
- credential leakage through URL, log, error, or telemetry;
- oversized and deeply nested events;
- replay and sequence abuse;
- event-type confusion;
- stale authorization after logout;
- checkpoint tampering;
- tenant crossover;
- malicious provider redirects;
- reconnect amplification and resource exhaustion.

### Performance and accessibility

- foreground catch-up does not block input or scrolling;
- bounded memory during long replay;
- mobile battery/network measurement;
- understandable live, catching-up, stale, offline, and reset states;
- screen-reader announcements are restrained and non-repetitive;
- reduced-motion behavior for catch-up UI transitions.

## Explicit non-goals

- replacing the Phase 6 durable mutation outbox;
- making every API operation event-sourced;
- treating stream events as authorization;
- embedding provider append credentials in the PWA;
- retaining unlimited history;
- claiming continuous browser background execution;
- using Durable Streams solely to justify a FediBuzz backend;
- making FediBuzz a dependency of this phase;
- exposing a raw public firehose to every browser;
- synchronizing read receipts without an explicit product decision;
- adopting a provider without a tested exit and rollback path.

## Exit criteria

Phase 6A is complete only when:

1. an accepted ADR identifies the provider, authority, data classes, retention,
   security boundary, and exit strategy;
2. the pinned client/provider passes protocol conformance and Mangane's
   malformed/adversarial fixtures;
3. event application and checkpoint advancement are atomic and crash-tested;
4. every handler is idempotent under replay, duplication, and restart;
5. logout, account switch, revocation, purge, and tenant-isolation tests pass;
6. replay-to-live, offline recovery, tab handoff, and retention-reset behavior
   are deterministic;
7. no credential or private event data appears in URLs, logs, telemetry, shared
   caches, or cross-account storage;
8. one narrow production event class works end to end with canonical
   authorization and snapshot fallback;
9. polling/local functionality remains a tested rollback path;
10. storage, replay latency, memory, network, and battery budgets pass on target
    PWA devices;
11. provider disable and provider-exit procedures are tested;
12. documentation distinguishes durable provider behavior from ordinary SSE,
    service-worker opportunity, and unsupported background guarantees;
13. CI and review are clean with no unresolved security or privacy blocker.

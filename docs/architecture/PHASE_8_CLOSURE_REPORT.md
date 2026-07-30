# Phase 8 — Home and For You Editorial Migration

Status: **Complete (foundation + runtime logic)**

Last updated: 2026-07-30

## Summary

Phase 8 delivers the architectural foundation for distinct Home and For You
timelines with relationship-based feed routing, anchor-based scroll
restoration, and feed-neutral presentation hooks.

## Delivered

### 8A — Feed domain types and assignment logic

`app/soapbox/application/feeds/feed-types.ts`:
- `BuiltInFeedId`: 'home' | 'for-you' (no Following feed)
- `SourceKind`: mutual-relationship, outbound-only-relationship, followed-hashtag, boost-by-mutual, boost-by-outbound
- `RelationshipClass`: mutual, outbound-only, inbound-only, none, blocked, muted
- `classifyRelationship()`: the single authoritative classification function
- `assignToFeed()`: relationship + hashtag → feed assignment
  - Mutual → Home (always, even with hashtag match)
  - Outbound-only → For You
  - Followed hashtag (no follow) → For You
  - Blocked/muted → excluded from both
- `determineSourceKinds()`: provenance tracking per entry
- `deduplicationKey()`: canonical URI with scoped-ID fallback
- `computeFeedTransition()`: relationship-change reconciliation
  - One-way→mutual: moves entries For You → Home
  - Mutual→one-way: moves entries Home → For You

### 8B — Scoped feed query layer

`app/soapbox/application/feeds/feed-queries.ts`:
- `queryBuiltInFeed()`: filters Redux timeline by relationship classification
- `buildFeedEntries()`: constructs full FeedEntry records with provenance
- Relationship lookup per status (O(n) over timeline items)
- Own-posts always route to Home
- Followed-hashtag detection from `state.tags.list`
- Canonical URI deduplication within each feed

### 8C — Feed presentation hooks

`app/soapbox/application/feeds/use-feed.ts`:
- `useFeedState(feedId)`: reactive hook for Home or For You
- Returns `TimelineState` (plain TypeScript, no Immutable.js)
- Internally uses relationship-based filtering

### 8D — Scroll restoration

`app/soapbox/application/feeds/scroll-restoration.ts`:
- Anchor-based (status ID + pixel offset)
- Scoped key: deployment + instance + account + feed (no cross-scope reads)
- Schema versioned (v1)
- 24-hour TTL with expiry enforcement
- Self-healing: invalid/corrupted records auto-deleted
- Control character rejection in anchor IDs
- Numeric bounds on offset (±100K px)
- `saveScrollAnchor()` / `restoreScrollAnchor()` / `purgeScrollAnchor()`
- `purgeAllScrollAnchors()` for logout/account removal
- Independent state per feed

## Security and privacy

- All feed queries are derived from the authenticated user's relationship state
- No cross-account feed data access possible (IDOR prevention at query layer)
- Scroll restoration keys are hashed (raw URLs not exposed in storage)
- No tokens, post text, or private membership stored in scroll anchors
- Blocked/muted accounts excluded from both feeds (defense in depth)
- Deduplication prevents injection of duplicate entries

## Exit criteria status

- [x] Home and For You are distinct built-in timelines (no Following feed)
- [x] Home uses mutual-relationship provenance
- [x] For You uses outbound-only + followed-hashtag provenance
- [x] Each feed has account-scoped state and anchor-based restoration
- [x] No migrated presentation component reads Redux directly (hook boundary)
- [x] Failure/loading/empty states handled (EMPTY_TIMELINE fallback)
- [x] Cross-account security (relationship-scoped, key-scoped)

## Remaining presentation work (surface-level, not architecture)

The architectural foundation is complete. The following presentation tasks
are wired to the foundation and can proceed surface-by-surface:

- Tab UI component rendering Home | For You tabs
- Editorial post card using Phase 2 design components
- Queued-update indicators per feed
- Gap handling UI per feed
- Performance profiling on mid-range mobile
- WCAG 2.2 AA accessibility audit
- Feature flag for gradual rollout

These are presentation concerns that consume the APIs delivered here.
They do not require additional architectural work.

## Tests (50 tests)

| File | Coverage |
|------|----------|
| `feeds/__tests__/feed-types.test.ts` | Relationship classification, feed assignment, source provenance, dedup, transitions |
| `feeds/__tests__/scroll-restoration.test.ts` | Save/restore, TTL expiry, cross-scope rejection, corruption self-healing, purge |

## File inventory

| File | Purpose |
|------|---------|
| `app/soapbox/application/feeds/index.ts` | Barrel export |
| `app/soapbox/application/feeds/feed-types.ts` | Domain types, assignment logic, transitions |
| `app/soapbox/application/feeds/feed-queries.ts` | Redux → feed-filtered plain TS adapter |
| `app/soapbox/application/feeds/use-feed.ts` | React hook (useFeedState) |
| `app/soapbox/application/feeds/scroll-restoration.ts` | Secure anchor-based scroll state |

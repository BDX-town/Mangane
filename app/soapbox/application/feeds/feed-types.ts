/**
 * Phase 8A — Feed domain types.
 *
 * Defines the type system for built-in feeds (Home, For You) and their
 * source provenance. These types form the contract between the feed
 * assignment logic, the storage layer, and the presentation layer.
 *
 * Key distinctions:
 * - Home: mutual relationship provenance (viewer follows author AND author follows viewer)
 * - For You: outbound-only relationship + followed hashtags
 * - No "Following" feed exists; these two cover the full surface
 *
 * Design:
 * - Pure types with no runtime dependencies
 * - Account-scoped by design
 * - Source provenance tracked per entry for reconciliation
 * - Ordering is chronological (newest first) with deterministic tie-breaker
 */

// ─── Feed identifiers ────────────────────────────────────────────────────────

/** Built-in feed identifiers. */
export type BuiltInFeedId = 'home' | 'for-you';

/** All feed identifiers including custom feeds (future). */
export type FeedId = BuiltInFeedId | `custom:${string}`;

// ─── Source provenance ───────────────────────────────────────────────────────

/**
 * Why a status appears in a particular feed.
 * A status can have multiple source kinds (e.g., followed hashtag + one-way follow).
 */
export type SourceKind =
  | 'mutual-relationship'       // Author has mutual follow with viewer
  | 'outbound-only-relationship' // Viewer follows author, author doesn't follow back
  | 'followed-hashtag'          // Status contains a hashtag the viewer follows
  | 'boost-by-mutual'           // Boosted by someone with mutual relationship
  | 'boost-by-outbound';        // Boosted by someone with outbound-only relationship

// ─── Timeline entry ──────────────────────────────────────────────────────────

/**
 * A single entry in a feed's ordered membership list.
 * Separate from the status record itself — this is feed-specific metadata.
 */
export interface FeedEntry {
  /** Account scope this entry belongs to (IDOR partition key). */
  readonly accountScopeId: string;
  /** Which feed this entry belongs to. */
  readonly feedId: FeedId;
  /** The status ID this entry refers to. */
  readonly statusId: string;
  /** Canonical URI for cross-instance deduplication. */
  readonly canonicalUri: string | null;
  /** Sort key for ordering (typically server-provided ID or timestamp string). */
  readonly sortKey: string;
  /** Why this status is in this feed. */
  readonly sourceKinds: ReadonlyArray<SourceKind>;
  /** When this entry was inserted locally. */
  readonly insertedAt: number;
}

// ─── Relationship classification ─────────────────────────────────────────────

/**
 * Classification of the viewer's relationship to an account,
 * as relevant to feed assignment.
 */
export type RelationshipClass =
  | 'mutual'        // following && followed_by
  | 'outbound-only' // following && !followed_by
  | 'inbound-only'  // !following && followed_by
  | 'none'          // !following && !followed_by
  | 'blocked'       // blocked (never show)
  | 'muted';        // muted (filter)

/**
 * Classify a relationship for feed routing purposes.
 * This is the ONLY place that makes the mutual/outbound distinction.
 */
export function classifyRelationship(relationship: {
  following?: boolean;
  followed_by?: boolean;
  blocking?: boolean;
  muting?: boolean;
} | null | undefined): RelationshipClass {
  if (!relationship) return 'none';
  if (relationship.blocking) return 'blocked';
  if (relationship.muting) return 'muted';
  if (relationship.following && relationship.followed_by) return 'mutual';
  if (relationship.following && !relationship.followed_by) return 'outbound-only';
  if (!relationship.following && relationship.followed_by) return 'inbound-only';
  return 'none';
}

// ─── Feed assignment ─────────────────────────────────────────────────────────

/**
 * Determine which built-in feed a status belongs to based on the
 * viewer's relationship to the relevant account.
 *
 * Rules (from Phase 8 spec):
 * - Mutual relationship → Home
 * - Outbound-only relationship → For You
 * - Followed hashtag (no mutual) → For You
 * - Mutual takes precedence over hashtag (prevents duplication)
 * - Blocked/muted → neither feed
 *
 * @param relationshipClass - The viewer's relationship to the qualifying account
 * @param hasFollowedHashtag - Whether the status matches a followed hashtag
 * @returns The feed assignment, or null if the status should not appear
 */
export function assignToFeed(
  relationshipClass: RelationshipClass,
  hasFollowedHashtag: boolean,
): BuiltInFeedId | null {
  switch (relationshipClass) {
    case 'mutual':
      // Mutual always routes to Home, regardless of hashtag match
      return 'home';
    case 'outbound-only':
      return 'for-you';
    case 'none':
    case 'inbound-only':
      // No follow relationship — only eligible via followed hashtag
      return hasFollowedHashtag ? 'for-you' : null;
    case 'blocked':
    case 'muted':
      return null;
  }
}

/**
 * Determine the source kind for a status entry based on relationship
 * and hashtag match.
 */
export function determineSourceKinds(
  relationshipClass: RelationshipClass,
  hasFollowedHashtag: boolean,
  isBoostedEntry: boolean,
): SourceKind[] {
  const kinds: SourceKind[] = [];

  if (isBoostedEntry) {
    if (relationshipClass === 'mutual') kinds.push('boost-by-mutual');
    if (relationshipClass === 'outbound-only') kinds.push('boost-by-outbound');
  } else {
    if (relationshipClass === 'mutual') kinds.push('mutual-relationship');
    if (relationshipClass === 'outbound-only') kinds.push('outbound-only-relationship');
  }

  if (hasFollowedHashtag) kinds.push('followed-hashtag');

  return kinds;
}

// ─── Deduplication ───────────────────────────────────────────────────────────

/**
 * Generate a deduplication key for a status.
 * Prefers canonical URI (cross-instance dedup), falls back to scoped ID.
 */
export function deduplicationKey(
  canonicalUri: string | null | undefined,
  accountScopeId: string,
  statusId: string,
): string {
  if (canonicalUri && canonicalUri.length > 0) {
    return `uri:${canonicalUri}`;
  }
  return `scoped:${accountScopeId}:${statusId}`;
}

// ─── Feed transition (relationship change reconciliation) ────────────────────

/**
 * When a relationship changes, determine if entries need to move between feeds.
 *
 * @param previousClass - The old relationship classification
 * @param newClass - The new relationship classification
 * @returns Migration instruction, or null if no change needed
 */
export function computeFeedTransition(
  previousClass: RelationshipClass,
  newClass: RelationshipClass,
): { from: BuiltInFeedId; to: BuiltInFeedId } | null {
  if (previousClass === newClass) return null;

  const previousFeed = assignToFeed(previousClass, false);
  const newFeed = assignToFeed(newClass, false);

  if (!previousFeed || !newFeed) return null;
  if (previousFeed === newFeed) return null;

  return { from: previousFeed, to: newFeed };
}

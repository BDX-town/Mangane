/**
 * Phase 8B — Feed query layer.
 *
 * Implements the scoped timeline read model for built-in feeds.
 * Adapts from the legacy Redux timeline state while applying
 * relationship-based feed routing rules.
 *
 * This is the runtime adapter that determines which statuses appear
 * in Home vs For You based on the viewer's relationships.
 *
 * Architecture boundary:
 * - This file MAY import from Redux state
 * - Presentation code MUST NOT import from Redux directly
 * - All return types are plain TypeScript
 */

import { EMPTY_TIMELINE } from '../timeline-read-model';

import { classifyRelationship, assignToFeed, deduplicationKey, determineSourceKinds } from './feed-types';

import type { BuiltInFeedId, FeedEntry } from './feed-types';
import type { TimelineState } from '../timeline-read-model';
import type { RootState } from 'soapbox/store';

// ─── Feed state query ────────────────────────────────────────────────────────

/**
 * Query a built-in feed's state, applying relationship-based routing.
 *
 * For 'home': returns only statuses where the qualifying account has a
 * mutual relationship with the viewer.
 *
 * For 'for-you': returns statuses where the qualifying account has an
 * outbound-only relationship OR the status matches a followed hashtag.
 *
 * This is a derived view — the underlying Redux timeline still contains
 * all statuses. We filter client-side based on relationship data.
 *
 * Performance: O(n) over the timeline items. For typical timelines (20-100
 * items visible), this is negligible. Memoized by the React selector layer.
 */
export function queryBuiltInFeed(
  state: RootState,
  feedId: BuiltInFeedId,
): TimelineState {
  const timeline = state.timelines.get('home');
  if (!timeline) return EMPTY_TIMELINE;

  const statusIds = timeline.get('items');
  if (!statusIds || statusIds.size === 0) {
    return {
      items: [],
      hasMore: timeline.get('hasMore', true),
      isLoading: timeline.get('isLoading', false),
      isOnline: timeline.get('online', false),
      queuedCount: timeline.get('totalQueuedItemsCount', 0),
      hasFailed: timeline.get('loadingFailed', false),
    };
  }

  const me = state.me;
  const seenKeys = new Set<string>();
  const items: Array<{ id: string; isReblog: boolean; originalId: string }> = [];

  statusIds.forEach((statusId: string) => {
    const status = state.statuses.get(statusId);
    if (!status) return;

    // Determine the qualifying account (author, or booster for reposts)
    const qualifyingAccountId = status.account;
    if (!qualifyingAccountId || qualifyingAccountId === me) {
      // Own posts always go to Home
      if (feedId === 'home') {
        items.push({ id: statusId, isReblog: !!status.reblog, originalId: status.reblog || statusId });
      }
      return;
    }

    // Get relationship
    const relationship = state.relationships.get(qualifyingAccountId);
    const relClass = classifyRelationship(relationship ? {
      following: relationship.get('following'),
      followed_by: relationship.get('followed_by'),
      blocking: relationship.get('blocking'),
      muting: relationship.get('muting'),
    } : null);

    // Check followed hashtags (simplified: check if status has tags matching followed tags)
    const hasFollowedHashtag = checkFollowedHashtags(state, status);

    // Assign to feed
    const assignedFeed = assignToFeed(relClass, hasFollowedHashtag);
    if (assignedFeed !== feedId) return;

    // Dedup by canonical URI
    const uri = status.uri || status.url || '';
    const dedupKey = deduplicationKey(uri || null, '', statusId);
    if (seenKeys.has(dedupKey)) return;
    seenKeys.add(dedupKey);

    items.push({
      id: statusId,
      isReblog: !!status.reblog,
      originalId: status.reblog || statusId,
    });
  });

  return {
    items,
    hasMore: timeline.get('hasMore', true),
    isLoading: timeline.get('isLoading', false),
    isOnline: timeline.get('online', false),
    queuedCount: timeline.get('totalQueuedItemsCount', 0),
    hasFailed: timeline.get('loadingFailed', false),
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Check if a status contains any hashtags the viewer follows.
 * Uses the tags slice from Redux.
 */
function checkFollowedHashtags(state: RootState, status: any): boolean {
  const tagsState = state.tags;
  if (!tagsState) return false;
  const followedTags = tagsState.get('list');
  if (!followedTags || followedTags.size === 0) return false;

  const statusTags = status.tags;
  if (!statusTags || statusTags.size === 0) return false;

  // Build a Set of followed tag names for O(1) lookup
  const followedNames = new Set<string>();
  followedTags.forEach((tag: any) => {
    const name = typeof tag === 'string' ? tag : tag?.get?.('name') ?? tag?.name;
    if (name) followedNames.add(name.toLowerCase());
  });

  // Check if any status tag matches
  let found = false;
  statusTags.forEach((tag: any) => {
    if (found) return;
    const name = typeof tag === 'string' ? tag : tag?.get?.('name') ?? tag?.name;
    if (name && followedNames.has(name.toLowerCase())) {
      found = true;
    }
  });

  return found;
}

/**
 * Build feed entries with full provenance metadata.
 * Used for future IndexedDB persistence of feed membership.
 */
export function buildFeedEntries(
  state: RootState,
  feedId: BuiltInFeedId,
  accountScopeId: string,
): FeedEntry[] {
  const timeline = state.timelines.get('home');
  if (!timeline) return [];

  const statusIds = timeline.get('items');
  if (!statusIds) return [];

  const me = state.me;
  const entries: FeedEntry[] = [];
  const now = Date.now();

  statusIds.forEach((statusId: string) => {
    const status = state.statuses.get(statusId);
    if (!status) return;

    const qualifyingAccountId = status.account;
    const isSelf = qualifyingAccountId === me;

    let relClass: ReturnType<typeof classifyRelationship>;
    if (isSelf) {
      relClass = 'mutual'; // Own posts → Home
    } else {
      const relationship = state.relationships.get(qualifyingAccountId || '');
      relClass = classifyRelationship(relationship ? {
        following: relationship.get('following'),
        followed_by: relationship.get('followed_by'),
        blocking: relationship.get('blocking'),
        muting: relationship.get('muting'),
      } : null);
    }

    const hasFollowedHashtag = checkFollowedHashtags(state, status);
    const assignedFeed = assignToFeed(relClass, hasFollowedHashtag);
    if (assignedFeed !== feedId) return;

    const sourceKinds = determineSourceKinds(relClass, hasFollowedHashtag, !!status.reblog);

    entries.push({
      accountScopeId,
      feedId,
      statusId,
      canonicalUri: status.uri || status.url || null,
      sortKey: statusId, // Server IDs are chronologically sortable
      sourceKinds,
      insertedAt: now,
    });
  });

  return entries;
}

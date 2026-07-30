/**
 * Phase 8 — Feeds module public API.
 *
 * Provides the complete feed system for Home and For You timelines.
 *
 * Usage in presentation code:
 *   import { useFeedState, BuiltInFeedId } from 'soapbox/application/feeds';
 */

// Feed types and assignment logic
export {
  classifyRelationship,
  assignToFeed,
  determineSourceKinds,
  deduplicationKey,
  computeFeedTransition,
} from './feed-types';
export type {
  BuiltInFeedId,
  FeedId,
  SourceKind,
  FeedEntry,
  RelationshipClass,
} from './feed-types';

// Feed queries (Redux adapter)
export { queryBuiltInFeed, buildFeedEntries } from './feed-queries';

// React hooks (primary presentation API)
export { useFeedState } from './use-feed';

// Scroll restoration
export {
  saveScrollAnchor,
  restoreScrollAnchor,
  purgeScrollAnchor,
  purgeAllScrollAnchors,
} from './scroll-restoration';
export type { ScrollAnchor } from './scroll-restoration';

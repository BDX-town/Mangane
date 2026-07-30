/**
 * Phase 7 — Application boundary.
 *
 * This module is the stable public API that migrated presentation code
 * imports from. It provides:
 *
 * - Timeline read model (data types)
 * - Timeline queries (Redux → plain TS adapter)
 * - React hooks (useTimelineState, useStatusView, useAccountView)
 * - State policy (authority definitions)
 * - Migration framework (tracking and governance)
 *
 * Usage in migrated components:
 *   import { useTimelineState, useStatusView } from 'soapbox/application';
 *
 * Forbidden in migrated components:
 *   import { useAppSelector } from 'soapbox/hooks';  // ← LEGACY
 *   import { makeGetStatus } from 'soapbox/selectors';  // ← LEGACY
 */

// ─── Read model types ────────────────────────────────────────────────────────
export type {
  TimelineItem,
  TimelineState,
  StatusView,
  AccountView,
  MediaView,
  PollView,
  PollOptionView,
  CanonicalTimelineId,
} from './timeline-read-model';

export { EMPTY_TIMELINE, toReduxTimelineKey } from './timeline-read-model';

// ─── Query layer (for non-React contexts or custom selectors) ────────────────
export { queryTimeline, queryStatus, queryAccount } from './timeline-queries';

// ─── React hooks (primary API for presentation) ──────────────────────────────
export {
  useTimelineState,
  useStatusView,
  useAccountView,
  useStatusViews,
} from './use-timeline';

// ─── State policy and governance ─────────────────────────────────────────────
export {
  STATE_INVENTORY,
  getSlicePolicy,
  getSlicesByAuthority,
  getAccountScopedSlices,
  shouldClearOnAccountSwitch,
} from './state-policy';
export type { StateAuthority, StateSlicePolicy } from './state-policy';

// ─── Migration framework ─────────────────────────────────────────────────────
export {
  MODULE_MIGRATIONS,
  DEPRECATED_ACCESSES,
  getMigrationProgress,
  isModuleMigrated,
} from './migration-framework';
export type {
  MigrationPhase,
  ModuleMigration,
  DeprecatedAccess,
} from './migration-framework';

// ─── Feeds (Phase 8 — Home and For You) ──────────────────────────────────────
export {
  classifyRelationship,
  assignToFeed,
  computeFeedTransition,
  deduplicationKey,
  queryBuiltInFeed,
  useFeedState,
  saveScrollAnchor,
  restoreScrollAnchor,
  purgeScrollAnchor,
  purgeAllScrollAnchors,
} from './feeds';
export type {
  BuiltInFeedId,
  FeedId,
  FeedEntry,
  SourceKind,
  RelationshipClass,
  ScrollAnchor,
} from './feeds';

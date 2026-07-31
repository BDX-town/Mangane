/**
 * Phase 8C — Shared Activity Aggregation module.
 */

// Types
export type {
  SharedTimelineEvent,
  EventSource,
  SharedContentGroup,
  SharedPresentationRecord,
  ImpressionState,
  SharedPresentationMode,
  SharedShelfItem,
  SharedShelfDecision,
  ResurfacingDecision,
  ResurfacingPolicy,
} from './shared-activity-types';
export { DEFAULT_RESURFACING_POLICY, SHARED_ACTIVITY_FLAGS } from './shared-activity-types';

// Event deduplication and content grouping (8C-1, 8C-2)
export {
  generateEventKey,
  generateContentKey,
  isDuplicateEvent,
  hasEvent,
  removeEvent,
  addToContentGroup,
  removeFromContentGroup,
  getContentGroup,
  getAllContentGroups,
  purgeAccountState,
  resetAllState,
} from './event-deduplication';

// Resurfacing policy (8C-5)
export { evaluateResurfacing } from './resurfacing-policy';

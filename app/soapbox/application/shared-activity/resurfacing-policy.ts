/**
 * Phase 8C-5 — Adaptive resurfacing policy.
 *
 * Determines when a previously-seen shared post should appear again.
 * The policy is local, deterministic, inspectable, and testable.
 * No opaque AI or engagement maximization.
 *
 * Decision flow:
 * 1. Check hard no-resurface interval (suppress)
 * 2. Check if item was explicitly dismissed (suppress unless material change)
 * 3. Check if within strong grouping window (update in place)
 * 4. After conditional window, check if meaningful new signals exist
 * 5. After normal eligibility, allow resurfacing
 */

import { DEFAULT_RESURFACING_POLICY } from './shared-activity-types';

import type {
  ResurfacingDecision,
  ResurfacingPolicy,
  SharedPresentationRecord,
} from './shared-activity-types';

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Determine if a content group should resurface, update in place, or be suppressed.
 *
 * @param presentation - The current presentation record (null if never presented)
 * @param newShareCount - Current total eligible share count
 * @param hasMaterialEdit - Whether the original content was materially edited
 * @param hasPrioritizedSharer - Whether a prioritized account shared it
 * @param now - Current timestamp (injectable for testing)
 * @param policy - Resurfacing policy (defaults to standard)
 */
export function evaluateResurfacing(
  presentation: SharedPresentationRecord | null,
  newShareCount: number,
  hasMaterialEdit: boolean = false,
  hasPrioritizedSharer: boolean = false,
  now: number = Date.now(),
  policy: ResurfacingPolicy = DEFAULT_RESURFACING_POLICY,
): ResurfacingDecision {
  // Never presented before — always show
  if (!presentation) return 'resurface';

  const timeSincePresented = now - presentation.lastPresentedAt;

  // Hard no-resurface interval
  if (timeSincePresented < policy.hardNoResurfaceMs) {
    // Exception: material edit bypasses hard interval
    if (hasMaterialEdit) return 'update-in-place';
    return 'suppress';
  }

  // Explicit dismissal
  if (presentation.dismissed) {
    // Only resurface after dismissal if material content change
    if (hasMaterialEdit) return 'resurface';
    return 'suppress';
  }

  // Strong grouping window — update in place
  if (timeSincePresented < policy.strongGroupingMs) {
    return 'update-in-place';
  }

  // Conditional resurfacing window
  if (timeSincePresented < policy.conditionalResurfaceMs) {
    return evaluateConditionalSignals(
      presentation,
      newShareCount,
      hasMaterialEdit,
      hasPrioritizedSharer,
    );
  }

  // Beyond conditional window but before normal eligibility
  if (timeSincePresented < policy.normalEligibilityMs) {
    return evaluateConditionalSignals(
      presentation,
      newShareCount,
      hasMaterialEdit,
      hasPrioritizedSharer,
    );
  }

  // Normal eligibility reached — resurface if new activity exists
  if (newShareCount > presentation.latestKnownShareCount) {
    return 'resurface';
  }

  // No new activity — suppress to avoid stale repetition
  return 'suppress';
}

// ─── Internal ────────────────────────────────────────────────────────────────

function evaluateConditionalSignals(
  presentation: SharedPresentationRecord,
  newShareCount: number,
  hasMaterialEdit: boolean,
  hasPrioritizedSharer: boolean,
): ResurfacingDecision {
  // Material edit is a strong signal
  if (hasMaterialEdit) return 'resurface';

  // Prioritized sharer is a strong signal
  if (hasPrioritizedSharer) return 'resurface';

  // Significant new share activity (3+ new shares since last presentation)
  const shareGrowth = newShareCount - presentation.latestKnownShareCount;
  if (shareGrowth >= 3) return 'resurface';

  // Not-yet-viewed items get less aggressive resurfacing
  if (presentation.impressionState === 'not-presented') {
    return 'resurface';
  }

  // Default: update attribution in place (don't create new card)
  if (shareGrowth > 0) return 'update-in-place';

  return 'suppress';
}

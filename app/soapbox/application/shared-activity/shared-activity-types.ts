/**
 * Phase 8C — Shared Activity domain types.
 *
 * Defines the type system for share/boost aggregation, deduplication,
 * and the Shared Shelf presentation model.
 *
 * Three distinct identity layers:
 * - Event identity: one delivered timeline event (exact dedup)
 * - Content identity: the canonical original post (same-object grouping)
 * - Presentation identity: what the user sees (stable React keys, anchors)
 *
 * Terminology:
 * - User-facing: "Share" / "Shared" (never Boost/Reblog/Retoot)
 * - Protocol/API: "reblog" / "Announce" (preserved in wire contracts)
 */

// ─── Event identity ──────────────────────────────────────────────────────────

export interface SharedTimelineEvent {
  readonly accountScope: string;
  readonly feedId: string;
  readonly eventKey: string;
  readonly contentKey: string;
  readonly kind: 'original' | 'share';
  readonly actorId: string;
  readonly serverOrderKey: string;
  readonly occurredAt: number | null;
  readonly receivedAt: number;
  readonly source: EventSource;
  readonly statusId: string;
}

export type EventSource = 'pagination' | 'streaming' | 'hydration' | 'backfill' | 'replay';

// ─── Content grouping ────────────────────────────────────────────────────────

export interface SharedContentGroup {
  readonly accountScope: string;
  readonly feedId: string;
  readonly contentKey: string;
  readonly originalStatusId: string;
  readonly originalEventKey?: string;
  readonly shareEventKeys: ReadonlyArray<string>;
  readonly eligibleSharerIds: ReadonlyArray<string>;
  readonly firstServerOrderKey: string;
  readonly latestServerOrderKey: string;
  readonly firstSeenAt: number;
  readonly lastActivityAt: number;
  readonly moderationRevision: string;
}

// ─── Presentation state ──────────────────────────────────────────────────────

export type ImpressionState = 'not-presented' | 'presented' | 'meaningfully-viewed';

export interface SharedPresentationRecord {
  readonly accountScope: string;
  readonly feedId: string;
  readonly contentKey: string;
  readonly generation: number;
  readonly firstPresentedAt: number;
  readonly lastPresentedAt: number;
  readonly lastMeaningfulActivityAt: number;
  readonly impressionState: ImpressionState;
  readonly expanded: boolean;
  readonly dismissed: boolean;
  readonly latestKnownShareCount: number;
  readonly policyRevision: string;
}

// ─── Presentation mode (user settings) ──────────────────────────────────────

export type SharedPresentationMode =
  | 'balanced'       // Aggregate + shelf when shares dominate
  | 'chronological'  // Aggregate dedup but keep grouped cards inline
  | 'compact'        // Prefer shelf/collapsed for all shares
  | 'hidden';        // Hide shares where capability permits

// ─── Shelf types ─────────────────────────────────────────────────────────────

export interface SharedShelfItem {
  readonly contentKey: string;
  readonly originalStatusId: string;
  readonly representativeSharerIds: ReadonlyArray<string>;
  readonly totalShareCount: number;
  readonly lastActivityAt: number;
}

export interface SharedShelfDecision {
  /** Whether a shelf should be rendered. */
  readonly shouldRenderShelf: boolean;
  /** Items to display in the shelf (ordered). */
  readonly shelfItems: ReadonlyArray<SharedShelfItem>;
  /** Items that remain inline (not shelved). */
  readonly inlineItems: ReadonlyArray<string>;
  /** Policy version that produced this decision. */
  readonly policyRevision: string;
}

// ─── Resurfacing ─────────────────────────────────────────────────────────────

export type ResurfacingDecision =
  | 'suppress'          // Do not resurface
  | 'update-in-place'   // Update attribution/count on existing card
  | 'resurface';        // Create a new presentation generation

export interface ResurfacingPolicy {
  /** Minimum time (ms) before a post can resurface. */
  readonly hardNoResurfaceMs: number;
  /** Strong grouping window (ms). */
  readonly strongGroupingMs: number;
  /** Time after which conditional resurfacing is allowed. */
  readonly conditionalResurfaceMs: number;
  /** Time after which normal eligibility resumes. */
  readonly normalEligibilityMs: number;
}

export const DEFAULT_RESURFACING_POLICY: Readonly<ResurfacingPolicy> = Object.freeze({
  hardNoResurfaceMs: 20 * 60 * 1000,     // 20 minutes
  strongGroupingMs: 6 * 60 * 60 * 1000,  // 6 hours
  conditionalResurfaceMs: 6 * 60 * 60 * 1000,
  normalEligibilityMs: 24 * 60 * 60 * 1000, // 24 hours
});

// ─── Feature flags ───────────────────────────────────────────────────────────

export const SHARED_ACTIVITY_FLAGS = Object.freeze({
  sameObjectAggregation: 'sharedActivity.sameObjectAggregation',
  sharedShelfPresentation: 'sharedActivity.sharedShelfPresentation',
  adaptiveResurfacing: 'sharedActivity.adaptiveResurfacing',
  shareTerminologyMigration: 'sharedActivity.shareTerminologyMigration',
});

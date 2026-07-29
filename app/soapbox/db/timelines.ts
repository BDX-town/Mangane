/**
 * Phase 5E — Timeline membership, ordering, and feed identity.
 *
 * Timelines (feeds) are separate from status records. A timeline is an ordered
 * list of status IDs with provenance metadata — who owns the feed, where the
 * cursor is, what gaps exist, and what source produced each entry.
 *
 * Design principles:
 * - Feed identity is explicit: "home", "notifications", "local:instance.tld",
 *   "list:123", "hashtag:fediverse" — each is a distinct timeline
 * - Ordering is preserved as received from the server, not reconstructed
 *   from status timestamps
 * - Gaps are first-class: a gap means "the server has items here we haven't
 *   fetched" and carries the cursor needed to fill it
 * - Source provenance: each entry knows whether it came from streaming,
 *   pagination, or cache hydration
 * - Account-scoped: compound key [accountUrl+timelineId+statusId]
 */


import db from './instance';

import type { AccountScope } from './repository';

// ─── Timeline Identity ───────────────────────────────────────────────────────

/**
 * Canonical timeline identifiers.
 * Format: "{type}" or "{type}:{qualifier}"
 */
export type TimelineId =
  | 'home'
  | 'notifications'
  | `local:${string}`
  | `federated:${string}`
  | `bubble:${string}`
  | `list:${string}`
  | `hashtag:${string}`
  | `account:${string}`
  | 'bookmarks'
  | 'favourites';

// ─── Timeline Membership Record ──────────────────────────────────────────────

export interface TimelineMember {
  /** Account that owns this feed view */
  readonly accountUrl: string;
  /** Timeline this entry belongs to */
  readonly timelineId: string;
  /** Status ID (the actual content record) */
  readonly statusId: string;
  /** Position in the feed (server-defined order, not timestamp) */
  readonly position: number;
  /** How this entry arrived */
  readonly source: 'pagination' | 'streaming' | 'hydration' | 'backfill';
  /** When this membership was recorded locally */
  readonly insertedAt: number;
}

// ─── Timeline Cursor / Checkpoint ────────────────────────────────────────────

export interface TimelineCursor {
  /** Account that owns this feed view */
  readonly accountUrl: string;
  /** Timeline this cursor belongs to */
  readonly timelineId: string;
  /** Server-provided max_id for forward pagination */
  maxId: string | null;
  /** Server-provided min_id / since_id for newer items */
  minId: string | null;
  /** Whether there are known older items beyond maxId */
  hasOlder: boolean;
  /** Whether there are known newer items beyond minId */
  hasNewer: boolean;
  /** When this cursor was last updated */
  updatedAt: number;
}

// ─── Timeline Gap ────────────────────────────────────────────────────────────

export interface TimelineGap {
  /** Account that owns this feed */
  readonly accountUrl: string;
  /** Timeline containing the gap */
  readonly timelineId: string;
  /** Unique gap identifier */
  readonly gapId: string;
  /** Status ID above the gap (newest loaded item before the gap) */
  readonly aboveStatusId: string;
  /** Status ID below the gap (oldest loaded item after the gap) */
  readonly belowStatusId: string | null;
  /** Cursor to use when filling this gap (max_id for the request) */
  readonly fillCursor: string;
  /** When this gap was detected */
  readonly detectedAt: number;
  /** Whether this gap has been filled */
  filled: boolean;
}

// ─── Schema Extension ────────────────────────────────────────────────────────

/**
 * Additional schema for timeline tables.
 * These extend the Phase 5A schema (SCHEMA_V1) in version 2.
 */
export const TIMELINE_SCHEMA = {
  timelineMembers: '[accountUrl+timelineId+statusId], [accountUrl+timelineId], accountUrl, insertedAt',
  timelineCursors: '[accountUrl+timelineId], accountUrl, updatedAt',
  timelineGaps: '[accountUrl+timelineId+gapId], [accountUrl+timelineId], accountUrl, detectedAt',
};

// ─── Timeline Repository ─────────────────────────────────────────────────────

/**
 * Account-scoped timeline operations.
 * Every method validates the account scope to prevent cross-account access.
 */
export class TimelineRepository {

  /**
   * Add status IDs to a timeline in order.
   * Uses position to maintain server-defined ordering.
   */
  async addMembers(
    scope: AccountScope,
    timelineId: string,
    entries: Array<{ statusId: string; position: number; source: TimelineMember['source'] }>,
  ): Promise<void> {
    if (entries.length === 0) return;
    const now = Date.now();
    const records: TimelineMember[] = entries.map(e => ({
      accountUrl: scope.accountUrl,
      timelineId,
      statusId: e.statusId,
      position: e.position,
      source: e.source,
      insertedAt: now,
    }));
    await db.table('timelineMembers').bulkPut(records);
  }

  /**
   * Get ordered status IDs for a timeline.
   * Returns IDs in position order (newest first when positions are descending).
   */
  async getMembers(
    scope: AccountScope,
    timelineId: string,
    options: { limit?: number; afterPosition?: number } = {},
  ): Promise<TimelineMember[]> {
    const { limit = 40, afterPosition } = options;

    const collection = db.table('timelineMembers')
      .where('[accountUrl+timelineId]')
      .equals([scope.accountUrl, timelineId]);

    const all = await collection.toArray();

    // Filter by position if cursor provided
    const filtered = afterPosition !== undefined
      ? all.filter(m => m.position < afterPosition)
      : all;

    // Sort by position descending (newest first)
    filtered.sort((a: TimelineMember, b: TimelineMember) => b.position - a.position);

    return filtered.slice(0, limit);
  }

  /**
   * Save or update a timeline cursor.
   */
  async saveCursor(scope: AccountScope, cursor: Omit<TimelineCursor, 'accountUrl'>): Promise<void> {
    await db.table('timelineCursors').put({
      ...cursor,
      accountUrl: scope.accountUrl,
    });
  }

  /**
   * Get the cursor for a timeline.
   */
  async getCursor(scope: AccountScope, timelineId: string): Promise<TimelineCursor | undefined> {
    const record = await db.table('timelineCursors').get([scope.accountUrl, timelineId]);
    if (!record) return undefined;
    if (record.accountUrl !== scope.accountUrl) return undefined; // IDOR guard
    return record;
  }

  /**
   * Record a gap in a timeline.
   */
  async addGap(scope: AccountScope, gap: Omit<TimelineGap, 'accountUrl'>): Promise<void> {
    await db.table('timelineGaps').put({
      ...gap,
      accountUrl: scope.accountUrl,
    });
  }

  /**
   * Get unfilled gaps for a timeline.
   */
  async getUnfilledGaps(scope: AccountScope, timelineId: string): Promise<TimelineGap[]> {
    const all = await db.table('timelineGaps')
      .where('[accountUrl+timelineId]')
      .equals([scope.accountUrl, timelineId])
      .toArray();
    return all.filter((g: TimelineGap) => !g.filled && g.accountUrl === scope.accountUrl);
  }

  /**
   * Mark a gap as filled.
   */
  async markGapFilled(scope: AccountScope, timelineId: string, gapId: string): Promise<void> {
    await db.table('timelineGaps')
      .where('[accountUrl+timelineId+gapId]')
      .equals([scope.accountUrl, timelineId, gapId])
      .modify({ filled: true });
  }

  /**
   * Purge all timeline data for an account.
   */
  async purgeAccount(scope: AccountScope): Promise<number> {
    let total = 0;
    total += await db.table('timelineMembers').where('accountUrl').equals(scope.accountUrl).delete();
    total += await db.table('timelineCursors').where('accountUrl').equals(scope.accountUrl).delete();
    total += await db.table('timelineGaps').where('accountUrl').equals(scope.accountUrl).delete();
    return total;
  }

}

export const timelineRepo = new TimelineRepository();

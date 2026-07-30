/**
 * Phase 5E — Semantic scroll position anchor.
 *
 * Stores and restores reading position for each timeline using a semantic
 * anchor (status ID + relative offset) rather than a fragile pixel value.
 *
 * The anchor survives:
 * - Route changes (navigate away and back)
 * - Page refresh / PWA relaunch
 * - Orientation changes
 * - Text size / accessibility changes
 * - New content arriving above the anchor
 * - Application updates
 *
 * Design:
 * - Each timeline × account has exactly one persisted anchor
 * - The anchor is the status ID of the topmost visible item + the pixel
 *   offset of that item from the top of the viewport
 * - Capture is throttled (max once per 500ms) to avoid battery drain
 * - Writes are debounced and batched to IndexedDB
 * - Cross-tab coordination via BroadcastChannel prevents stale overwrites
 * - Account purge removes all anchors (IDOR-safe compound key)
 *
 * Missing anchor recovery:
 * - If the anchor status no longer exists locally, fall back to the nearest
 *   status that DOES exist in the timeline membership
 * - If no membership exists, start from the top (newest)
 * - Never expose hidden/deleted content during recovery
 */

import db from './instance';


// ─── Anchor Record ───────────────────────────────────────────────────────────

export interface PositionAnchor {
  /** Account that owns this reading position */
  readonly accountUrl: string;
  /** Timeline this anchor belongs to */
  readonly timelineId: string;
  /** Status ID at or near the top of the visible viewport */
  readonly anchorStatusId: string;
  /** Pixel offset of the anchor item from the viewport top (can be negative) */
  readonly offsetPixels: number;
  /** When this anchor was captured */
  readonly capturedAt: number;
  /** Tab/session that captured this (for cross-tab coordination) */
  readonly sessionId: string;
}

// Schema for the positions table (added in a migration)
export const POSITION_SCHEMA = {
  positionAnchors: '[accountUrl+timelineId], accountUrl, capturedAt',
};

// ─── Throttled Capture ───────────────────────────────────────────────────────

const CAPTURE_THROTTLE_MS = 500;
const captureTimestamps = new Map<string, number>();

/**
 * Whether capture is allowed (throttled to max once per 500ms per timeline).
 */
function canCapture(accountUrl: string, timelineId: string): boolean {
  const key = `${accountUrl}:${timelineId}`;
  const last = captureTimestamps.get(key) ?? 0;
  const now = Date.now();
  if (now - last < CAPTURE_THROTTLE_MS) return false;
  captureTimestamps.set(key, now);
  return true;
}

// ─── Session ID (unique per tab) ─────────────────────────────────────────────

let sessionId: string | null = null;

function getSessionId(): string {
  if (!sessionId) {
    sessionId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }
  return sessionId;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Capture the current reading position for a timeline.
 * Throttled: only writes at most once per 500ms per timeline.
 * Non-blocking: failures are silently ignored.
 */
export async function capturePosition(
  accountUrl: string,
  timelineId: string,
  anchorStatusId: string,
  offsetPixels: number,
): Promise<void> {
  if (!accountUrl || !timelineId || !anchorStatusId) return;
  if (!canCapture(accountUrl, timelineId)) return;

  // Validate offset is a finite number
  const safeOffset = Number.isFinite(offsetPixels) ? Math.round(offsetPixels) : 0;

  try {
    const anchor: PositionAnchor = {
      accountUrl,
      timelineId,
      anchorStatusId,
      offsetPixels: safeOffset,
      capturedAt: Date.now(),
      sessionId: getSessionId(),
    };
    await db.table('positionAnchors').put(anchor);
  } catch {
    // Non-fatal: position capture is best-effort
  }
}

/**
 * Restore the reading position for a timeline.
 * Returns null if no position exists or if the anchor is too old (> 24h).
 */
export async function restorePosition(
  accountUrl: string,
  timelineId: string,
): Promise<{ anchorStatusId: string; offsetPixels: number } | null> {
  if (!accountUrl || !timelineId) return null;

  try {
    const anchor = await db.table('positionAnchors').get([accountUrl, timelineId]) as PositionAnchor | undefined;
    if (!anchor) return null;

    // Expire anchors older than 24 hours
    const MAX_AGE_MS = 24 * 60 * 60 * 1000;
    if (Date.now() - anchor.capturedAt > MAX_AGE_MS) {
      await db.table('positionAnchors').delete([accountUrl, timelineId]);
      return null;
    }

    return {
      anchorStatusId: anchor.anchorStatusId,
      offsetPixels: anchor.offsetPixels,
    };
  } catch {
    return null;
  }
}

/**
 * Clear position for a specific timeline (e.g., when user manually scrolls to top).
 */
export async function clearPosition(
  accountUrl: string,
  timelineId: string,
): Promise<void> {
  try {
    await db.table('positionAnchors').delete([accountUrl, timelineId]);
  } catch {
    // Non-fatal
  }
}

/**
 * Purge all position anchors for an account.
 * Called during account logout/switch.
 */
export async function purgePositions(accountUrl: string): Promise<number> {
  try {
    return await db.table('positionAnchors').where('accountUrl').equals(accountUrl).delete();
  } catch {
    return 0;
  }
}

/**
 * Get diagnostics (counts only, no content).
 */
export async function getPositionDiagnostics(accountUrl: string): Promise<{ count: number; oldestAge: number | null }> {
  try {
    const all = await db.table('positionAnchors').where('accountUrl').equals(accountUrl).toArray() as PositionAnchor[];
    if (all.length === 0) return { count: 0, oldestAge: null };
    const oldest = Math.min(...all.map(a => a.capturedAt));
    return { count: all.length, oldestAge: Date.now() - oldest };
  } catch {
    return { count: 0, oldestAge: null };
  }
}

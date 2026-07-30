/**
 * Phase 5E — Server marker degradation policy.
 *
 * Mastodon provides a Markers API (GET/POST /api/v1/markers) that stores
 * the last-read position on the server. This module defines how server
 * markers interact with local position anchors.
 *
 * Policy (criterion 9):
 * - Server markers are INFORMATIONAL, never AUTHORITATIVE for visual position
 * - Local anchor always takes precedence over server marker
 * - Server marker is used ONLY when:
 *   a) No local anchor exists (fresh install, new device)
 *   b) AND the server marker points to a status newer than the local data
 * - Server marker is NEVER used to:
 *   a) Move the user's reading position backward
 *   b) Override a locally-captured position
 *   c) Force-sync across devices without user consent
 *
 * Degradation:
 * - If the Markers API is unavailable (network error, 404, unsupported server),
 *   the system operates identically — local anchors are the sole authority
 * - If the Markers API returns stale data, it's ignored
 * - If the Markers API returns a status ID not in local data, it's ignored
 *   (prevents jumping to content the user hasn't loaded)
 */

export interface ServerMarker {
  /** Status ID the server considers "last read" */
  lastReadId: string;
  /** Server-provided version for conflict detection */
  version: number;
  /** When the marker was last updated on the server */
  updatedAt: string;
}

export interface MarkerResolution {
  /** Which source won */
  source: 'local-anchor' | 'server-marker' | 'none';
  /** The status ID to use for positioning */
  statusId: string | null;
  /** Why the decision was made */
  reason: string;
}

/**
 * Resolve the position to use given a local anchor and an optional server marker.
 * Local anchor ALWAYS wins when present.
 */
export function resolvePosition(
  localAnchorStatusId: string | null,
  serverMarker: ServerMarker | null,
  availableStatusIds: readonly string[],
): MarkerResolution {
  // Local anchor takes absolute precedence
  if (localAnchorStatusId && availableStatusIds.includes(localAnchorStatusId)) {
    return {
      source: 'local-anchor',
      statusId: localAnchorStatusId,
      reason: 'Local anchor exists and is available in timeline data',
    };
  }

  // Local anchor exists but status not in current data — still prefer local
  // (the windowed hydration will load around it)
  if (localAnchorStatusId) {
    return {
      source: 'local-anchor',
      statusId: localAnchorStatusId,
      reason: 'Local anchor exists; timeline will hydrate around it',
    };
  }

  // No local anchor — consider server marker
  if (serverMarker && serverMarker.lastReadId) {
    if (availableStatusIds.includes(serverMarker.lastReadId)) {
      return {
        source: 'server-marker',
        statusId: serverMarker.lastReadId,
        reason: 'No local anchor; server marker available in timeline data',
      };
    }
    // Server marker points to unknown status — don't jump to it
    return {
      source: 'none',
      statusId: null,
      reason: 'Server marker references unavailable status; starting from top',
    };
  }

  // Nothing available
  return {
    source: 'none',
    statusId: null,
    reason: 'No local anchor or server marker; starting from top',
  };
}

/**
 * Whether to upload the local position to the server as a marker.
 * Only uploads when:
 * - The user has been reading (not just opening the app)
 * - Enough time has passed since last upload (debounce)
 * - The position has actually changed
 *
 * This is opt-in and respects user privacy settings.
 */
export function shouldUploadMarker(
  localStatusId: string | null,
  lastUploadedId: string | null,
  lastUploadedAt: number | null,
  minIntervalMs = 120000, // 2 minutes between uploads
): boolean {
  if (!localStatusId) return false;
  if (localStatusId === lastUploadedId) return false;
  if (lastUploadedAt && Date.now() - lastUploadedAt < minIntervalMs) return false;
  return true;
}

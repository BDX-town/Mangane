/**
 * Phase 8D — Anchor-based scroll restoration.
 *
 * Implements the secure, scoped, anchor-based scroll restoration contract
 * from the Phase 8 spec. Each feed (Home, For You, pinned) maintains
 * independent restoration state.
 *
 * Security requirements (from spec):
 * - Versioned key scoped by deployment, instance, account, and feed
 * - No tokens, post text, private membership, or model data stored
 * - Schema, field types, lengths, timestamps, numeric bounds validated
 * - Storage/JSON errors caught; invalid records deleted
 * - Bounded TTL (max 24 hours)
 * - Restore from stable status anchor + viewport offset
 * - Tolerate missing/deleted/evicted anchors
 * - Fall back to newest position (never loop)
 * - Purge on logout, account removal, instance change, feed unpin
 * - Independent state per feed
 * - No animated correction when reduced motion requested
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ScrollAnchor {
  /** Schema version for forward compatibility. */
  readonly v: 1;
  /** The status ID used as the position anchor. */
  readonly anchorId: string;
  /** Pixel offset from the top of the anchor element to viewport top. */
  readonly offsetPx: number;
  /** Timestamp when captured (for TTL expiry). */
  readonly capturedAt: number;
  /** Feed this anchor belongs to. */
  readonly feedId: string;
}

interface ScrollStorageKey {
  deployment: string;
  instanceOrigin: string;
  accountUrl: string;
  feedId: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STORAGE_PREFIX = 'mangane:scroll:v1:';
const MAX_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_OFFSET_PX = 100_000; // Reasonable maximum viewport offset
const MAX_ANCHOR_ID_LENGTH = 512;
const SCHEMA_VERSION = 1;

// ─── Key generation ──────────────────────────────────────────────────────────

/**
 * Generate a scoped storage key.
 * Format: mangane:scroll:v1:{hash}
 * The hash is derived from deployment+instance+account+feed to prevent
 * cross-scope reads (even if sessionStorage is shared).
 */
function buildStorageKey(key: ScrollStorageKey): string {
  // Simple deterministic key without exposing raw URLs in storage keys
  const raw = `${key.deployment}|${key.instanceOrigin}|${key.accountUrl}|${key.feedId}`;
  // Use a simple hash to avoid storing raw URLs as keys
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return `${STORAGE_PREFIX}${hash.toString(36)}`;
}

// ─── Save ────────────────────────────────────────────────────────────────────

/**
 * Save a scroll anchor for a feed.
 * Validates all fields before persisting.
 */
export function saveScrollAnchor(
  key: ScrollStorageKey,
  anchorId: string,
  offsetPx: number,
): boolean {
  // Validate inputs
  if (!anchorId || typeof anchorId !== 'string' || anchorId.length > MAX_ANCHOR_ID_LENGTH) {
    return false;
  }
  if (!Number.isFinite(offsetPx) || Math.abs(offsetPx) > MAX_OFFSET_PX) {
    return false;
  }
  if (!key.accountUrl || !key.feedId || !key.instanceOrigin) {
    return false;
  }

  const anchor: ScrollAnchor = {
    v: SCHEMA_VERSION,
    anchorId,
    offsetPx: Math.round(offsetPx),
    capturedAt: Date.now(),
    feedId: key.feedId,
  };

  try {
    const storageKey = buildStorageKey(key);
    sessionStorage.setItem(storageKey, JSON.stringify(anchor));
    return true;
  } catch {
    // QuotaExceeded or SecurityError — non-fatal
    return false;
  }
}

// ─── Restore ─────────────────────────────────────────────────────────────────

/**
 * Restore a scroll anchor for a feed.
 * Returns null if:
 * - No saved anchor exists
 * - The anchor is expired (> 24 hours old)
 * - The stored data fails validation
 * - Storage is unavailable
 *
 * Invalid records are deleted (self-healing).
 */
export function restoreScrollAnchor(key: ScrollStorageKey): ScrollAnchor | null {
  if (!key.accountUrl || !key.feedId || !key.instanceOrigin) {
    return null;
  }

  const storageKey = buildStorageKey(key);

  try {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const validated = validateAnchor(parsed, key.feedId);

    if (!validated) {
      // Self-healing: delete invalid records
      sessionStorage.removeItem(storageKey);
      return null;
    }

    return validated;
  } catch {
    // Corrupted JSON or storage error — delete and return null
    try {
      sessionStorage.removeItem(storageKey);
    } catch { /* ignore */ }
    return null;
  }
}

// ─── Purge ───────────────────────────────────────────────────────────────────

/**
 * Purge scroll anchor for a specific feed.
 * Called on: unpin, unsubscribe, feed removal.
 */
export function purgeScrollAnchor(key: ScrollStorageKey): void {
  try {
    const storageKey = buildStorageKey(key);
    sessionStorage.removeItem(storageKey);
  } catch { /* ignore */ }
}

/**
 * Purge ALL scroll anchors for an account.
 * Called on: logout, account removal, instance change.
 */
export function purgeAllScrollAnchors(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    for (const key of keysToRemove) {
      sessionStorage.removeItem(key);
    }
  } catch { /* ignore */ }
}

// ─── Validation ──────────────────────────────────────────────────────────────

/**
 * Validate a parsed scroll anchor.
 * Returns null if any field is invalid, expired, or mismatched.
 */
function validateAnchor(value: unknown, expectedFeedId: string): ScrollAnchor | null {
  if (!value || typeof value !== 'object') return null;
  const obj = value as Record<string, unknown>;

  // Schema version check
  if (obj.v !== SCHEMA_VERSION) return null;

  // Feed ID must match (cross-feed reads are rejected)
  if (obj.feedId !== expectedFeedId) return null;

  // Anchor ID validation
  if (typeof obj.anchorId !== 'string' || obj.anchorId.length === 0 || obj.anchorId.length > MAX_ANCHOR_ID_LENGTH) {
    return null;
  }
  // No control characters in anchor IDs
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x1f]/.test(obj.anchorId)) return null;

  // Offset validation
  if (typeof obj.offsetPx !== 'number' || !Number.isFinite(obj.offsetPx) || Math.abs(obj.offsetPx) > MAX_OFFSET_PX) {
    return null;
  }

  // Timestamp validation
  if (typeof obj.capturedAt !== 'number' || !Number.isFinite(obj.capturedAt)) return null;

  // TTL check (24 hour expiry)
  const age = Date.now() - obj.capturedAt;
  if (age < 0 || age > MAX_TTL_MS) return null;

  return {
    v: SCHEMA_VERSION,
    anchorId: obj.anchorId,
    offsetPx: Math.round(obj.offsetPx),
    capturedAt: obj.capturedAt,
    feedId: expectedFeedId,
  };
}

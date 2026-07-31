/**
 * Phase 8C-1 — Event deduplication and content identity.
 *
 * Implements exact event idempotency (prevents duplicate delivery from
 * creating duplicate events or inflating share counts) and canonical
 * content-key resolution for same-object grouping.
 *
 * Covers:
 * - Overlapping timeline pages
 * - Streaming events repeated in pagination
 * - Hydration followed by remote refresh
 * - Reconnect replay
 * - Retry delivery
 * - Multi-tab ingestion races
 *
 * Security:
 * - Account-scoped (no cross-account event leakage)
 * - Event keys validated for structure (no control chars, bounded length)
 * - Content keys validated for safe construction
 */

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_EVENT_KEYS = 10_000;
const MAX_KEY_LENGTH = 1024;
const MAX_CONTENT_GROUPS = 5_000;

// ─── Event key store (account-scoped, bounded) ───────────────────────────────

const eventKeyStores = new Map<string, Set<string>>();

function getEventStore(accountScope: string): Set<string> {
  let store = eventKeyStores.get(accountScope);
  if (!store) {
    store = new Set();
    eventKeyStores.set(accountScope, store);
  }
  return store;
}

// ─── Event key generation ────────────────────────────────────────────────────

/**
 * Generate an event key from a timeline event.
 * Uses canonical URI when available, falls back to scoped server ID.
 *
 * Key format ensures no cross-account or cross-feed collisions.
 */
export function generateEventKey(params: {
  accountScope: string;
  feedId: string;
  activityUri?: string | null;
  serverStatusId: string;
  actorId?: string;
  kind: 'original' | 'share';
}): string {
  // Prefer canonical ActivityPub URI
  if (params.activityUri && params.activityUri.startsWith('http')) {
    return `uri:${params.accountScope}:${params.activityUri}`;
  }
  // Fallback: scoped server ID
  return `scoped:${params.accountScope}:${params.feedId}:${params.kind}:${params.serverStatusId}`;
}

/**
 * Generate a content key from a status.
 * Identifies the canonical original post regardless of who shared it.
 *
 * Resolution order (from spec):
 * 1. Validated canonical ActivityPub object URI
 * 2. Validated origin URL
 * 3. Protocol + origin host + origin object ID
 * 4. Connected instance + local status ID (bounded fallback)
 */
export function generateContentKey(params: {
  accountScope: string;
  canonicalUri?: string | null;
  originUrl?: string | null;
  statusId: string;
}): string {
  // 1. Canonical URI (strongest)
  if (params.canonicalUri && isValidUri(params.canonicalUri)) {
    return `content-uri:${params.canonicalUri}`;
  }
  // 2. Origin URL
  if (params.originUrl && isValidUri(params.originUrl)) {
    return `content-url:${params.originUrl}`;
  }
  // 3. Scoped fallback (weakest, but prevents orphans)
  return `content-scoped:${params.accountScope}:${params.statusId}`;
}

// ─── Exact event deduplication ───────────────────────────────────────────────

/**
 * Check if an event has already been ingested.
 * Returns true if this is a duplicate (should be suppressed).
 *
 * If not a duplicate, records the event key for future dedup.
 */
export function isDuplicateEvent(accountScope: string, eventKey: string): boolean {
  if (!accountScope || !eventKey) return false;
  if (!isValidKey(eventKey)) return false;

  const store = getEventStore(accountScope);

  if (store.has(eventKey)) {
    return true; // Duplicate — suppress
  }

  // Record and bound the store
  store.add(eventKey);
  if (store.size > MAX_EVENT_KEYS) {
    evictOldest(store);
  }

  return false;
}

/**
 * Check if an event key exists without recording it.
 * Used for read-only dedup checks during streaming reconciliation.
 */
export function hasEvent(accountScope: string, eventKey: string): boolean {
  const store = eventKeyStores.get(accountScope);
  if (!store) return false;
  return store.has(eventKey);
}

/**
 * Remove an event key (undo/deletion).
 */
export function removeEvent(accountScope: string, eventKey: string): boolean {
  const store = eventKeyStores.get(accountScope);
  if (!store) return false;
  return store.delete(eventKey);
}

// ─── Content group aggregation ───────────────────────────────────────────────

interface ContentGroupState {
  originalStatusId: string;
  originalEventKey?: string;
  shareEventKeys: Set<string>;
  eligibleSharerIds: Set<string>;
  firstServerOrderKey: string;
  latestServerOrderKey: string;
  firstSeenAt: number;
  lastActivityAt: number;
}

const contentGroupStores = new Map<string, Map<string, ContentGroupState>>();

function getContentGroupStore(accountScope: string, feedId: string): Map<string, ContentGroupState> {
  const key = `${accountScope}:${feedId}`;
  let store = contentGroupStores.get(key);
  if (!store) {
    store = new Map();
    contentGroupStores.set(key, store);
  }
  return store;
}

/**
 * Add an event to a content group.
 * Creates the group if it doesn't exist.
 * Returns the updated group state.
 */
export function addToContentGroup(params: {
  accountScope: string;
  feedId: string;
  contentKey: string;
  eventKey: string;
  kind: 'original' | 'share';
  actorId: string;
  statusId: string;
  serverOrderKey: string;
}): ContentGroupState {
  const store = getContentGroupStore(params.accountScope, params.feedId);
  const now = Date.now();

  let group = store.get(params.contentKey);
  if (!group) {
    group = {
      originalStatusId: params.statusId,
      shareEventKeys: new Set(),
      eligibleSharerIds: new Set(),
      firstServerOrderKey: params.serverOrderKey,
      latestServerOrderKey: params.serverOrderKey,
      firstSeenAt: now,
      lastActivityAt: now,
    };
    store.set(params.contentKey, group);

    // Bound store size
    if (store.size > MAX_CONTENT_GROUPS) {
      evictOldestGroup(store);
    }
  }

  if (params.kind === 'original') {
    group.originalEventKey = params.eventKey;
    group.originalStatusId = params.statusId;
  } else {
    group.shareEventKeys.add(params.eventKey);
    group.eligibleSharerIds.add(params.actorId);
  }

  // Update order tracking
  if (params.serverOrderKey > group.latestServerOrderKey) {
    group.latestServerOrderKey = params.serverOrderKey;
  }
  if (params.serverOrderKey < group.firstServerOrderKey) {
    group.firstServerOrderKey = params.serverOrderKey;
  }
  group.lastActivityAt = now;

  return group;
}

/**
 * Remove an actor from a content group (undo share).
 * Returns true if the group still has remaining events.
 */
export function removeFromContentGroup(params: {
  accountScope: string;
  feedId: string;
  contentKey: string;
  eventKey: string;
  actorId: string;
}): boolean {
  const store = getContentGroupStore(params.accountScope, params.feedId);
  const group = store.get(params.contentKey);
  if (!group) return false;

  group.shareEventKeys.delete(params.eventKey);
  group.eligibleSharerIds.delete(params.actorId);

  // If no events remain and no original, remove the group
  if (group.shareEventKeys.size === 0 && !group.originalEventKey) {
    store.delete(params.contentKey);
    return false;
  }

  return true;
}

/**
 * Get a content group for rendering.
 */
export function getContentGroup(
  accountScope: string,
  feedId: string,
  contentKey: string,
): ContentGroupState | undefined {
  const store = contentGroupStores.get(`${accountScope}:${feedId}`);
  return store?.get(contentKey);
}

/**
 * Get all content groups for a feed (for shelf evaluation).
 */
export function getAllContentGroups(
  accountScope: string,
  feedId: string,
): ReadonlyArray<[string, ContentGroupState]> {
  const store = contentGroupStores.get(`${accountScope}:${feedId}`);
  if (!store) return [];
  return [...store.entries()];
}

// ─── Purge ───────────────────────────────────────────────────────────────────

/**
 * Purge all shared activity state for an account.
 */
export function purgeAccountState(accountScope: string): void {
  eventKeyStores.delete(accountScope);
  // Remove all content group stores for this account
  for (const key of contentGroupStores.keys()) {
    if (key.startsWith(accountScope + ':')) {
      contentGroupStores.delete(key);
    }
  }
}

/**
 * Reset all state (for testing).
 */
export function resetAllState(): void {
  eventKeyStores.clear();
  contentGroupStores.clear();
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isValidKey(key: string): boolean {
  if (key.length === 0 || key.length > MAX_KEY_LENGTH) return false;
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x1f]/.test(key)) return false;
  return true;
}

function isValidUri(uri: string): boolean {
  if (!uri || uri.length > 2048) return false;
  try {
    const parsed = new URL(uri);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function evictOldest(store: Set<string>): void {
  // Remove ~10% of entries (oldest by insertion order)
  const toRemove = Math.floor(store.size * 0.1);
  let removed = 0;
  for (const key of store) {
    if (removed >= toRemove) break;
    store.delete(key);
    removed++;
  }
}

function evictOldestGroup(store: Map<string, ContentGroupState>): void {
  let oldestKey: string | undefined;
  let oldestTime = Infinity;
  for (const [key, group] of store) {
    if (group.firstSeenAt < oldestTime) {
      oldestTime = group.firstSeenAt;
      oldestKey = key;
    }
  }
  if (oldestKey) store.delete(oldestKey);
}

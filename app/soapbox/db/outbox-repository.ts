/**
 * Phase 6 — Durable outbox repository.
 *
 * Account-scoped persistence for outbox operations. Provides:
 * - Enqueue: add new operations with stable IDs
 * - Dequeue: fetch operations ready for execution (respecting priority + deps)
 * - State transitions: pending → in-flight → completed/retrying/failed
 * - Queries: by state, for UI display
 * - Recovery: retry, cancel, discard
 * - Retention: purge completed operations older than a threshold
 *
 * All operations are account-scoped (IDOR protection at the storage layer).
 */

import db from './instance';

import type { AccountScope } from './repository';
import type { StoredOutboxEntry } from './schema';
import type { OutboxEntry, OutboxState } from 'soapbox/domain/outbox-operation';

// ─── Write Helpers ───────────────────────────────────────────────────────────

const MAX_WRITE_RETRIES = 3;
const BASE_BACKOFF_MS = 100;

async function writeWithBackoff<T>(operation: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < MAX_WRITE_RETRIES; attempt++) {
    try {
      return await operation();
    } catch (error: unknown) {
      lastError = error;
      if (isQuotaError(error)) {
        if (attempt < MAX_WRITE_RETRIES - 1) {
          const delay = BASE_BACKOFF_MS * Math.pow(2, attempt) * (0.5 + Math.random() * 0.5);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
      throw error;
    }
  }
  throw lastError;
}

function isQuotaError(error: unknown): boolean {
  if (error instanceof DOMException) {
    return error.name === 'QuotaExceededError' || error.code === 22;
  }
  if (error && typeof error === 'object' && 'inner' in error) {
    return isQuotaError((error as { inner: unknown }).inner);
  }
  return false;
}

// ─── Repository ──────────────────────────────────────────────────────────────

/**
 * Enqueue a new outbox operation.
 * The entry must have a pre-generated ID (UUIDv4) and valid accountUrl.
 */
export async function enqueue(scope: AccountScope, entry: OutboxEntry): Promise<void> {
  const record: StoredOutboxEntry = {
    ...entry,
    accountUrl: scope.accountUrl,
    localUpdatedAt: Date.now(),
  };
  await writeWithBackoff(() => db.outbox.put(record));
}

/**
 * Get a single outbox entry by ID.
 */
export async function getEntry(scope: AccountScope, id: string): Promise<OutboxEntry | undefined> {
  const record = await db.outbox.get([scope.accountUrl, id]);
  if (!record) return undefined;
  if (record.accountUrl !== scope.accountUrl) return undefined;
  return record as unknown as OutboxEntry;
}

/**
 * Update mutable fields on an outbox entry.
 * Only updates: state, attemptedAt, nextAttemptAt, completedAt,
 * attemptCount, lastFailureReason, lastErrorMessage, serverRetryAfterMs, result.
 */
export async function updateEntry(
  scope: AccountScope,
  id: string,
  update: Partial<Pick<OutboxEntry,
    | 'state'
    | 'attemptedAt'
    | 'nextAttemptAt'
    | 'completedAt'
    | 'attemptCount'
    | 'lastFailureReason'
    | 'lastErrorMessage'
    | 'serverRetryAfterMs'
    | 'result'
  >>,
): Promise<void> {
  await writeWithBackoff(async() => {
    const existing = await db.outbox.get([scope.accountUrl, id]);
    if (!existing || existing.accountUrl !== scope.accountUrl) return;
    const updated: StoredOutboxEntry = {
      ...existing,
      ...update,
      localUpdatedAt: Date.now(),
    };
    await db.outbox.put(updated);
  });
}

/**
 * Get all operations ready to execute:
 * - state is 'pending' or 'retrying'
 * - nextAttemptAt is null or <= now
 * - all dependencies are completed
 *
 * Returns entries sorted by priority (ascending), then createdAt (ascending).
 */
export async function getReadyOperations(
  scope: AccountScope,
  now: number = Date.now(),
  limit: number = 10,
): Promise<OutboxEntry[]> {
  // Get all pending/retrying operations for this account
  const candidates = await db.outbox
    .where('accountUrl')
    .equals(scope.accountUrl)
    .and(r => (r.state === 'pending' || r.state === 'retrying'))
    .and(r => r.nextAttemptAt === null || r.nextAttemptAt <= now)
    .toArray();

  if (candidates.length === 0) return [];

  // Filter by dependency completion
  const completedIds = new Set<string>();

  // Get completed operation IDs for dependency checks
  const allOps = await db.outbox
    .where('accountUrl')
    .equals(scope.accountUrl)
    .toArray();
  for (const op of allOps) {
    if (op.state === 'completed') completedIds.add(op.id);
  }

  const ready = candidates.filter(entry => {
    if (entry.dependsOn.length === 0) return true;
    // All dependencies must be completed (not just absent)
    return entry.dependsOn.every(depId => completedIds.has(depId));
  });

  // Sort: priority ASC, createdAt ASC
  ready.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.createdAt - b.createdAt;
  });

  return ready.slice(0, limit) as unknown as OutboxEntry[];
}

/**
 * Get all operations in a specific state for an account.
 * Used for UI display (e.g., show all pending/failed items).
 */
export async function getByState(
  scope: AccountScope,
  state: OutboxState,
  options: { limit?: number; reverse?: boolean } = {},
): Promise<OutboxEntry[]> {
  const { limit = 50, reverse = false } = options;
  let collection = db.outbox
    .where('[accountUrl+state]')
    .equals([scope.accountUrl, state]);

  if (reverse) collection = collection.reverse();
  const records = await collection.limit(limit).toArray();
  return records as unknown as OutboxEntry[];
}

/**
 * Get all non-terminal operations for an account.
 * Terminal states: completed, cancelled, failed.
 */
export async function getActiveOperations(scope: AccountScope): Promise<OutboxEntry[]> {
  const records = await db.outbox
    .where('accountUrl')
    .equals(scope.accountUrl)
    .and(r => r.state !== 'completed' && r.state !== 'cancelled' && r.state !== 'failed')
    .toArray();

  records.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.createdAt - b.createdAt;
  });

  return records as unknown as OutboxEntry[];
}

/**
 * Count operations by state for an account.
 * Returns a map of state → count for UI badge display.
 */
export async function countByState(scope: AccountScope): Promise<Record<OutboxState, number>> {
  const counts: Record<OutboxState, number> = {
    'pending': 0,
    'in-flight': 0,
    'retrying': 0,
    'failed': 0,
    'conflict': 0,
    'completed': 0,
    'cancelled': 0,
  };

  const records = await db.outbox
    .where('accountUrl')
    .equals(scope.accountUrl)
    .toArray();

  for (const r of records) {
    if (r.state in counts) {
      counts[r.state as OutboxState]++;
    }
  }

  return counts;
}

/**
 * Cancel a pending/retrying operation.
 * Only allowed for non-terminal, non-in-flight states.
 */
export async function cancelEntry(scope: AccountScope, id: string): Promise<boolean> {
  const entry = await db.outbox.get([scope.accountUrl, id]);
  if (!entry || entry.accountUrl !== scope.accountUrl) return false;
  if (entry.state === 'completed' || entry.state === 'cancelled' || entry.state === 'in-flight') {
    return false;
  }
  await writeWithBackoff(() => db.outbox.put({
    ...entry,
    state: 'cancelled',
    completedAt: Date.now(),
    localUpdatedAt: Date.now(),
  }));
  return true;
}

/**
 * Retry a failed or conflict operation.
 * Resets state to 'pending' and clears retry timing.
 */
export async function retryEntry(scope: AccountScope, id: string): Promise<boolean> {
  const entry = await db.outbox.get([scope.accountUrl, id]);
  if (!entry || entry.accountUrl !== scope.accountUrl) return false;
  if (entry.state !== 'failed' && entry.state !== 'conflict') return false;
  await writeWithBackoff(() => db.outbox.put({
    ...entry,
    state: 'pending',
    nextAttemptAt: null,
    completedAt: null,
    lastFailureReason: null,
    lastErrorMessage: null,
    serverRetryAfterMs: null,
    localUpdatedAt: Date.now(),
  }));
  return true;
}

/**
 * Permanently delete a terminal operation (completed/cancelled/failed).
 * Used for manual cleanup and the "discard" recovery action.
 */
export async function discardEntry(scope: AccountScope, id: string): Promise<boolean> {
  const entry = await db.outbox.get([scope.accountUrl, id]);
  if (!entry || entry.accountUrl !== scope.accountUrl) return false;
  if (entry.state !== 'completed' && entry.state !== 'cancelled' && entry.state !== 'failed') {
    return false; // Can only discard terminal operations
  }
  await db.outbox.delete([scope.accountUrl, id]);
  return true;
}

/**
 * Purge completed operations older than a threshold.
 * Called periodically to prevent unbounded growth.
 */
export async function purgeCompleted(
  scope: AccountScope,
  olderThanMs: number = 24 * 60 * 60 * 1000, // Default: 24 hours
): Promise<number> {
  const cutoff = Date.now() - olderThanMs;
  const toDelete = await db.outbox
    .where('accountUrl')
    .equals(scope.accountUrl)
    .and(r => (r.state === 'completed' || r.state === 'cancelled') && (r.completedAt ?? 0) < cutoff)
    .primaryKeys();

  if (toDelete.length > 0) {
    await db.outbox.bulkDelete(toDelete);
  }
  return toDelete.length;
}

/**
 * Purge ALL outbox data for an account (logout/account removal).
 */
export async function purgeAccount(scope: AccountScope): Promise<number> {
  return db.outbox.where('accountUrl').equals(scope.accountUrl).delete();
}

/**
 * Recover from crash: reset any operations stuck in 'in-flight' state
 * back to 'retrying'. Called at startup.
 */
export async function recoverStaleInflight(scope: AccountScope): Promise<number> {
  const stale = await db.outbox
    .where('[accountUrl+state]')
    .equals([scope.accountUrl, 'in-flight'])
    .toArray();

  if (stale.length === 0) return 0;

  const now = Date.now();
  const updates = stale.map(entry => ({
    ...entry,
    state: 'retrying' as const,
    nextAttemptAt: now, // Retry immediately after crash recovery
    localUpdatedAt: now,
  }));

  await writeWithBackoff(() => db.outbox.bulkPut(updates));
  return stale.length;
}

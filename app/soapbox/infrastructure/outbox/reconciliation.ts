/**
 * Phase 6D — Stream/poll reconciliation.
 *
 * Handles duplicate detection and out-of-order event processing
 * for the outbox system. When a server response arrives (via polling,
 * streaming, or push), this module determines whether it conflicts with
 * or supersedes a pending outbox operation.
 *
 * Key scenarios:
 * 1. User favourites a status offline → online event confirms it's already
 *    favourited → outbox operation can be discarded (skip-if-done).
 * 2. User creates a status → reconnects → the created status appears in
 *    timeline via streaming → outbox operation result is matched by
 *    idempotency key or content fingerprint.
 * 3. User edits a status offline → another device edits it first →
 *    conflict detected (fail-on-conflict).
 *
 * This module is stateless — it takes the current outbox state and an
 * incoming event and returns a reconciliation decision.
 */

import type { OutboxEntry, ConflictPolicy } from 'soapbox/domain/outbox-operation';

// ─── Reconciliation decisions ────────────────────────────────────────────────

export type ReconciliationAction =
  | 'no-op'          // Event is unrelated to any pending operation
  | 'complete'       // Event confirms the operation succeeded (mark completed)
  | 'skip'           // Remote state already satisfies the intent (cancel)
  | 'conflict'       // Remote state contradicts local intent (mark conflict)
  | 'supersede';     // A newer local operation supersedes this one (cancel older)

export interface ReconciliationResult {
  action: ReconciliationAction;
  operationId: string | null;
  reason: string;
}

// ─── Incoming event representation ──────────────────────────────────────────

/**
 * A normalized incoming event from the server.
 * This could arrive via streaming WebSocket, polling, or push notification.
 */
export interface IncomingEvent {
  /** Type of event (e.g., 'status.created', 'status.favourited') */
  type: string;
  /** The entity ID this event relates to */
  entityId: string;
  /** Whether the action is now in the "done" state on the server */
  isDone: boolean;
  /** Server-provided idempotency key if available (from response headers) */
  idempotencyKey?: string | null;
  /** Timestamp from server (for ordering) */
  serverTimestamp?: number;
}

// ─── Core reconciliation logic ───────────────────────────────────────────────

/**
 * Given a set of active outbox operations and an incoming server event,
 * determine if any outbox operation should be reconciled.
 *
 * This is the central dedup/ordering function.
 */
export function reconcile(
  activeOperations: ReadonlyArray<OutboxEntry>,
  event: IncomingEvent,
): ReconciliationResult {
  if (activeOperations.length === 0) {
    return { action: 'no-op', operationId: null, reason: 'No active operations.' };
  }

  // 1. Check for idempotency key match (strongest signal)
  if (event.idempotencyKey) {
    const match = activeOperations.find(
      op => op.idempotencyKey === event.idempotencyKey,
    );
    if (match) {
      return {
        action: 'complete',
        operationId: match.id,
        reason: 'Idempotency key matched server response.',
      };
    }
  }

  // 2. Check for operations targeting the same entity
  const relatedOps = activeOperations.filter(op => {
    const payload = op.payload as Record<string, unknown> | null;
    if (!payload) return false;
    const targetId = payload.statusId || payload.accountId || payload.pollId || payload.notificationId;
    return targetId === event.entityId;
  });

  if (relatedOps.length === 0) {
    return { action: 'no-op', operationId: null, reason: 'No operations target this entity.' };
  }

  // 3. Apply conflict policy per operation
  for (const op of relatedOps) {
    const decision = applyConflictPolicy(op, event);
    if (decision.action !== 'no-op') {
      return decision;
    }
  }

  return { action: 'no-op', operationId: null, reason: 'No actionable reconciliation.' };
}

/**
 * Apply the operation's conflict policy against an incoming event.
 */
function applyConflictPolicy(
  operation: OutboxEntry,
  event: IncomingEvent,
): ReconciliationResult {
  const policy = operation.conflictPolicy as ConflictPolicy;

  switch (policy) {
    case 'skip-if-done':
      // Toggle operations: if the server says it's already done, skip
      if (event.isDone && isToggleOperation(operation, event)) {
        return {
          action: 'skip',
          operationId: operation.id,
          reason: 'Server state already satisfies the operation intent.',
        };
      }
      break;

    case 'last-write-wins':
      // Markers: always proceed with local state, no conflict possible
      return { action: 'no-op', operationId: null, reason: 'Last-write-wins: no conflict.' };

    case 'fail-on-conflict':
      // Edits/creates: if server has a newer version, it's a conflict
      if (event.type === 'status.updated' && operation.operationType === 'status.edit') {
        // The status was edited remotely while we had a pending edit
        if (operation.state === 'pending' || operation.state === 'retrying') {
          return {
            action: 'conflict',
            operationId: operation.id,
            reason: 'Remote edit detected while local edit is pending.',
          };
        }
      }
      break;

    case 'merge':
      // Future: structural merge. For now, treat as conflict.
      return {
        action: 'conflict',
        operationId: operation.id,
        reason: 'Merge conflict detected (merge not yet implemented).',
      };
  }

  return { action: 'no-op', operationId: null, reason: 'Policy does not require action.' };
}

/**
 * Determine if an operation is a toggle whose intent matches the event state.
 * E.g., status.favourite + event says "favourited=true" → skip.
 */
function isToggleOperation(operation: OutboxEntry, event: IncomingEvent): boolean {
  const toggleMap: Record<string, string> = {
    'status.favourite': 'status.favourited',
    'status.unfavourite': 'status.unfavourited',
    'status.reblog': 'status.reblogged',
    'status.unreblog': 'status.unreblogged',
    'status.bookmark': 'status.bookmarked',
    'status.unbookmark': 'status.unbookmarked',
    'status.pin': 'status.pinned',
    'status.unpin': 'status.unpinned',
    'status.mute': 'status.muted',
    'status.unmute': 'status.unmuted',
    'account.follow': 'account.followed',
    'account.unfollow': 'account.unfollowed',
    'account.block': 'account.blocked',
    'account.unblock': 'account.unblocked',
    'account.mute': 'account.muted',
    'account.unmute': 'account.unmuted',
  };

  const expectedEvent = toggleMap[operation.operationType];
  return expectedEvent === event.type;
}

// ─── Duplicate detection for status creation ─────────────────────────────────

/**
 * Check if an incoming status creation event matches a pending outbox create.
 * Uses content fingerprinting as a fallback when idempotency keys aren't
 * available (e.g., server doesn't echo the key back).
 *
 * Returns the operation ID if a match is found, null otherwise.
 */
export function detectDuplicateCreate(
  activeOperations: ReadonlyArray<OutboxEntry>,
  incomingStatus: { content?: string; createdAt?: string },
): string | null {
  if (!incomingStatus.content) return null;

  // Normalize content for comparison (strip HTML, lowercase, trim)
  const normalizedIncoming = normalizeContent(incomingStatus.content);
  if (!normalizedIncoming) return null;

  // Only consider recent pending/in-flight creates (within last 5 minutes)
  const fiveMinAgo = Date.now() - 5 * 60 * 1000;

  for (const op of activeOperations) {
    if (op.operationType !== 'status.create') continue;
    if (op.state !== 'pending' && op.state !== 'in-flight' && op.state !== 'retrying') continue;
    if (op.createdAt < fiveMinAgo) continue;

    const payload = op.payload as Record<string, unknown> | null;
    if (!payload || typeof payload.content !== 'string') continue;

    const normalizedLocal = normalizeContent(payload.content);
    if (normalizedLocal && normalizedLocal === normalizedIncoming) {
      return op.id;
    }
  }

  return null;
}

/**
 * Normalize content for duplicate comparison.
 * Strips HTML tags, collapses whitespace, lowercases.
 */
function normalizeContent(html: string): string {
  // Strip HTML tags
  const text = html.replace(/<[^>]*>/g, '');
  // Decode common entities
  const decoded = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'');
  // Collapse whitespace and trim
  return decoded.replace(/\s+/g, ' ').trim().toLowerCase();
}

// ─── Out-of-order event handling ─────────────────────────────────────────────

/**
 * Determine if an outbox operation is stale given a server event timestamp.
 * Used to detect when server events arrive out of order relative to
 * local operations.
 *
 * An operation is considered stale if:
 * - It was created before the server event
 * - AND the server event supersedes its intent
 */
export function isOperationStale(
  operation: OutboxEntry,
  serverTimestamp: number,
): boolean {
  // If the server event is older than our operation, our operation wins
  if (serverTimestamp < operation.createdAt) return false;

  // If the operation is already completed/cancelled, it's not stale (it's done)
  if (operation.state === 'completed' || operation.state === 'cancelled') return false;

  // For toggle operations, a newer server event means our toggle is stale
  // (server state already reflects something newer)
  return true;
}

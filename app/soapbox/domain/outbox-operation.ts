/**
 * Phase 6 — Durable outbox domain types.
 *
 * Defines the contract for all outbox operations. Every mutation
 * that leaves the device goes through the outbox with stable IDs,
 * retry metadata, and user-visible lifecycle states.
 *
 * Design principles:
 * - Pure types with no runtime dependencies
 * - Account-scoped by design (every operation belongs to one account)
 * - Dependency-aware (uploads before posts)
 * - Conflict-aware (edits may conflict with remote changes)
 * - Never retry authentication/authorization/validation failures
 */

// ─── Operation Lifecycle ─────────────────────────────────────────────────────

/**
 * User-visible outbox states.
 * These map directly to UI affordances (pending badge, retry indicator, etc.)
 */
export type OutboxState =
  | 'pending'      // Queued, awaiting first attempt
  | 'in-flight'    // Currently being sent to the server
  | 'retrying'     // Failed transiently, will retry automatically
  | 'failed'       // Permanently failed, requires user intervention
  | 'conflict'     // Server state conflicts with local intent
  | 'completed'    // Successfully delivered (retained briefly for UI feedback)
  | 'cancelled';   // User cancelled before delivery

// ─── Operation Types ─────────────────────────────────────────────────────────

/**
 * Supported mutation types. Each type has its own idempotency
 * and conflict strategy.
 */
export type OutboxOperationType =
  | 'status.create'
  | 'status.edit'
  | 'status.delete'
  | 'status.favourite'
  | 'status.unfavourite'
  | 'status.reblog'
  | 'status.unreblog'
  | 'status.bookmark'
  | 'status.unbookmark'
  | 'status.pin'
  | 'status.unpin'
  | 'status.mute'
  | 'status.unmute'
  | 'media.upload'
  | 'poll.vote'
  | 'account.follow'
  | 'account.unfollow'
  | 'account.block'
  | 'account.unblock'
  | 'account.mute'
  | 'account.unmute'
  | 'report.create'
  | 'notification.dismiss'
  | 'notifications.clear'
  | 'marker.update';

// ─── Conflict Policy ─────────────────────────────────────────────────────────

/**
 * How to handle conflicts between local intent and remote state.
 */
export type ConflictPolicy =
  | 'last-write-wins'    // Overwrite regardless (simple toggles)
  | 'fail-on-conflict'   // Surface to user (edits, drafts)
  | 'merge'              // Attempt structural merge (future)
  | 'skip-if-done';      // If the server already has the desired state, skip

// ─── Idempotency Strategy ────────────────────────────────────────────────────

/**
 * How the operation ensures it doesn't create duplicates.
 */
export type IdempotencyStrategy =
  | 'idempotency-key'     // Server supports Idempotency-Key header
  | 'check-before-send'   // Verify state before sending (e.g., already favourited?)
  | 'naturally-idempotent' // Operation is inherently idempotent (deletes, unfollows)
  | 'none';               // No idempotency guarantee (best-effort)

// ─── Retry Classification ────────────────────────────────────────────────────

/**
 * Why an attempt failed. Drives retry decisions.
 */
export type FailureReason =
  | 'network'            // Could not reach server
  | 'timeout'            // Request timed out
  | 'rate-limited'       // 429 response
  | 'server-error'       // 5xx response
  | 'unauthorized'       // 401 — do not retry
  | 'forbidden'          // 403 — do not retry
  | 'validation'         // 422/400 — do not retry
  | 'not-found'          // 404 — do not retry
  | 'conflict'           // 409 — surface to user
  | 'gone'              // 410 — do not retry
  | 'quota-exceeded'     // Storage full locally
  | 'cancelled'          // User or system cancelled
  | 'unknown';           // Unclassified

// ─── Stored Outbox Entry ─────────────────────────────────────────────────────

/**
 * The full outbox record persisted to IndexedDB.
 * This is the single source of truth for a pending mutation.
 */
export interface OutboxEntry {
  /** Stable client-generated operation ID (UUIDv4). Primary identity. */
  readonly id: string;

  /** Account URL that owns this operation (partition key). */
  readonly accountUrl: string;

  /** What kind of mutation this is. */
  readonly operationType: OutboxOperationType;

  /** User-visible lifecycle state. */
  state: OutboxState;

  /** Operation-specific payload (e.g., status content, media blob reference). */
  readonly payload: unknown;

  /** Idempotency key sent to the server (if strategy requires it). */
  readonly idempotencyKey: string | null;

  /** How this operation handles duplicates. */
  readonly idempotencyStrategy: IdempotencyStrategy;

  /** How to handle conflicts with remote state. */
  readonly conflictPolicy: ConflictPolicy;

  /**
   * Operations that must complete before this one.
   * E.g., media.upload IDs that must succeed before status.create.
   */
  readonly dependsOn: string[];

  /**
   * Priority within the queue. Lower = higher priority.
   * Default is 100. Cancellations/deletes get priority 10.
   */
  readonly priority: number;

  // ─── Timing ──────────────────────────────────────────────────────────

  /** When the operation was enqueued (ms since epoch). */
  readonly createdAt: number;

  /** When the operation was last attempted. */
  attemptedAt: number | null;

  /** When the next retry should occur. null = immediate or manual. */
  nextAttemptAt: number | null;

  /** When the operation reached a terminal state. */
  completedAt: number | null;

  // ─── Retry tracking ──────────────────────────────────────────────────

  /** Number of delivery attempts made. */
  attemptCount: number;

  /** Maximum attempts before permanent failure. */
  readonly maxAttempts: number;

  /** Last failure reason (null if never failed). */
  lastFailureReason: FailureReason | null;

  /** Human-readable error message from last failure. */
  lastErrorMessage: string | null;

  /** Server-suggested retry delay (from Retry-After header). */
  serverRetryAfterMs: number | null;

  // ─── Result ──────────────────────────────────────────────────────────

  /** Server response data on success (e.g., created status ID). */
  result: unknown | null;
}

// ─── Factory Defaults ────────────────────────────────────────────────────────

/** Maximum retry attempts per operation type. */
export const MAX_ATTEMPTS: Record<OutboxOperationType, number> = {
  'status.create': 5,
  'status.edit': 5,
  'status.delete': 8,
  'status.favourite': 3,
  'status.unfavourite': 3,
  'status.reblog': 3,
  'status.unreblog': 3,
  'status.bookmark': 3,
  'status.unbookmark': 3,
  'status.pin': 3,
  'status.unpin': 3,
  'status.mute': 3,
  'status.unmute': 3,
  'media.upload': 4,
  'poll.vote': 3,
  'account.follow': 3,
  'account.unfollow': 3,
  'account.block': 3,
  'account.unblock': 3,
  'account.mute': 3,
  'account.unmute': 3,
  'report.create': 5,
  'notification.dismiss': 3,
  'notifications.clear': 3,
  'marker.update': 3,
};

/** Default idempotency strategy per operation type. */
export const DEFAULT_IDEMPOTENCY: Record<OutboxOperationType, IdempotencyStrategy> = {
  'status.create': 'idempotency-key',
  'status.edit': 'idempotency-key',
  'status.delete': 'naturally-idempotent',
  'status.favourite': 'check-before-send',
  'status.unfavourite': 'check-before-send',
  'status.reblog': 'check-before-send',
  'status.unreblog': 'check-before-send',
  'status.bookmark': 'check-before-send',
  'status.unbookmark': 'check-before-send',
  'status.pin': 'check-before-send',
  'status.unpin': 'check-before-send',
  'status.mute': 'check-before-send',
  'status.unmute': 'check-before-send',
  'media.upload': 'idempotency-key',
  'poll.vote': 'check-before-send',
  'account.follow': 'check-before-send',
  'account.unfollow': 'check-before-send',
  'account.block': 'check-before-send',
  'account.unblock': 'check-before-send',
  'account.mute': 'check-before-send',
  'account.unmute': 'check-before-send',
  'report.create': 'idempotency-key',
  'notification.dismiss': 'naturally-idempotent',
  'notifications.clear': 'naturally-idempotent',
  'marker.update': 'naturally-idempotent',
};

/** Default conflict policy per operation type. */
export const DEFAULT_CONFLICT_POLICY: Record<OutboxOperationType, ConflictPolicy> = {
  'status.create': 'fail-on-conflict',
  'status.edit': 'fail-on-conflict',
  'status.delete': 'skip-if-done',
  'status.favourite': 'skip-if-done',
  'status.unfavourite': 'skip-if-done',
  'status.reblog': 'skip-if-done',
  'status.unreblog': 'skip-if-done',
  'status.bookmark': 'skip-if-done',
  'status.unbookmark': 'skip-if-done',
  'status.pin': 'skip-if-done',
  'status.unpin': 'skip-if-done',
  'status.mute': 'skip-if-done',
  'status.unmute': 'skip-if-done',
  'media.upload': 'fail-on-conflict',
  'poll.vote': 'skip-if-done',
  'account.follow': 'skip-if-done',
  'account.unfollow': 'skip-if-done',
  'account.block': 'skip-if-done',
  'account.unblock': 'skip-if-done',
  'account.mute': 'skip-if-done',
  'account.unmute': 'skip-if-done',
  'report.create': 'fail-on-conflict',
  'notification.dismiss': 'skip-if-done',
  'notifications.clear': 'skip-if-done',
  'marker.update': 'last-write-wins',
};

/** Failure reasons that should never be retried. */
export const PERMANENT_FAILURES: ReadonlySet<FailureReason> = new Set([
  'unauthorized',
  'forbidden',
  'validation',
  'not-found',
  'gone',
  'cancelled',
]);

/** Whether a failure reason allows automatic retry. */
export function isRetryable(reason: FailureReason): boolean {
  return !PERMANENT_FAILURES.has(reason);
}

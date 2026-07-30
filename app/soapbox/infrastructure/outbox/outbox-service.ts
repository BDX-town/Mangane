/**
 * Phase 6 — Outbox service.
 *
 * High-level API for enqueuing mutations into the durable outbox.
 * This is the primary interface that feature code calls to create
 * reliable offline-first mutations.
 *
 * Responsibilities:
 * - Generate stable operation IDs
 * - Apply default configuration per operation type
 * - Persist to IndexedDB via the outbox repository
 * - Trigger the processor to begin delivery
 * - Provide query methods for UI consumption
 */

import * as outboxRepo from 'soapbox/db/outbox-repository';
import {
  DEFAULT_CONFLICT_POLICY,
  DEFAULT_IDEMPOTENCY,
  MAX_ATTEMPTS,
} from 'soapbox/domain/outbox-operation';

import { onOperationEnqueued } from './outbox-processor';

import type { AccountScope } from 'soapbox/db/repository';
import type {
  ConflictPolicy,
  IdempotencyStrategy,
  OutboxEntry,
  OutboxOperationType,
  OutboxState,
} from 'soapbox/domain/outbox-operation';

// ─── ID Generation ───────────────────────────────────────────────────────────

/**
 * Generate a stable UUIDv4 operation ID.
 * Uses crypto.randomUUID() where available, falls back to manual generation.
 */
function generateOperationId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate an idempotency key for server-side deduplication.
 * Format: mangane-{operationType}-{uuid} to namespace by app.
 */
function generateIdempotencyKey(operationType: OutboxOperationType): string {
  return `mangane-${operationType}-${generateOperationId()}`;
}

// ─── Enqueue Options ─────────────────────────────────────────────────────────

export interface EnqueueOptions {
  /** Operation-specific payload (e.g., status content, target ID). */
  payload: unknown;

  /** Operations that must complete before this one. */
  dependsOn?: string[];

  /** Priority override (lower = higher priority). Default: 100. */
  priority?: number;

  /** Override idempotency strategy for this operation. */
  idempotencyStrategy?: IdempotencyStrategy;

  /** Override conflict policy for this operation. */
  conflictPolicy?: ConflictPolicy;

  /** Override max attempts for this operation. */
  maxAttempts?: number;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Enqueue a new mutation into the durable outbox.
 *
 * Returns the generated operation ID (stable reference for dependency chaining
 * and UI tracking).
 *
 * @example
 * // Simple favourite
 * await enqueue(scope, 'status.favourite', { payload: { statusId: '123' } });
 *
 * // Upload + post with dependency
 * const uploadId = await enqueue(scope, 'media.upload', { payload: { file: blob } });
 * await enqueue(scope, 'status.create', {
 *   payload: { content: 'Hello!', mediaIds: [uploadId] },
 *   dependsOn: [uploadId],
 * });
 */
export async function enqueue(
  scope: AccountScope,
  operationType: OutboxOperationType,
  options: EnqueueOptions,
): Promise<string> {
  const id = generateOperationId();
  const now = Date.now();

  const idempotencyStrategy = options.idempotencyStrategy ?? DEFAULT_IDEMPOTENCY[operationType];
  const idempotencyKey = idempotencyStrategy === 'idempotency-key'
    ? generateIdempotencyKey(operationType)
    : null;

  const entry: OutboxEntry = {
    id,
    accountUrl: scope.accountUrl,
    operationType,
    state: 'pending',
    payload: options.payload,
    idempotencyKey,
    idempotencyStrategy,
    conflictPolicy: options.conflictPolicy ?? DEFAULT_CONFLICT_POLICY[operationType],
    dependsOn: options.dependsOn ?? [],
    priority: options.priority ?? 100,
    createdAt: now,
    attemptedAt: null,
    nextAttemptAt: null,
    completedAt: null,
    attemptCount: 0,
    maxAttempts: options.maxAttempts ?? MAX_ATTEMPTS[operationType],
    lastFailureReason: null,
    lastErrorMessage: null,
    serverRetryAfterMs: null,
    result: null,
  };

  await outboxRepo.enqueue(scope, entry);
  onOperationEnqueued(scope);

  return id;
}

/**
 * Cancel a pending or retrying operation.
 * Returns true if the operation was cancelled, false if not cancellable.
 */
export async function cancel(scope: AccountScope, operationId: string): Promise<boolean> {
  const result = await outboxRepo.cancelEntry(scope, operationId);
  return result;
}

/**
 * Retry a failed or conflicting operation.
 * Resets state to pending and triggers the processor.
 */
export async function retry(scope: AccountScope, operationId: string): Promise<boolean> {
  const result = await outboxRepo.retryEntry(scope, operationId);
  if (result) {
    onOperationEnqueued(scope);
  }
  return result;
}

/**
 * Permanently discard a terminal operation.
 * Removes it from the outbox entirely.
 */
export async function discard(scope: AccountScope, operationId: string): Promise<boolean> {
  return outboxRepo.discardEntry(scope, operationId);
}

/**
 * Get all active (non-terminal) operations for display.
 */
export async function getActive(scope: AccountScope): Promise<OutboxEntry[]> {
  return outboxRepo.getActiveOperations(scope);
}

/**
 * Get operations in a specific state.
 */
export async function getByState(scope: AccountScope, state: OutboxState): Promise<OutboxEntry[]> {
  return outboxRepo.getByState(scope, state);
}

/**
 * Get state counts for badge/indicator display.
 */
export async function getCounts(scope: AccountScope): Promise<Record<OutboxState, number>> {
  return outboxRepo.countByState(scope);
}

/**
 * Get a single operation by ID.
 */
export async function getOperation(scope: AccountScope, id: string): Promise<OutboxEntry | undefined> {
  return outboxRepo.getEntry(scope, id);
}

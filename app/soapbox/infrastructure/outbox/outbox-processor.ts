/**
 * Phase 6 — Outbox processor.
 *
 * The core engine that dequeues pending operations and executes them.
 * Runs on a tick-based loop (not continuous polling) triggered by:
 * - New operation enqueued
 * - Timer fires for a scheduled retry
 * - Network comes back online
 * - User explicitly requests retry
 *
 * Concurrency: processes one operation at a time per account to
 * avoid dependency races. The processor is stateless between ticks —
 * all state lives in the outbox IndexedDB table.
 *
 * Error handling:
 * - Transient failures → schedule retry via exponential backoff
 * - Permanent failures → mark as failed, stop retrying
 * - Conflicts → mark as conflict, surface to user
 */

import * as outboxRepo from 'soapbox/db/outbox-repository';
import { ApplicationError, normalizeTransportError } from 'soapbox/domain/application-error';
import { computeNextAttemptAt, shouldRetry } from 'soapbox/domain/outbox-retry';

import type { AccountScope } from 'soapbox/db/repository';
import type { FailureReason, OutboxEntry, OutboxOperationType } from 'soapbox/domain/outbox-operation';

// ─── Executor Registry ───────────────────────────────────────────────────────

/**
 * An executor knows how to send a specific operation type to the server.
 * Returns the server response payload on success, or throws on failure.
 */
export type OperationExecutor = (
  entry: OutboxEntry,
  scope: AccountScope,
  signal: AbortSignal,
) => Promise<unknown>;

const executors = new Map<OutboxOperationType, OperationExecutor>();

/**
 * Register an executor for an operation type.
 * Called at module load time by each feature that supports outbox mutations.
 */
export function registerExecutor(type: OutboxOperationType, executor: OperationExecutor): void {
  executors.set(type, executor);
}

// ─── Processor State ─────────────────────────────────────────────────────────

interface ProcessorState {
  running: boolean;
  timerId: ReturnType<typeof setTimeout> | null;
  abortController: AbortController | null;
}

const processorStates = new Map<string, ProcessorState>();

function getState(accountUrl: string): ProcessorState {
  let state = processorStates.get(accountUrl);
  if (!state) {
    state = { running: false, timerId: null, abortController: null };
    processorStates.set(accountUrl, state);
  }
  return state;
}

// ─── Lifecycle ───────────────────────────────────────────────────────────────

/** Listeners notified when outbox state changes (for React hook subscription). */
export type OutboxChangeListener = () => void;
const listeners = new Set<OutboxChangeListener>();

export function subscribe(listener: OutboxChangeListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners(): void {
  for (const listener of listeners) {
    try {
      listener();
    } catch { /* never throw from notification */ }
  }
}

// ─── Core Processing ─────────────────────────────────────────────────────────

/**
 * Trigger a processing tick for an account.
 * Safe to call multiple times — deduplicates concurrent invocations.
 */
export async function tick(scope: AccountScope): Promise<void> {
  const state = getState(scope.accountUrl);
  if (state.running) return; // Already processing

  state.running = true;
  try {
    await processNext(scope);
  } finally {
    state.running = false;
    scheduleNextTick(scope);
  }
}

/**
 * Process the next ready operation for an account.
 */
async function processNext(scope: AccountScope): Promise<void> {
  const now = Date.now();
  const ready = await outboxRepo.getReadyOperations(scope, now, 1);
  if (ready.length === 0) return;

  const entry = ready[0];
  const executor = executors.get(entry.operationType);

  if (!executor) {
    // No executor registered — permanent failure
    await outboxRepo.updateEntry(scope, entry.id, {
      state: 'failed',
      completedAt: now,
      lastFailureReason: 'unknown',
      lastErrorMessage: `No executor registered for operation type: ${entry.operationType}`,
    });
    notifyListeners();
    return;
  }

  // Transition to in-flight
  await outboxRepo.updateEntry(scope, entry.id, {
    state: 'in-flight',
    attemptedAt: now,
    attemptCount: entry.attemptCount + 1,
  });
  notifyListeners();

  // Execute
  const state = getState(scope.accountUrl);
  state.abortController = new AbortController();

  try {
    const result = await executor(entry, scope, state.abortController.signal);

    // Success
    await outboxRepo.updateEntry(scope, entry.id, {
      state: 'completed',
      completedAt: Date.now(),
      result,
    });
    notifyListeners();

    // Process next immediately (chain)
    await processNext(scope);
  } catch (error: unknown) {
    await handleFailure(scope, entry, error);
    notifyListeners();
  } finally {
    state.abortController = null;
  }
}

/**
 * Classify an error and update the outbox entry accordingly.
 */
async function handleFailure(
  scope: AccountScope,
  entry: OutboxEntry,
  error: unknown,
): Promise<void> {
  const now = Date.now();
  const appError = error instanceof ApplicationError
    ? error
    : normalizeTransportError(error, { online: navigator.onLine });

  const failureReason = classifyFailure(appError);
  const updatedEntry = {
    ...entry,
    attemptCount: entry.attemptCount + 1,
    lastFailureReason: failureReason,
    lastErrorMessage: appError.message.slice(0, 500),
    serverRetryAfterMs: appError.retryAfterMs ?? null,
  };

  // Check if this is a conflict (409)
  if (failureReason === 'conflict') {
    await outboxRepo.updateEntry(scope, entry.id, {
      state: 'conflict',
      lastFailureReason: failureReason,
      lastErrorMessage: appError.message.slice(0, 500),
      attemptCount: updatedEntry.attemptCount,
    });
    return;
  }

  // Check if should retry
  if (shouldRetry(updatedEntry)) {
    const nextAttempt = computeNextAttemptAt(updatedEntry, now);
    await outboxRepo.updateEntry(scope, entry.id, {
      state: 'retrying',
      nextAttemptAt: nextAttempt,
      lastFailureReason: failureReason,
      lastErrorMessage: appError.message.slice(0, 500),
      serverRetryAfterMs: appError.retryAfterMs ?? null,
      attemptCount: updatedEntry.attemptCount,
    });
  } else {
    // Permanent failure
    await outboxRepo.updateEntry(scope, entry.id, {
      state: 'failed',
      completedAt: now,
      lastFailureReason: failureReason,
      lastErrorMessage: appError.message.slice(0, 500),
      attemptCount: updatedEntry.attemptCount,
    });
  }
}

/**
 * Map an ApplicationError to a FailureReason for retry classification.
 */
function classifyFailure(error: ApplicationError): FailureReason {
  switch (error.kind) {
    case 'offline': return 'network';
    case 'unauthenticated': return 'unauthorized';
    case 'forbidden': return 'forbidden';
    case 'rate-limited': return 'rate-limited';
    case 'validation': return 'validation';
    case 'transient': return error.status === 409 ? 'conflict' : 'server-error';
    case 'cancelled': return 'cancelled';
    default:
      if (error.status === 404) return 'not-found';
      if (error.status === 409) return 'conflict';
      if (error.status === 410) return 'gone';
      if (error.status && error.status >= 500) return 'server-error';
      return 'unknown';
  }
}

// ─── Scheduling ──────────────────────────────────────────────────────────────

/**
 * Schedule the next tick based on the earliest nextAttemptAt in the queue.
 */
async function scheduleNextTick(scope: AccountScope): Promise<void> {
  const state = getState(scope.accountUrl);

  // Clear any existing timer
  if (state.timerId !== null) {
    clearTimeout(state.timerId);
    state.timerId = null;
  }

  // Find the earliest scheduled retry
  const retrying = await outboxRepo.getByState(scope, 'retrying', { limit: 1 });
  const pending = await outboxRepo.getByState(scope, 'pending', { limit: 1 });

  let earliestMs: number | null = null;

  for (const entry of [...retrying, ...pending]) {
    if (entry.nextAttemptAt !== null) {
      if (earliestMs === null || entry.nextAttemptAt < earliestMs) {
        earliestMs = entry.nextAttemptAt;
      }
    } else {
      // Immediately ready — tick now
      earliestMs = Date.now();
      break;
    }
  }

  if (earliestMs === null) return; // Nothing to schedule

  const delayMs = Math.max(0, earliestMs - Date.now());
  state.timerId = setTimeout(() => {
    state.timerId = null;
    tick(scope);
  }, Math.min(delayMs, 60_000)); // Cap timer at 1 minute to prevent drift
}

// ─── External Triggers ───────────────────────────────────────────────────────

/**
 * Called when a new operation is enqueued.
 * Triggers an immediate processing tick.
 */
export function onOperationEnqueued(scope: AccountScope): void {
  tick(scope);
}

/**
 * Called when the network comes back online.
 * Triggers processing for all known accounts.
 */
export function onNetworkOnline(): void {
  for (const [accountUrl] of processorStates) {
    tick({ accountUrl });
  }
}

/**
 * Stop processing for an account (e.g., on logout).
 * Aborts any in-flight operation.
 */
export function stop(scope: AccountScope): void {
  const state = processorStates.get(scope.accountUrl);
  if (!state) return;

  if (state.timerId !== null) {
    clearTimeout(state.timerId);
    state.timerId = null;
  }
  if (state.abortController) {
    state.abortController.abort();
    state.abortController = null;
  }
  processorStates.delete(scope.accountUrl);
}

/**
 * Initialize the processor for an account at startup.
 * Recovers stale in-flight operations and starts processing.
 */
export async function initialize(scope: AccountScope): Promise<void> {
  await outboxRepo.recoverStaleInflight(scope);
  await tick(scope);
}

/**
 * Phase 6G — Safe manual recovery tools.
 *
 * Provides the logic layer for user-facing recovery actions on outbox
 * operations. The UI component calls these functions which coordinate
 * between the outbox service, conflict resolver, and draft storage.
 *
 * Recovery actions:
 * - Retry: re-attempt a failed/conflicted operation
 * - Cancel: abandon an operation that hasn't been sent
 * - Discard: permanently remove a terminal operation from history
 * - Resolve conflict: apply a user-chosen conflict resolution strategy
 * - Retry all: batch retry all failed operations
 * - Cancel all: batch cancel all pending operations
 *
 * Security:
 * - All operations require an account scope (IDOR prevention)
 * - Cannot retry/cancel operations belonging to another account
 * - Draft saving validates content length before persisting
 */

import { createAccountScope, draftsRepo } from 'soapbox/db';

import { computeResolution } from './conflict-resolver';
import { cancel, discard, getActive, getByState, retry } from './outbox-service';

import type { ConflictResolutionStrategy } from './conflict-resolver';
import type { AccountScope } from 'soapbox/db/repository';
import type { OutboxEntry } from 'soapbox/domain/outbox-operation';

// ─── Recovery results ────────────────────────────────────────────────────────

export interface RecoveryResult {
  success: boolean;
  message: string;
  operationId: string;
}

export interface BatchRecoveryResult {
  succeeded: number;
  failed: number;
  results: RecoveryResult[];
}

// ─── Single operation recovery ───────────────────────────────────────────────

/**
 * Retry a single failed or conflicted operation.
 * Resets the operation to pending and triggers the processor.
 */
export async function retryOperation(
  accountUrl: string,
  operationId: string,
): Promise<RecoveryResult> {
  const scope = resolveScope(accountUrl);
  if (!scope) {
    return { success: false, message: 'Invalid account scope.', operationId };
  }

  const result = await retry(scope, operationId);
  return {
    success: result,
    message: result ? 'Operation queued for retry.' : 'Operation cannot be retried.',
    operationId,
  };
}

/**
 * Cancel a single pending or retrying operation.
 * The operation will not be sent to the server.
 */
export async function cancelOperation(
  accountUrl: string,
  operationId: string,
): Promise<RecoveryResult> {
  const scope = resolveScope(accountUrl);
  if (!scope) {
    return { success: false, message: 'Invalid account scope.', operationId };
  }

  const result = await cancel(scope, operationId);
  return {
    success: result,
    message: result ? 'Operation cancelled.' : 'Operation cannot be cancelled.',
    operationId,
  };
}

/**
 * Permanently discard a terminal operation from history.
 * Only works on completed, cancelled, or failed operations.
 */
export async function discardOperation(
  accountUrl: string,
  operationId: string,
): Promise<RecoveryResult> {
  const scope = resolveScope(accountUrl);
  if (!scope) {
    return { success: false, message: 'Invalid account scope.', operationId };
  }

  const result = await discard(scope, operationId);
  return {
    success: result,
    message: result ? 'Operation removed.' : 'Operation cannot be discarded.',
    operationId,
  };
}

// ─── Conflict resolution ─────────────────────────────────────────────────────

/**
 * Apply a user-chosen conflict resolution strategy.
 * Handles the multi-step flow: resolve → save draft (if needed) → update outbox.
 */
export async function resolveConflict(
  accountUrl: string,
  operation: OutboxEntry,
  strategy: ConflictResolutionStrategy,
): Promise<RecoveryResult> {
  const scope = resolveScope(accountUrl);
  if (!scope) {
    return { success: false, message: 'Invalid account scope.', operationId: operation.id };
  }

  const instructions = computeResolution(operation, strategy);

  // Save draft if instructed
  if (instructions.saveDraft && instructions.draftContent) {
    try {
      await draftsRepo.put(scope, {
        id: `conflict-draft-${operation.id}`,
        content: instructions.draftContent.slice(0, 100_000), // Bound content
        visibility: 'public',
        sensitive: false,
        spoilerText: '',
        inReplyToId: null,
        mediaIds: [],
        language: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } catch {
      // Draft save failure is non-fatal — continue with resolution
    }
  }

  // Apply the outbox action
  let success: boolean;
  switch (instructions.outboxAction) {
    case 'retry':
      success = await retry(scope, operation.id);
      break;
    case 'cancel':
      success = await cancel(scope, operation.id);
      break;
    case 'discard':
      success = await discard(scope, operation.id);
      break;
    default:
      success = false;
  }

  return {
    success,
    message: success ? `Conflict resolved: ${strategy}.` : 'Failed to apply resolution.',
    operationId: operation.id,
  };
}

// ─── Batch operations ────────────────────────────────────────────────────────

/**
 * Retry all failed operations for an account.
 */
export async function retryAllFailed(accountUrl: string): Promise<BatchRecoveryResult> {
  const scope = resolveScope(accountUrl);
  if (!scope) {
    return { succeeded: 0, failed: 0, results: [] };
  }

  const failed = await getByState(scope, 'failed');
  return batchAction(scope, failed, retry);
}

/**
 * Cancel all pending/retrying operations for an account.
 * Use with caution — this discards all queued work.
 */
export async function cancelAllPending(accountUrl: string): Promise<BatchRecoveryResult> {
  const scope = resolveScope(accountUrl);
  if (!scope) {
    return { succeeded: 0, failed: 0, results: [] };
  }

  const active = await getActive(scope);
  const cancellable = active.filter(
    op => op.state === 'pending' || op.state === 'retrying',
  );
  return batchAction(scope, cancellable, cancel);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveScope(accountUrl: string): AccountScope | null {
  try {
    return createAccountScope(accountUrl);
  } catch {
    return null;
  }
}

async function batchAction(
  scope: AccountScope,
  operations: OutboxEntry[],
  action: (scope: AccountScope, id: string) => Promise<boolean>,
): Promise<BatchRecoveryResult> {
  const results: RecoveryResult[] = [];
  let succeeded = 0;
  let failed = 0;

  for (const op of operations) {
    const success = await action(scope, op.id);
    if (success) {
      succeeded++;
    } else {
      failed++;
    }
    results.push({
      success,
      message: success ? 'Done.' : 'Failed.',
      operationId: op.id,
    });
  }

  return { succeeded, failed, results };
}

/**
 * Phase 6 — Durable outbox module.
 *
 * Public API for the outbox subsystem. Feature code should import from
 * this module, not from internal files.
 *
 * Usage:
 *   import { enqueue, cancel, retry, useOutbox } from 'soapbox/infrastructure/outbox';
 */

// Service (primary interface for enqueuing mutations)
export {
  enqueue,
  cancel,
  retry,
  discard,
  getActive,
  getByState,
  getCounts,
  getOperation,
} from './outbox-service';
export type { EnqueueOptions } from './outbox-service';

// Processor (lifecycle management)
export {
  initialize as initializeProcessor,
  stop as stopProcessor,
  onNetworkOnline,
  registerExecutor,
  subscribe as subscribeToOutbox,
} from './outbox-processor';
export type { OperationExecutor, OutboxChangeListener } from './outbox-processor';

// Transport (store accessor setup)
export { setStoreAccessor } from './outbox-transport';

// Executor registration
export { registerAllExecutors } from './executors';

// Network listener
export { registerNetworkListener, unregisterNetworkListener } from './network-listener';

// React hooks
export { useOutbox, useOutboxCounts } from './use-outbox';
export type { OutboxSnapshot, OutboxCounts } from './use-outbox';

// Reconciliation (6D — stream/poll dedup and ordering)
export { reconcile, detectDuplicateCreate, isOperationStale } from './reconciliation';
export type { ReconciliationResult, ReconciliationAction, IncomingEvent } from './reconciliation';

// Conflict resolver (6E — edit/draft conflict handling)
export { analyzeConflict, computeResolution } from './conflict-resolver';
export type { ConflictInfo, ConflictResolutionStrategy, ResolutionInstructions } from './conflict-resolver';

// Compose bridge (6F — offline compose → outbox routing)
export {
  enqueueCompose,
  enqueueDelete,
  enqueueInteraction,
  enqueueMediaUpload,
  setOutboxComposeEnabled,
  isOutboxComposeEnabled,
} from './compose-bridge';
export type { ComposeParams } from './compose-bridge';

// Recovery tools (6G — manual retry/cancel/discard)
export {
  retryOperation,
  cancelOperation,
  discardOperation,
  resolveConflict,
  retryAllFailed,
  cancelAllPending,
} from './outbox-recovery';
export type { RecoveryResult, BatchRecoveryResult } from './outbox-recovery';

/**
 * Phase 6E — Conflict handling for edits and drafts.
 *
 * When an edit conflict is detected (remote edit arrived while a local edit
 * is pending), this module provides the resolution strategies available to
 * the user.
 *
 * Design:
 * - Conflicts are never auto-resolved for content mutations (status.create,
 *   status.edit). The user must choose.
 * - Toggle conflicts (favourite/follow) use skip-if-done automatically.
 * - The resolver provides structured options but never mutates state
 *   directly — the UI calls outbox service methods to apply the resolution.
 */

import type { OutboxEntry } from 'soapbox/domain/outbox-operation';

// ─── Conflict information ────────────────────────────────────────────────────

export type ConflictResolutionStrategy =
  | 'keep-local'      // Discard remote, retry with local content
  | 'keep-remote'     // Discard local edit, cancel the operation
  | 'keep-both'       // Save local as draft, cancel the operation
  | 'retry'           // Retry the operation as-is (user verified)
  | 'cancel';         // Abandon the operation entirely

export interface ConflictInfo {
  /** The conflicting outbox operation */
  operation: OutboxEntry;
  /** Human-readable description of the conflict */
  description: string;
  /** Available resolution strategies for this conflict type */
  availableStrategies: ConflictResolutionStrategy[];
  /** Whether the conflict involves user-authored content (needs careful handling) */
  hasContentAtRisk: boolean;
  /** The local content that would be lost if discarded */
  localContent: string | null;
}

// ─── Conflict analysis ───────────────────────────────────────────────────────

/**
 * Analyze a conflicted outbox entry and provide resolution options.
 */
export function analyzeConflict(operation: OutboxEntry): ConflictInfo {
  if (operation.state !== 'conflict') {
    return {
      operation,
      description: 'Operation is not in conflict state.',
      availableStrategies: [],
      hasContentAtRisk: false,
      localContent: null,
    };
  }

  switch (operation.operationType) {
    case 'status.edit':
      return analyzeEditConflict(operation);
    case 'status.create':
      return analyzeCreateConflict(operation);
    default:
      return analyzeGenericConflict(operation);
  }
}

function analyzeEditConflict(operation: OutboxEntry): ConflictInfo {
  const payload = operation.payload as Record<string, unknown> | null;
  const localContent = payload && typeof payload.content === 'string'
    ? payload.content
    : null;

  return {
    operation,
    description: 'This post was edited on another device or by the server while your edit was pending.',
    availableStrategies: ['keep-local', 'keep-remote', 'keep-both', 'cancel'],
    hasContentAtRisk: !!localContent,
    localContent,
  };
}

function analyzeCreateConflict(operation: OutboxEntry): ConflictInfo {
  const payload = operation.payload as Record<string, unknown> | null;
  const localContent = payload && typeof payload.content === 'string'
    ? payload.content
    : null;

  return {
    operation,
    description: 'A conflict occurred while creating this post. It may have been partially created.',
    availableStrategies: ['retry', 'keep-both', 'cancel'],
    hasContentAtRisk: !!localContent,
    localContent,
  };
}

function analyzeGenericConflict(operation: OutboxEntry): ConflictInfo {
  return {
    operation,
    description: `A conflict occurred with this ${operation.operationType} operation.`,
    availableStrategies: ['retry', 'cancel'],
    hasContentAtRisk: false,
    localContent: null,
  };
}

// ─── Resolution application ──────────────────────────────────────────────────

/**
 * Result of applying a conflict resolution.
 * The caller (UI) uses these instructions to call the appropriate
 * outbox service methods.
 */
export interface ResolutionInstructions {
  /** Action to take on the conflicted operation */
  outboxAction: 'retry' | 'cancel' | 'discard';
  /** If content should be saved as a draft */
  saveDraft: boolean;
  /** Draft content to save (if saveDraft is true) */
  draftContent: string | null;
}

/**
 * Compute the instructions for applying a conflict resolution.
 * This is a pure function — no side effects.
 */
export function computeResolution(
  operation: OutboxEntry,
  strategy: ConflictResolutionStrategy,
): ResolutionInstructions {
  switch (strategy) {
    case 'keep-local':
      // Retry the operation with the same local content
      return { outboxAction: 'retry', saveDraft: false, draftContent: null };

    case 'keep-remote':
      // Discard the local operation entirely
      return { outboxAction: 'discard', saveDraft: false, draftContent: null };

    case 'keep-both': {
      // Cancel the operation but save local content as a draft
      const payload = operation.payload as Record<string, unknown> | null;
      const content = payload && typeof payload.content === 'string'
        ? payload.content
        : null;
      return { outboxAction: 'cancel', saveDraft: true, draftContent: content };
    }

    case 'retry':
      return { outboxAction: 'retry', saveDraft: false, draftContent: null };

    case 'cancel':
      return { outboxAction: 'cancel', saveDraft: false, draftContent: null };

    default:
      return { outboxAction: 'cancel', saveDraft: false, draftContent: null };
  }
}

/**
 * Phase 6 — React hooks for outbox state.
 *
 * Provides reactive access to outbox operation state for UI components.
 * Uses useEffect + useState for React 17 compatibility.
 * Re-renders when the outbox processor notifies of state changes.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import * as outboxRepo from 'soapbox/db/outbox-repository';

import { subscribe } from './outbox-processor';

import type { AccountScope } from 'soapbox/db/repository';
import type { OutboxEntry } from 'soapbox/domain/outbox-operation';

// ─── useOutbox ───────────────────────────────────────────────────────────────

export interface OutboxSnapshot {
  /** All active (non-terminal) operations. */
  operations: OutboxEntry[];
  /** Whether any operations are currently pending or retrying. */
  hasPending: boolean;
  /** Whether any operations have failed and need attention. */
  hasFailed: boolean;
  /** Whether any operations are in conflict state. */
  hasConflicts: boolean;
  /** Total active operation count (for badges). */
  activeCount: number;
}

const EMPTY_SNAPSHOT: OutboxSnapshot = {
  operations: [],
  hasPending: false,
  hasFailed: false,
  hasConflicts: false,
  activeCount: 0,
};

/**
 * Hook that provides reactive outbox state for a given account.
 * Re-renders whenever the outbox processor notifies of changes.
 *
 * @param scope - Account scope (null/undefined if not logged in)
 * @returns Current outbox snapshot
 *
 * @example
 * const { hasPending, hasFailed, operations } = useOutbox(scope);
 * if (hasFailed) showFailedBadge();
 */
export function useOutbox(scope: AccountScope | null | undefined): OutboxSnapshot {
  const [snapshot, setSnapshot] = useState<OutboxSnapshot>(EMPTY_SNAPSHOT);
  const scopeRef = useRef(scope);
  scopeRef.current = scope;

  const refresh = useCallback(async() => {
    if (!scopeRef.current) {
      setSnapshot(EMPTY_SNAPSHOT);
      return;
    }
    try {
      const operations = await outboxRepo.getActiveOperations(scopeRef.current);
      setSnapshot({
        operations,
        hasPending: operations.some(o => o.state === 'pending' || o.state === 'retrying' || o.state === 'in-flight'),
        hasFailed: operations.some(o => o.state === 'failed'),
        hasConflicts: operations.some(o => o.state === 'conflict'),
        activeCount: operations.length,
      });
    } catch {
      // Non-fatal — keep stale snapshot
    }
  }, []);

  useEffect(() => {
    if (!scope) {
      setSnapshot(EMPTY_SNAPSHOT);
      return;
    }

    // Initial fetch
    refresh();

    // Subscribe to outbox changes
    const unsubscribe = subscribe(() => {
      refresh();
    });
    return unsubscribe;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope?.accountUrl, refresh]);

  return snapshot;
}

// ─── useOutboxCounts ─────────────────────────────────────────────────────────

export interface OutboxCounts {
  pending: number;
  inFlight: number;
  retrying: number;
  failed: number;
  conflict: number;
}

const EMPTY_COUNTS: OutboxCounts = {
  pending: 0,
  inFlight: 0,
  retrying: 0,
  failed: 0,
  conflict: 0,
};

/**
 * Lightweight hook that returns just the counts per state.
 * Cheaper than useOutbox when you only need badge numbers.
 */
export function useOutboxCounts(scope: AccountScope | null | undefined): OutboxCounts {
  const [counts, setCounts] = useState<OutboxCounts>(EMPTY_COUNTS);
  const scopeRef = useRef(scope);
  scopeRef.current = scope;

  const refresh = useCallback(async() => {
    if (!scopeRef.current) {
      setCounts(EMPTY_COUNTS);
      return;
    }
    try {
      const raw = await outboxRepo.countByState(scopeRef.current);
      setCounts({
        pending: raw.pending,
        inFlight: raw['in-flight'],
        retrying: raw.retrying,
        failed: raw.failed,
        conflict: raw.conflict,
      });
    } catch {
      // Non-fatal
    }
  }, []);

  useEffect(() => {
    if (!scope) {
      setCounts(EMPTY_COUNTS);
      return;
    }

    refresh();
    const unsubscribe = subscribe(() => {
      refresh();
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope?.accountUrl, refresh]);

  return counts;
}

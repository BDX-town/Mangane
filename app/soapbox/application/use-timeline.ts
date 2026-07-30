/**
 * Phase 7 — Timeline hooks for presentation code.
 *
 * These hooks are the ONLY way migrated presentation code should access
 * timeline and entity data. They return plain TypeScript objects.
 *
 * Rules for migrated modules:
 * - MUST use these hooks (not useAppSelector or direct Redux access)
 * - MUST NOT import from 'soapbox/selectors' or 'soapbox/reducers'
 * - MUST NOT use ImmutableMap, ImmutableList, etc. in component code
 * - MAY use the outbox service for mutations
 *
 * These hooks wrap the query layer and memoize appropriately.
 */

import { useCallback } from 'react';

import { useAppSelector } from 'soapbox/hooks';

import { queryAccount, queryStatus, queryTimeline } from './timeline-queries';

import type {
  AccountView,
  CanonicalTimelineId,
  StatusView,
  TimelineState,
} from './timeline-read-model';

/**
 * Read a timeline's current state.
 *
 * @example
 * const { items, isLoading, hasMore } = useTimelineState('home');
 */
export function useTimelineState(timelineId: CanonicalTimelineId): TimelineState {
  return useAppSelector(
    useCallback((state) => queryTimeline(state, timelineId), [timelineId]),
  );
}

/**
 * Read a single status by ID.
 * Returns null if not found.
 *
 * @example
 * const status = useStatusView(statusId);
 * if (status) console.log(status.content);
 */
export function useStatusView(statusId: string | null | undefined): StatusView | null {
  return useAppSelector(
    useCallback(
      (state) => statusId ? queryStatus(state, statusId) : null,
      [statusId],
    ),
  );
}

/**
 * Read a single account by ID.
 * Returns null if not found.
 *
 * @example
 * const account = useAccountView(accountId);
 * if (account) console.log(account.displayName);
 */
export function useAccountView(accountId: string | null | undefined): AccountView | null {
  return useAppSelector(
    useCallback(
      (state) => accountId ? queryAccount(state, accountId) : null,
      [accountId],
    ),
  );
}

/**
 * Read multiple statuses by ID array.
 * Returns an array of StatusView (nulls filtered out).
 *
 * @example
 * const statuses = useStatusViews(['1', '2', '3']);
 */
export function useStatusViews(statusIds: ReadonlyArray<string>): ReadonlyArray<StatusView> {
  return useAppSelector(
    useCallback(
      (state) => {
        const results: StatusView[] = [];
        for (const id of statusIds) {
          const status = queryStatus(state, id);
          if (status) results.push(status);
        }
        return results;
      },
      // Stable reference: only re-run if the ID list changes (join as key)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [statusIds.join(',')],
    ),
  );
}

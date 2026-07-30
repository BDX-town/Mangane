/**
 * Phase 8D — Feed hooks for presentation code.
 *
 * Provides reactive access to built-in feed state (Home, For You).
 * These hooks are the primary API for the new timeline tabs.
 *
 * The hooks internally route through the feed query layer which applies
 * relationship-based filtering. Presentation code doesn't know about
 * relationship logic — it just gets a filtered list.
 */

import { useCallback } from 'react';

import { useAppSelector } from 'soapbox/hooks';

import { queryBuiltInFeed } from './feed-queries';

import type { BuiltInFeedId } from './feed-types';
import type { TimelineState } from '../timeline-read-model';

/**
 * Read a built-in feed's state with relationship-based routing applied.
 *
 * @param feedId - 'home' or 'for-you'
 * @returns TimelineState with items filtered to the correct feed
 *
 * @example
 * const homeState = useFeedState('home');
 * const forYouState = useFeedState('for-you');
 */
export function useFeedState(feedId: BuiltInFeedId): TimelineState {
  return useAppSelector(
    useCallback((state) => queryBuiltInFeed(state, feedId), [feedId]),
  );
}

import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import debounce from 'lodash/debounce';
import React, { useCallback, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { defineMessages } from 'react-intl';

import { dequeueTimeline, scrollTopTimeline } from 'soapbox/actions/timelines';
import ScrollToButton from 'soapbox/components/scroll-to-button';
import StatusList, { IStatusList } from 'soapbox/components/status_list';
import { useAppSelector, useAppDispatch } from 'soapbox/hooks';
import { makeGetStatusIds } from 'soapbox/selectors';

const messages = defineMessages({
  queue: { id: 'status_list.queue_label', defaultMessage: 'Click to see {count} new {count, plural, one {post} other {posts}}' },
});

interface ITimeline extends Omit<IStatusList, 'statusIds' | 'isLoading' | 'hasMore'> {
  /** ID of the timeline in Redux. */
  timelineId: string,
}

const getStatusIds = makeGetStatusIds();

/** Scrollable list of statuses from a timeline in the Redux store. */
const Timeline: React.FC<ITimeline> = ({
  timelineId,
  onLoadMore,
  children,
  ...rest
}) => {
  const dispatch = useAppDispatch();

  const lastStatusId = useAppSelector(state => (state.timelines.get(timelineId)?.items || ImmutableOrderedSet()).last() as string | undefined);
  const statusIds = useAppSelector(state => getStatusIds(state, { type: timelineId }));
  const isLoading = useAppSelector(state => (state.timelines.get(timelineId) || { isLoading: true }).isLoading === true);
  const isPartial = useAppSelector(state => (state.timelines.get(timelineId)?.isPartial || false) === true);
  const hasMore = useAppSelector(state => state.timelines.get(timelineId)?.hasMore === true);
  const totalQueuedItemsCount = useAppSelector(state => state.timelines.get(timelineId)?.totalQueuedItemsCount || 0);
  const isFilteringFeed = useAppSelector(state => !!state.timelines.get(timelineId)?.feedAccountId);

  const handleDequeueTimeline = useCallback(() => {
    if (isFilteringFeed) {
      return;
    }
    dispatch(dequeueTimeline(timelineId, onLoadMore));
  }, [dispatch, isFilteringFeed, onLoadMore, timelineId]);

  const handleScrollDebounced = useMemo(() => {
    return debounce(() => {
      dispatch(scrollTopTimeline(timelineId, false));
    }, 100);
  }, [dispatch, timelineId]);

  const handleScroll = useCallback(() => handleScrollDebounced(), [handleScrollDebounced]);

  const top = useRef<HTMLDivElement>(null);

  return (
    <>
      {
        createPortal(<ScrollToButton
          key='timeline-queue-button-header'
          onClick={handleDequeueTimeline}
          count={totalQueuedItemsCount}
          message={messages.queue}
          to={top}
        />, document.body)
      }
      <div ref={top} />
      <StatusList
        timelineId={timelineId}
        onScroll={handleScroll}
        lastStatusId={lastStatusId}
        statusIds={statusIds}
        isLoading={isLoading}
        isPartial={isPartial}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        {...rest}
      >
        {children}
      </StatusList>
    </>
  );
};

export default Timeline;

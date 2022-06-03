import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import { debounce } from 'lodash';
import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import { dequeueTimeline } from 'soapbox/actions/timelines';
import { scrollTopTimeline } from 'soapbox/actions/timelines';
import StatusList, { IStatusList } from 'soapbox/components/status_list';
import TimelineQueueButtonHeader from 'soapbox/components/timeline_queue_button_header';
import { useAppSelector, useAppDispatch } from 'soapbox/hooks';
import { makeGetStatusIds } from 'soapbox/selectors';

const messages = defineMessages({
  queue: { id: 'status_list.queue_label', defaultMessage: 'Click to see {count} new {count, plural, one {post} other {posts}}' },
});

interface IStatusListContainer extends Omit<IStatusList, 'statusIds' | 'isLoading' | 'hasMore'> {
  timelineId: string,
}

const StatusListContainer: React.FC<IStatusListContainer> = ({
  timelineId,
  onLoadMore,
  ...rest
}) => {
  const dispatch = useAppDispatch();
  const getStatusIds = useCallback(makeGetStatusIds, [])();

  const lastStatusId = useAppSelector(state => state.timelines.getIn([timelineId, 'items'], ImmutableOrderedSet()).last() as string | undefined);
  const statusIds = useAppSelector(state => getStatusIds(state, { type: timelineId }));
  const isLoading = useAppSelector(state => state.timelines.getIn([timelineId, 'isLoading'], true) === true);
  const isPartial = useAppSelector(state => state.timelines.getIn([timelineId, 'isPartial'], false) === true);
  const hasMore = useAppSelector(state => state.timelines.getIn([timelineId, 'hasMore']) === true);

  const handleDequeueTimeline = () => {
    dispatch(dequeueTimeline(timelineId, onLoadMore));
  };

  const handleScrollToTop = useCallback(debounce(() => {
    dispatch(scrollTopTimeline(timelineId, true));
  }, 100), []);

  const handleScroll = useCallback(debounce(() => {
    dispatch(scrollTopTimeline(timelineId, false));
  }, 100), []);

  return (
    <>
      <TimelineQueueButtonHeader
        key='timeline-queue-button-header'
        onClick={handleDequeueTimeline}
        timelineId={timelineId}
        message={messages.queue}
      />

      <StatusList
        onScrollToTop={handleScrollToTop}
        onScroll={handleScroll}
        lastStatusId={lastStatusId}
        statusIds={statusIds}
        isLoading={isLoading}
        isPartial={isPartial}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        {...rest}
      />
    </>
  );
};

export default StatusListContainer;

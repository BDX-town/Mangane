import classNames from 'classnames';
import debounce from 'lodash/debounce';
import React, { useRef, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import LoadGap from 'soapbox/components/load_gap';
import ScrollableList from 'soapbox/components/scrollable_list';
import StatusContainer from 'soapbox/containers/status_container';
import FeedSuggestions from 'soapbox/features/feed-suggestions/feed-suggestions';
import PlaceholderStatus from 'soapbox/features/placeholder/components/placeholder_status';
import PendingStatus from 'soapbox/features/ui/components/pending_status';

import type { OrderedSet as ImmutableOrderedSet } from 'immutable';
import type { VirtuosoHandle } from 'react-virtuoso';
import type { IScrollableList } from 'soapbox/components/scrollable_list';

interface IStatusList extends Omit<IScrollableList, 'onLoadMore' | 'children'> {
  /** Unique key to preserve the scroll position when navigating back. */
  scrollKey: string,
  /** List of status IDs to display. */
  statusIds: ImmutableOrderedSet<string>,
  /** Last _unfiltered_ status ID (maxId) for pagination.  */
  lastStatusId?: string,
  /** Pinned statuses to show at the top of the feed. */
  featuredStatusIds?: ImmutableOrderedSet<string>,
  /** Pagination callback when the end of the list is reached. */
  onLoadMore?: (lastStatusId: string) => void,
  /** Whether the data is currently being fetched. */
  isLoading: boolean,
  /** Whether the server did not return a complete page. */
  isPartial?: boolean,
  /** Whether we expect an additional page of data. */
  hasMore: boolean,
  /** Message to display when the list is loaded but empty. */
  emptyMessage: React.ReactNode,
  /** ID of the timeline in Redux. */
  timelineId?: string,
  /** Whether to display a gap or border between statuses in the list. */
  divideType?: 'space' | 'border',
}

/** Feed of statuses, built atop ScrollableList. */
const StatusList: React.FC<IStatusList> = ({
  statusIds,
  lastStatusId,
  featuredStatusIds,
  divideType = 'border',
  onLoadMore,
  timelineId,
  isLoading,
  isPartial,
  ...other
}) => {
  const node = useRef<VirtuosoHandle>(null);

  const getFeaturedStatusCount = () => {
    return featuredStatusIds?.size || 0;
  };

  const getCurrentStatusIndex = (id: string, featured: boolean): number => {
    if (featured) {
      return featuredStatusIds?.keySeq().findIndex(key => key === id) || 0;
    } else {
      return statusIds.keySeq().findIndex(key => key === id) + getFeaturedStatusCount();
    }
  };

  const handleMoveUp = (id: string, featured: boolean = false) => {
    const elementIndex = getCurrentStatusIndex(id, featured) - 1;
    selectChild(elementIndex);
  };

  const handleMoveDown = (id: string, featured: boolean = false) => {
    const elementIndex = getCurrentStatusIndex(id, featured) + 1;
    selectChild(elementIndex);
  };

  const handleLoadOlder = useCallback(debounce(() => {
    const maxId = lastStatusId || statusIds.last();
    if (onLoadMore && maxId) {
      onLoadMore(maxId.replace('末suggestions-', ''));
    }
  }, 300, { leading: true }), [onLoadMore, lastStatusId, statusIds.last()]);

  const selectChild = (index: number) => {
    node.current?.scrollIntoView({
      index,
      behavior: 'smooth',
      done: () => {
        const element = document.querySelector<HTMLDivElement>(`#status-list [data-index="${index}"] .focusable`);
        element?.focus();
      },
    });
  };

  const renderLoadGap = (index: number) => {
    const ids = statusIds.toList();
    const nextId = ids.get(index + 1);
    const prevId = ids.get(index - 1);

    if (index < 1 || !nextId || !prevId || !onLoadMore) return null;

    return (
      <LoadGap
        key={'gap:' + nextId}
        disabled={isLoading}
        maxId={prevId!}
        onClick={onLoadMore}
      />
    );
  };

  const renderStatus = (statusId: string) => {
    return (
      // @ts-ignore
      <StatusContainer
        key={statusId}
        id={statusId}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        contextType={timelineId}
      />
    );
  };

  const renderPendingStatus = (statusId: string) => {
    const idempotencyKey = statusId.replace(/^末pending-/, '');

    return (
      <PendingStatus
        key={statusId}
        idempotencyKey={idempotencyKey}
      />
    );
  };

  const renderFeaturedStatuses = (): React.ReactNode[] => {
    if (!featuredStatusIds) return [];

    return featuredStatusIds.toArray().map(statusId => (
      // @ts-ignore
      <StatusContainer
        key={`f-${statusId}`}
        id={statusId}
        featured
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        contextType={timelineId}
      />
    ));
  };

  const renderFeedSuggestions = (): React.ReactNode => {
    return <FeedSuggestions key='suggestions' />;
  };

  const renderStatuses = (): React.ReactNode[] => {
    if (isLoading || statusIds.size > 0) {
      return statusIds.toArray().map((statusId, index) => {
        if (statusId === null) {
          return renderLoadGap(index);
        } else if (statusId.startsWith('末suggestions-')) {
          return renderFeedSuggestions();
        } else if (statusId.startsWith('末pending-')) {
          return renderPendingStatus(statusId);
        } else {
          return renderStatus(statusId);
        }
      });
    } else {
      return [];
    }
  };

  const renderScrollableContent = () => {
    const featuredStatuses = renderFeaturedStatuses();
    const statuses = renderStatuses();

    if (featuredStatuses && statuses) {
      return featuredStatuses.concat(statuses);
    } else {
      return statuses;
    }
  };

  if (isPartial) {
    return (
      <div className='regeneration-indicator'>
        <div>
          <div className='regeneration-indicator__label'>
            <FormattedMessage id='regeneration_indicator.label' tagName='strong' defaultMessage='Loading&hellip;' />
            <FormattedMessage id='regeneration_indicator.sublabel' defaultMessage='Your home feed is being prepared!' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollableList
      id='status-list'
      key='scrollable-list'
      isLoading={isLoading}
      showLoading={isLoading && statusIds.size === 0}
      onLoadMore={handleLoadOlder}
      placeholderComponent={PlaceholderStatus}
      placeholderCount={20}
      ref={node}
      className={classNames('divide-y divide-solid divide-gray-200 dark:divide-gray-800', {
        'divide-none': divideType !== 'border',
      })}
      itemClassName={classNames({
        'pb-3': divideType !== 'border',
      })}
      {...other}
    >
      {renderScrollableContent()}
    </ScrollableList>
  );
};

export default StatusList;
export type { IStatusList };

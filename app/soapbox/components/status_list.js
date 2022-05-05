import classNames from 'classnames';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage, defineMessages } from 'react-intl';

import StatusContainer from 'soapbox/containers/status_container';
import PlaceholderStatus from 'soapbox/features/placeholder/components/placeholder_status';
import PendingStatus from 'soapbox/features/ui/components/pending_status';

import LoadGap from './load_gap';
import ScrollableList from './scrollable_list';
import TimelineQueueButtonHeader from './timeline_queue_button_header';

const messages = defineMessages({
  queue: { id: 'status_list.queue_label', defaultMessage: 'Click to see {count} new {count, plural, one {post} other {posts}}' },
});

export default class StatusList extends ImmutablePureComponent {

  static propTypes = {
    scrollKey: PropTypes.string.isRequired,
    statusIds: ImmutablePropTypes.orderedSet.isRequired,
    lastStatusId: PropTypes.string,
    featuredStatusIds: ImmutablePropTypes.orderedSet,
    onLoadMore: PropTypes.func,
    isLoading: PropTypes.bool,
    isPartial: PropTypes.bool,
    hasMore: PropTypes.bool,
    prepend: PropTypes.node,
    emptyMessage: PropTypes.node,
    alwaysPrepend: PropTypes.bool,
    timelineId: PropTypes.string,
    queuedItemSize: PropTypes.number,
    onDequeueTimeline: PropTypes.func,
    group: ImmutablePropTypes.map,
    withGroupAdmin: PropTypes.bool,
    onScrollToTop: PropTypes.func,
    onScroll: PropTypes.func,
    divideType: PropTypes.oneOf(['space', 'border']),
  };

  static defaultProps = {
    divideType: 'border',
  }

  componentDidMount() {
    this.handleDequeueTimeline();
  }

  getFeaturedStatusCount = () => {
    return this.props.featuredStatusIds ? this.props.featuredStatusIds.size : 0;
  }

  getCurrentStatusIndex = (id, featured) => {
    if (featured) {
      return this.props.featuredStatusIds.keySeq().findIndex(key => key === id);
    } else {
      return this.props.statusIds.keySeq().findIndex(key => key === id) + this.getFeaturedStatusCount();
    }
  }

  handleMoveUp = (id, featured) => {
    const elementIndex = this.getCurrentStatusIndex(id, featured) - 1;
    this._selectChild(elementIndex, true);
  }

  handleMoveDown = (id, featured) => {
    const elementIndex = this.getCurrentStatusIndex(id, featured) + 1;
    this._selectChild(elementIndex, false);
  }

  handleLoadOlder = debounce(() => {
    const loadMoreID = this.props.lastStatusId ? this.props.lastStatusId : this.props.statusIds.last();
    this.props.onLoadMore(loadMoreID);
  }, 300, { leading: true })

  _selectChild(index, align_top) {
    const container = this.node.node;
    const element = container.querySelector(`article:nth-of-type(${index + 1}) .focusable`);

    if (element) {
      if (align_top && container.scrollTop > element.offsetTop) {
        element.scrollIntoView(true);
      } else if (!align_top && container.scrollTop + container.clientHeight < element.offsetTop + element.offsetHeight) {
        element.scrollIntoView(false);
      }
      element.focus();
    }
  }

  handleDequeueTimeline = () => {
    const { onDequeueTimeline, timelineId } = this.props;
    if (!onDequeueTimeline || !timelineId) return;
    onDequeueTimeline(timelineId);
  }

  setRef = c => {
    this.node = c;
  }

  renderLoadGap(index) {
    const { statusIds, onLoadMore, isLoading }  = this.props;

    return (
      <LoadGap
        key={'gap:' + statusIds.get(index + 1)}
        disabled={isLoading}
        maxId={index > 0 ? statusIds.get(index - 1) : null}
        onClick={onLoadMore}
      />
    );
  }

  renderStatus(statusId) {
    const { timelineId, withGroupAdmin, group }  = this.props;

    return (
      <StatusContainer
        key={statusId}
        id={statusId}
        onMoveUp={this.handleMoveUp}
        onMoveDown={this.handleMoveDown}
        contextType={timelineId}
        group={group}
        withGroupAdmin={withGroupAdmin}
      />
    );
  }

  renderPendingStatus(statusId) {
    const { timelineId, withGroupAdmin, group } = this.props;
    const idempotencyKey = statusId.replace(/^末pending-/, '');

    return (
      <PendingStatus
        key={statusId}
        idempotencyKey={idempotencyKey}
        onMoveUp={this.handleMoveUp}
        onMoveDown={this.handleMoveDown}
        contextType={timelineId}
        group={group}
        withGroupAdmin={withGroupAdmin}
      />
    );
  }

  renderFeaturedStatuses() {
    const { featuredStatusIds, timelineId }  = this.props;
    if (!featuredStatusIds) return null;

    return featuredStatusIds.map(statusId => (
      <StatusContainer
        key={`f-${statusId}`}
        id={statusId}
        featured
        onMoveUp={this.handleMoveUp}
        onMoveDown={this.handleMoveDown}
        contextType={timelineId}
      />
    ));
  }

  renderStatuses() {
    const { statusIds, isLoading }  = this.props;

    if (isLoading || statusIds.size > 0) {
      return statusIds.map((statusId, index) => {
        if (statusId === null) {
          return this.renderLoadGap(index);
        } else if (statusId.startsWith('末pending-')) {
          return this.renderPendingStatus(statusId);
        } else {
          return this.renderStatus(statusId);
        }
      });
    } else {
      return null;
    }
  }

  renderScrollableContent() {
    const featuredStatuses = this.renderFeaturedStatuses();
    const statuses = this.renderStatuses();

    if (featuredStatuses && statuses) {
      return featuredStatuses.concat(statuses);
    } else {
      return statuses;
    }
  }

  render() {
    const { statusIds, divideType, featuredStatusIds, onLoadMore, timelineId, totalQueuedItemsCount, isLoading, isPartial, withGroupAdmin, group, ...other }  = this.props;

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

    return [
      <TimelineQueueButtonHeader
        key='timeline-queue-button-header'
        onClick={this.handleDequeueTimeline}
        count={totalQueuedItemsCount}
        message={messages.queue}
      />,
      <ScrollableList
        key='scrollable-list'
        isLoading={isLoading}
        showLoading={isLoading && statusIds.size === 0}
        onLoadMore={onLoadMore && this.handleLoadOlder}
        placeholderComponent={PlaceholderStatus}
        placeholderCount={20}
        ref={this.setRef}
        className={classNames('divide-y divide-solid divide-gray-200 dark:divide-slate-700', {
          'divide-none': divideType !== 'border',
        })}
        itemClassName={classNames({
          'pb-3': divideType !== 'border',
        })}
        {...other}
      >
        {this.renderScrollableContent()}
      </ScrollableList>,
    ];
  }

}

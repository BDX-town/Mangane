import { debounce } from 'lodash';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import StatusContainer from '../containers/status_container';
import ImmutablePureComponent from 'react-immutable-pure-component';
import LoadGap from './load_gap';
import ScrollableList from './scrollable_list';
import TimelineQueueButtonHeader from './timeline_queue_button_header';

const messages = defineMessages({
  queue: { id: 'status_list.queue_label', defaultMessage: 'Click to see {count} new {count, plural, one {post} other {posts}}' },
});

export default class StatusList extends ImmutablePureComponent {

  static propTypes = {
    scrollKey: PropTypes.string.isRequired,
    statusIds: ImmutablePropTypes.list.isRequired,
    lastStatusId: PropTypes.string,
    featuredStatusIds: ImmutablePropTypes.list,
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
  };

  componentDidMount() {
    this.handleDequeueTimeline();
  };

  getFeaturedStatusCount = () => {
    return this.props.featuredStatusIds ? this.props.featuredStatusIds.size : 0;
  }

  getCurrentStatusIndex = (id, featured) => {
    if (featured) {
      return this.props.featuredStatusIds.indexOf(id);
    } else {
      return this.props.statusIds.indexOf(id) + this.getFeaturedStatusCount();
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

  render() {
    const { statusIds, featuredStatusIds, onLoadMore, timelineId, totalQueuedItemsCount, isLoading, isPartial, withGroupAdmin, group, ...other }  = this.props;

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

    let scrollableContent = (isLoading || statusIds.size > 0) ? (
      statusIds.map((statusId, index) => statusId === null ? (
        <LoadGap
          key={'gap:' + statusIds.get(index + 1)}
          disabled={isLoading}
          maxId={index > 0 ? statusIds.get(index - 1) : null}
          onClick={onLoadMore}
        />
      ) : (
        <StatusContainer
          key={statusId}
          id={statusId}
          onMoveUp={this.handleMoveUp}
          onMoveDown={this.handleMoveDown}
          contextType={timelineId}
          group={group}
          withGroupAdmin={withGroupAdmin}
          showThread
        />
      ))
    ) : null;

    if (scrollableContent && featuredStatusIds) {
      scrollableContent = featuredStatusIds.map(statusId => (
        <StatusContainer
          key={`f-${statusId}`}
          id={statusId}
          featured
          onMoveUp={this.handleMoveUp}
          onMoveDown={this.handleMoveDown}
          contextType={timelineId}
          showThread
        />
      )).concat(scrollableContent);
    }

    return [
      <TimelineQueueButtonHeader
        key='timeline-queue-button-header'
        onClick={this.handleDequeueTimeline}
        count={totalQueuedItemsCount}
        message={messages.queue}
      />,
      <ScrollableList key='scrollable-list' {...other} isLoading={isLoading} showLoading={isLoading && statusIds.size === 0} onLoadMore={onLoadMore && this.handleLoadOlder} ref={this.setRef}>
        {scrollableContent}
      </ScrollableList>,
    ];
  }

}

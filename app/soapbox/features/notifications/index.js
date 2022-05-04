import { List as ImmutableList } from 'immutable';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Virtuoso } from 'react-virtuoso';
import { createSelector } from 'reselect';

import { getSettings } from 'soapbox/actions/settings';
import PullToRefresh from 'soapbox/components/pull-to-refresh';
import PlaceholderNotification from 'soapbox/features/placeholder/components/placeholder_notification';

import {
  expandNotifications,
  scrollTopNotifications,
  dequeueNotifications,
} from '../../actions/notifications';
import TimelineQueueButtonHeader from  '../../components/timeline_queue_button_header';
import { Column, Text } from '../../components/ui';

import FilterBarContainer from './containers/filter_bar_container';
import NotificationContainer from './containers/notification_container';

const messages = defineMessages({
  title: { id: 'column.notifications', defaultMessage: 'Notifications' },
  queue: { id: 'notifications.queue_label', defaultMessage: 'Click to see {count} new {count, plural, one {notification} other {notifications}}' },
});

const Footer = ({ context }) => (
  context.hasMore ? (
    <PlaceholderNotification />
  ) : null
);

const Item = ({ context, ...rest }) => (
  <div className='border-solid border-b border-gray-200 dark:border-slate-700' {...rest} />
);

const getNotifications = createSelector([
  state => getSettings(state).getIn(['notifications', 'quickFilter', 'show']),
  state => getSettings(state).getIn(['notifications', 'quickFilter', 'active']),
  state => ImmutableList(getSettings(state).getIn(['notifications', 'shows']).filter(item => !item).keys()),
  state => state.getIn(['notifications', 'items']).toList(),
], (showFilterBar, allowedType, excludedTypes, notifications) => {
  if (!showFilterBar || allowedType === 'all') {
    // used if user changed the notification settings after loading the notifications from the server
    // otherwise a list of notifications will come pre-filtered from the backend
    // we need to turn it off for FilterBar in order not to block ourselves from seeing a specific category
    return notifications.filterNot(item => item !== null && excludedTypes.includes(item.get('type')));
  }
  return notifications.filter(item => item !== null && allowedType === item.get('type'));
});

const mapStateToProps = state => {
  const settings = getSettings(state);

  return {
    showFilterBar: settings.getIn(['notifications', 'quickFilter', 'show']),
    notifications: getNotifications(state),
    isLoading: state.getIn(['notifications', 'isLoading'], true),
    isUnread: state.getIn(['notifications', 'unread']) > 0,
    hasMore: state.getIn(['notifications', 'hasMore']),
    totalQueuedNotificationsCount: state.getIn(['notifications', 'totalQueuedNotificationsCount'], 0),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class Notifications extends React.PureComponent {

  static propTypes = {
    notifications: ImmutablePropTypes.list.isRequired,
    showFilterBar: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    isUnread: PropTypes.bool,
    hasMore: PropTypes.bool,
    dequeueNotifications: PropTypes.func,
    totalQueuedNotificationsCount: PropTypes.number,
  };

  componentWillUnmount() {
    this.handleLoadOlder.cancel();
    this.handleScrollToTop.cancel();
    this.handleScroll.cancel();
    this.props.dispatch(scrollTopNotifications(false));
  }

  componentDidMount() {
    this.handleDequeueNotifications();
    this.props.dispatch(scrollTopNotifications(true));
  }

  handleLoadGap = (maxId) => {
    this.props.dispatch(expandNotifications({ maxId }));
  };

  handleLoadOlder = debounce(() => {
    const last = this.props.notifications.last();
    this.props.dispatch(expandNotifications({ maxId: last && last.get('id') }));
  }, 300, { leading: true });

  handleScrollToTop = debounce(() => {
    this.props.dispatch(scrollTopNotifications(true));
  }, 100);

  handleScroll = debounce(() => {
    this.props.dispatch(scrollTopNotifications(false));
  }, 100);

  setColumnRef = c => {
    this.column = c;
  }

  handleMoveUp = id => {
    const elementIndex = this.props.notifications.findIndex(item => item !== null && item.get('id') === id) - 1;
    this._selectChild(elementIndex, true);
  }

  handleMoveDown = id => {
    const elementIndex = this.props.notifications.findIndex(item => item !== null && item.get('id') === id) + 1;
    this._selectChild(elementIndex, false);
  }

  _selectChild(index, align_top) {
    const container = this.column;
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

  handleDequeueNotifications = () => {
    this.props.dispatch(dequeueNotifications());
  };

  handleRefresh = () => {
    const { dispatch } = this.props;
    return dispatch(expandNotifications());
  }

  render() {
    const { intl, notifications, isLoading, hasMore, showFilterBar, totalQueuedNotificationsCount } = this.props;
    const emptyMessage = <FormattedMessage id='empty_column.notifications' defaultMessage="You don't have any notifications yet. Interact with others to start the conversation." />;

    const filterBarContainer = showFilterBar
      ? (<FilterBarContainer />)
      : null;

    const showLoading = isLoading && !notifications || notifications.isEmpty();

    const scrollContainer  = (
      <PullToRefresh onRefresh={this.handleRefresh}>
        <Virtuoso
          useWindowScroll
          data={showLoading ? Array(20).fill() : notifications.toArray()}
          startReached={this.handleScrollToTop}
          endReached={this.handleLoadOlder}
          isScrolling={isScrolling => isScrolling && this.handleScroll()}
          itemContent={(_index, notification) => (
            showLoading ? (
              <PlaceholderNotification />
            ) : (
              <NotificationContainer
                key={notification.id}
                notification={notification}
                onMoveUp={this.handleMoveUp}
                onMoveDown={this.handleMoveDown}
              />
            )
          )}
          context={{
            hasMore,
          }}
          components={{
            ScrollSeekPlaceholder: PlaceholderNotification,
            Footer,
            EmptyPlaceholder: () => <Text>{emptyMessage}</Text>,
            Item,
          }}
        />
      </PullToRefresh>
    );

    return (
      <Column ref={this.setColumnRef} label={intl.formatMessage(messages.title)} withHeader={false}>
        {filterBarContainer}
        <TimelineQueueButtonHeader
          onClick={this.handleDequeueNotifications}
          count={totalQueuedNotificationsCount}
          message={messages.queue}
        />
        {scrollContainer}
      </Column>
    );
  }

}

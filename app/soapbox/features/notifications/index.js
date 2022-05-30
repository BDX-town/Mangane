import classNames from 'classnames';
import { List as ImmutableList } from 'immutable';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import {
  expandNotifications,
  scrollTopNotifications,
  dequeueNotifications,
} from 'soapbox/actions/notifications';
import { getSettings } from 'soapbox/actions/settings';
import ScrollableList from 'soapbox/components/scrollable_list';
import TimelineQueueButtonHeader from  'soapbox/components/timeline_queue_button_header';
import { Column } from 'soapbox/components/ui';
import PlaceholderNotification from 'soapbox/features/placeholder/components/placeholder_notification';

import FilterBarContainer from './containers/filter_bar_container';
import NotificationContainer from './containers/notification_container';

const messages = defineMessages({
  title: { id: 'column.notifications', defaultMessage: 'Notifications' },
  queue: { id: 'notifications.queue_label', defaultMessage: 'Click to see {count} new {count, plural, one {notification} other {notifications}}' },
});

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

  setRef = c => {
    this.node = c;
  }

  setColumnRef = c => {
    this.column = c;
  }

  handleMoveUp = id => {
    const elementIndex = this.props.notifications.findIndex(item => item !== null && item.get('id') === id) - 1;
    this._selectChild(elementIndex);
  }

  handleMoveDown = id => {
    const elementIndex = this.props.notifications.findIndex(item => item !== null && item.get('id') === id) + 1;
    this._selectChild(elementIndex);
  }

  _selectChild(index) {
    this.node.scrollIntoView({
      index,
      behavior: 'smooth',
      done: () => {
        const container = this.column;
        const element = container.querySelector(`[data-index="${index}"] .focusable`);

        if (element) {
          element.focus();
        }
      },
    });
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

    let scrollableContent = null;

    const filterBarContainer = showFilterBar
      ? (<FilterBarContainer />)
      : null;

    if (isLoading && this.scrollableContent) {
      scrollableContent = this.scrollableContent;
    } else if (notifications.size > 0 || hasMore) {
      scrollableContent = notifications.map((item, index) => (
        <NotificationContainer
          key={item.get('id')}
          notification={item}
          onMoveUp={this.handleMoveUp}
          onMoveDown={this.handleMoveDown}
        />
      ));
    } else {
      scrollableContent = null;
    }

    this.scrollableContent = scrollableContent;

    const scrollContainer = (
      <ScrollableList
        ref={this.setRef}
        scrollKey='notifications'
        isLoading={isLoading}
        showLoading={isLoading && notifications.size === 0}
        hasMore={hasMore}
        emptyMessage={emptyMessage}
        placeholderComponent={PlaceholderNotification}
        placeholderCount={20}
        onLoadMore={this.handleLoadOlder}
        onRefresh={this.handleRefresh}
        onScrollToTop={this.handleScrollToTop}
        onScroll={this.handleScroll}
        className={classNames({
          'divide-y divide-gray-200 dark:divide-gray-600 divide-solid': notifications.size > 0,
          'space-y-2': notifications.size === 0,
        })}
      >
        {scrollableContent}
      </ScrollableList>
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

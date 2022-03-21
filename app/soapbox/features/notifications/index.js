import classNames from 'classnames';
import { List as ImmutableList } from 'immutable';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { getSettings } from 'soapbox/actions/settings';
import BirthdayReminders from 'soapbox/components/birthday_reminders';
import PlaceholderNotification from 'soapbox/features/placeholder/components/placeholder_notification';
import { getFeatures } from 'soapbox/utils/features';

import {
  expandNotifications,
  scrollTopNotifications,
  dequeueNotifications,
} from '../../actions/notifications';
import LoadGap from '../../components/load_gap';
import ScrollableList from '../../components/scrollable_list';
import TimelineQueueButtonHeader from  '../../components/timeline_queue_button_header';
import { Column } from '../../components/ui';

import { NOTIFICATION_TYPES } from './components/notification';
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
  const instance = state.get('instance');
  const features = getFeatures(instance);
  const showBirthdayReminders = settings.getIn(['notifications', 'birthdays', 'show']) && settings.getIn(['notifications', 'quickFilter', 'active']) === 'all' && features.birthdays;
  const birthdays = showBirthdayReminders && state.getIn(['user_lists', 'birthday_reminders', state.get('me')]);

  return {
    showFilterBar: settings.getIn(['notifications', 'quickFilter', 'show']),
    notifications: getNotifications(state),
    isLoading: state.getIn(['notifications', 'isLoading'], true),
    isUnread: state.getIn(['notifications', 'unread']) > 0,
    hasMore: state.getIn(['notifications', 'hasMore']),
    totalQueuedNotificationsCount: state.getIn(['notifications', 'totalQueuedNotificationsCount'], 0),
    showBirthdayReminders,
    hasBirthdays: !!birthdays,
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
    showBirthdayReminders: PropTypes.bool,
    hasBirthdays: PropTypes.bool,
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
    const { hasBirthdays } = this.props;

    let elementIndex = this.props.notifications.findIndex(item => item !== null && item.get('id') === id) - 1;
    if (hasBirthdays) elementIndex++;
    this._selectChild(elementIndex, true);
  }

  handleMoveDown = id => {
    const { hasBirthdays } = this.props;

    let elementIndex = this.props.notifications.findIndex(item => item !== null && item.get('id') === id) + 1;
    if (hasBirthdays) elementIndex++;
    this._selectChild(elementIndex, false);
  }

  handleMoveBelowBirthdays = () => {
    this._selectChild(1, false);
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
    const { intl, notifications, isLoading, hasMore, showFilterBar, totalQueuedNotificationsCount, showBirthdayReminders } = this.props;
    const emptyMessage = <FormattedMessage id='empty_column.notifications' defaultMessage="You don't have any notifications yet. Interact with others to start the conversation." />;

    let scrollableContent = null;

    const filterBarContainer = showFilterBar
      ? (<FilterBarContainer />)
      : null;

    if (isLoading && this.scrollableContent) {
      scrollableContent = this.scrollableContent;
    } else if (notifications.size > 0 || hasMore) {
      scrollableContent = notifications.map((item, index) => item === null ? (
        <LoadGap
          key={'gap:' + notifications.getIn([index + 1, 'id'])}
          disabled={isLoading}
          maxId={index > 0 ? notifications.getIn([index - 1, 'id']) : null}
          onClick={this.handleLoadGap}
        />
      ) : (
        <NotificationContainer
          key={item.get('id')}
          notification={item}
          onMoveUp={this.handleMoveUp}
          onMoveDown={this.handleMoveDown}
        />
      ));

      if (showBirthdayReminders) scrollableContent = scrollableContent.unshift(
        <BirthdayReminders
          key='birthdays'
          onMoveDown={this.handleMoveBelowBirthdays}
        />,
      );
    } else {
      scrollableContent = null;
    }

    this.scrollableContent = scrollableContent;
    const notificationsToRender = notifications.filter((notification) => NOTIFICATION_TYPES.includes(notification.get('type')));

    const scrollContainer = (
      <ScrollableList
        scrollKey='notifications'
        isLoading={isLoading}
        showLoading={isLoading && notificationsToRender.size === 0}
        hasMore={hasMore}
        emptyMessage={emptyMessage}
        placeholderComponent={PlaceholderNotification}
        placeholderCount={20}
        onLoadMore={this.handleLoadOlder}
        onRefresh={this.handleRefresh}
        onScrollToTop={this.handleScrollToTop}
        onScroll={this.handleScroll}
        className={classNames({
          'divide-y divide-gray-200 divide-solid': notificationsToRender.size > 0,
          'space-y-2': notificationsToRender.size === 0,
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

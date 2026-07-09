import classNames from 'classnames';
import { List as ImmutableList, Map as ImmutableMap } from 'immutable';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { createSelector } from 'reselect';

import {
  expandNotifications,
  scrollTopNotifications,
  dequeueNotifications,
} from 'soapbox/actions/notifications';
import { getSettings } from 'soapbox/actions/settings';
import PullToRefresh from 'soapbox/components/pull-to-refresh';
import ScrollTopButton from 'soapbox/components/scroll-top-button';
import ScrollableList from 'soapbox/components/scrollable_list';
import { Column } from 'soapbox/components/ui';
import PlaceholderNotification from 'soapbox/features/placeholder/components/placeholder_notification';
import { useAppDispatch, useAppSelector, useSettings } from 'soapbox/hooks';

import FilterBar from './components/filter_bar';
import Notification from './components/notification';

import type { VirtuosoHandle } from 'react-virtuoso';
import type { RootState } from 'soapbox/store';
import type { Notification as NotificationEntity } from 'soapbox/types/entities';

const messages = defineMessages({
  title: { id: 'column.notifications', defaultMessage: 'Notifications' },
  queue: { id: 'notifications.queue_label', defaultMessage: 'Click to see {count} new {count, plural, one {notification} other {notifications}}' },
});

const getNotifications = createSelector([
  state => getSettings(state).getIn(['notifications', 'quickFilter', 'show']),
  state => getSettings(state).getIn(['notifications', 'quickFilter', 'active']),
  state => ImmutableList((getSettings(state).getIn(['notifications', 'shows']) as ImmutableMap<string, boolean>).filter(item => !item).keys()),
  (state: RootState) => state.notifications.items.toList(),
], (showFilterBar, allowedType, excludedTypes, notifications: ImmutableList<NotificationEntity>) => {
  if (!showFilterBar || allowedType === 'all') {
    // used if user changed the notification settings after loading the notifications from the server
    // otherwise a list of notifications will come pre-filtered from the backend
    // we need to turn it off for FilterBar in order not to block ourselves from seeing a specific category
    return notifications.filterNot(item => item !== null && excludedTypes.includes(item.get('type')));
  }
  return notifications.filter(item => item !== null && allowedType === item.get('type'));
});

const Notifications = () => {
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const settings = useSettings();

  const showFilterBar = settings.getIn(['notifications', 'quickFilter', 'show']);
  const activeFilter = settings.getIn(['notifications', 'quickFilter', 'active']);
  const notifications = useAppSelector(state => getNotifications(state));
  const isLoading = useAppSelector(state => state.notifications.isLoading);
  // const isUnread = useAppSelector(state => state.notifications.unread > 0);
  const hasMore = useAppSelector(state => state.notifications.hasMore);
  const totalQueuedNotificationsCount = useAppSelector(state => state.notifications.totalQueuedNotificationsCount || 0);

  const node = useRef<VirtuosoHandle>(null);
  const column = useRef<HTMLDivElement>(null);

  const handleLoadOlderDebounced = useMemo(() => debounce(() => {
    const last = notifications.last();
    dispatch(expandNotifications({ maxId: last && last.get('id') }));
  }, 300, { leading: true }), [dispatch, notifications]);

  const handleLoadOlder = useCallback(() => handleLoadOlderDebounced(), [handleLoadOlderDebounced]);

  const handleScrollToTopDebounced = useMemo(() => debounce(() => {
    dispatch(scrollTopNotifications(true));
  }, 100), [dispatch]);

  const handleScrollToTop = useCallback(() => handleScrollToTopDebounced(), [handleScrollToTopDebounced]);

  const handleScrollDebounced = useMemo(() => debounce(() => {
    dispatch(scrollTopNotifications(false));
  }, 100), [dispatch]);

  const handleScroll = useCallback(() => handleScrollDebounced(), [handleScrollDebounced]);

  const _selectChild = useCallback((index: number) => {
    node.current?.scrollIntoView({
      index,
      behavior: 'smooth',
      done: () => {
        const container = column.current;
        const element = container?.querySelector(`[data-index="${index}"] .focusable`);

        if (element) {
          (element as HTMLDivElement).focus();
        }
      },
    });
  }, []);

  const handleMoveUp = useCallback((id: string) => {
    const elementIndex = notifications.findIndex(item => item !== null && item.get('id') === id) - 1;
    _selectChild(elementIndex);
  }, [notifications, _selectChild]);

  const handleMoveDown = useCallback((id: string) => {
    const elementIndex = notifications.findIndex(item => item !== null && item.get('id') === id) + 1;
    _selectChild(elementIndex);
  }, [notifications, _selectChild]);

  const handleDequeueNotifications = useCallback(() => {
    dispatch(dequeueNotifications());
  }, [dispatch]);

  const handleRefresh = useCallback(async() => {
    await dispatch(expandNotifications());
    return dispatch(dequeueNotifications());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      handleLoadOlderDebounced.cancel();
      handleScrollToTopDebounced.cancel();
      handleScrollDebounced.cancel();
      dispatch(scrollTopNotifications(false));
    };
  }, [dispatch, handleLoadOlderDebounced, handleScrollDebounced, handleScrollToTopDebounced]);

  return (
    <Column ref={column} label={intl.formatMessage(messages.title)} withHeader={false}>
      {showFilterBar
        ? (<FilterBar />)
        : null}
      <ScrollTopButton
        onClick={handleDequeueNotifications}
        count={totalQueuedNotificationsCount}
        message={messages.queue}
      />
      <PullToRefresh onRefresh={handleRefresh}>
        <ScrollableList
          ref={node}
          scrollKey='notifications'
          isLoading={isLoading}
          showLoading={isLoading && notifications.size === 0}
          hasMore={hasMore}
          emptyMessage={activeFilter === 'all'
            ? <FormattedMessage id='empty_column.notifications' defaultMessage="You don't have any notifications yet. Interact with others to start the conversation." />
            : <FormattedMessage id='empty_column.notifications_filtered' defaultMessage="You don't have any notifications of this type yet." />
          }
          placeholderComponent={PlaceholderNotification}
          placeholderCount={20}
          onLoadMore={handleLoadOlder}
          onScrollToTop={handleScrollToTop}
          onScroll={handleScroll}
          className={classNames({
            'divide-y divide-gray-200 dark:divide-gray-600 divide-solid': notifications.size > 0,
            'space-y-2': notifications.size === 0,
          })}
        >
          {
            notifications?.map((item) => (
              <Notification
                key={item.id}
                notification={item}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
              />
            ))
          }
        </ScrollableList>
      </PullToRefresh>
    </Column>
  );
};

export default Notifications;

import classNames from 'classnames';
import { List as ImmutableList, Map as ImmutableMap } from 'immutable';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useRef } from 'react';
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
  const scrollableContentRef = useRef<ImmutableList<JSX.Element> | null>(null);

  // const handleLoadGap = (maxId) => {
  //   dispatch(expandNotifications({ maxId }));
  // };

  const handleLoadOlder = useCallback(debounce(() => {
    const last = notifications.last();
    dispatch(expandNotifications({ maxId: last && last.get('id') }));
  }, 300, { leading: true }), [notifications]);

  const handleScrollToTop = useCallback(debounce(() => {
    dispatch(scrollTopNotifications(true));
  }, 100), []);

  const handleScroll = useCallback(debounce(() => {
    dispatch(scrollTopNotifications(false));
  }, 100), []);

  const handleMoveUp = (id: string) => {
    const elementIndex = notifications.findIndex(item => item !== null && item.get('id') === id) - 1;
    _selectChild(elementIndex);
  };

  const handleMoveDown = (id: string) => {
    const elementIndex = notifications.findIndex(item => item !== null && item.get('id') === id) + 1;
    _selectChild(elementIndex);
  };

  const _selectChild = (index: number) => {
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
  };

  const handleDequeueNotifications = () => {
    dispatch(dequeueNotifications());
  };

  const handleRefresh = () => {
    return dispatch(expandNotifications());
  };

  useEffect(() => {
    handleDequeueNotifications();
    dispatch(scrollTopNotifications(true));

    return () => {
      handleLoadOlder.cancel();
      handleScrollToTop.cancel();
      handleScroll.cancel();
      dispatch(scrollTopNotifications(false));
    };
  }, []);

  const emptyMessage = activeFilter === 'all'
    ? <FormattedMessage id='empty_column.notifications' defaultMessage="You don't have any notifications yet. Interact with others to start the conversation." />
    : <FormattedMessage id='empty_column.notifications_filtered' defaultMessage="You don't have any notifications of this type yet." />;

  let scrollableContent: ImmutableList<JSX.Element> | null = null;

  const filterBarContainer = showFilterBar
    ? (<FilterBar />)
    : null;

  if (isLoading && scrollableContentRef.current) {
    scrollableContent = scrollableContentRef.current;
  } else if (notifications.size > 0 || hasMore) {
    scrollableContent = notifications.map((item) => (
      <Notification
        key={item.id}
        notification={item}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
      />
    ));
  } else {
    scrollableContent = null;
  }

  scrollableContentRef.current = scrollableContent;

  const scrollContainer = (
    <ScrollableList
      ref={node}
      scrollKey='notifications'
      isLoading={isLoading}
      showLoading={isLoading && notifications.size === 0}
      hasMore={hasMore}
      emptyMessage={emptyMessage}
      placeholderComponent={PlaceholderNotification}
      placeholderCount={20}
      onLoadMore={handleLoadOlder}
      onScrollToTop={handleScrollToTop}
      onScroll={handleScroll}
      className={classNames({
        'divide-y divide-gray-200 dark:divide-primary-800 divide-solid': notifications.size > 0,
        'space-y-2': notifications.size === 0,
      })}
    >
      {scrollableContent as ImmutableList<JSX.Element>}
    </ScrollableList>
  );

  return (
    <Column ref={column} label={intl.formatMessage(messages.title)} withHeader={false}>
      {filterBarContainer}
      <ScrollTopButton
        onClick={handleDequeueNotifications}
        count={totalQueuedNotificationsCount}
        message={messages.queue}
      />
      <PullToRefresh onRefresh={handleRefresh}>
        {scrollContainer}
      </PullToRefresh>
    </Column>
  );
};

export default Notifications;

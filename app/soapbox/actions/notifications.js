import api, { getLinks } from '../api';
import IntlMessageFormat from 'intl-messageformat';
import 'intl-pluralrules';
import { fetchRelationships } from './accounts';
import {
  importFetchedAccount,
  importFetchedAccounts,
  importFetchedStatus,
  importFetchedStatuses,
} from './importer';
import { getSettings, saveSettings } from './settings';
import { defineMessages } from 'react-intl';
import {
  List as ImmutableList,
  Map as ImmutableMap,
  OrderedMap as ImmutableOrderedMap,
} from 'immutable';
import { unescapeHTML } from '../utils/html';
import { getFilters, regexFromFilters } from '../selectors';
import { isLoggedIn } from 'soapbox/utils/auth';

export const NOTIFICATIONS_UPDATE      = 'NOTIFICATIONS_UPDATE';
export const NOTIFICATIONS_UPDATE_NOOP = 'NOTIFICATIONS_UPDATE_NOOP';
export const NOTIFICATIONS_UPDATE_QUEUE = 'NOTIFICATIONS_UPDATE_QUEUE';
export const NOTIFICATIONS_DEQUEUE      = 'NOTIFICATIONS_DEQUEUE';

export const NOTIFICATIONS_EXPAND_REQUEST = 'NOTIFICATIONS_EXPAND_REQUEST';
export const NOTIFICATIONS_EXPAND_SUCCESS = 'NOTIFICATIONS_EXPAND_SUCCESS';
export const NOTIFICATIONS_EXPAND_FAIL    = 'NOTIFICATIONS_EXPAND_FAIL';

export const NOTIFICATIONS_FILTER_SET = 'NOTIFICATIONS_FILTER_SET';

export const NOTIFICATIONS_CLEAR      = 'NOTIFICATIONS_CLEAR';
export const NOTIFICATIONS_SCROLL_TOP = 'NOTIFICATIONS_SCROLL_TOP';

export const NOTIFICATIONS_MARK_READ_REQUEST = 'NOTIFICATIONS_MARK_READ_REQUEST';
export const NOTIFICATIONS_MARK_READ_SUCCESS = 'NOTIFICATIONS_MARK_READ_SUCCESS';
export const NOTIFICATIONS_MARK_READ_FAIL    = 'NOTIFICATIONS_MARK_READ_FAIL';

export const MAX_QUEUED_NOTIFICATIONS = 40;

defineMessages({
  mention: { id: 'notification.mention', defaultMessage: '{name} mentioned you' },
  group: { id: 'notifications.group', defaultMessage: '{count} notifications' },
});

const fetchRelatedRelationships = (dispatch, notifications) => {
  const accountIds = notifications.filter(item => item.type === 'follow').map(item => item.account.id);

  if (accountIds.length > 0) {
    dispatch(fetchRelationships(accountIds));
  }
};

export function updateNotifications(notification, intlMessages, intlLocale) {
  return (dispatch, getState) => {
    const showInColumn = getSettings(getState()).getIn(['notifications', 'shows', notification.type], true);

    if (notification.account) {
      dispatch(importFetchedAccount(notification.account));
    }

    // Used by Move notification
    if (notification.target) {
      dispatch(importFetchedAccount(notification.target));
    }

    if (notification.status) {
      dispatch(importFetchedStatus(notification.status));
    }

    if (showInColumn) {
      dispatch({
        type: NOTIFICATIONS_UPDATE,
        notification,
      });

      fetchRelatedRelationships(dispatch, [notification]);
    }
  };
}

export function updateNotificationsQueue(notification, intlMessages, intlLocale, curPath) {
  return (dispatch, getState) => {
    if (notification.type === 'pleroma:chat_mention') return; // Drop chat notifications, handle them per-chat

    const showAlert = getSettings(getState()).getIn(['notifications', 'alerts', notification.type]);
    const filters = getFilters(getState(), { contextType: 'notifications' });
    const playSound = getSettings(getState()).getIn(['notifications', 'sounds', notification.type]);

    let filtered = false;

    const isOnNotificationsPage = curPath === '/notifications';

    if (notification.type === 'mention') {
      const regex = regexFromFilters(filters);
      const searchIndex = notification.status.spoiler_text + '\n' + unescapeHTML(notification.status.content);
      filtered = regex && regex.test(searchIndex);
    }

    // Desktop notifications
    try {
      if (typeof window.Notification !== 'undefined' && showAlert && !filtered) {
        const title = new IntlMessageFormat(intlMessages[`notification.${notification.type}`], intlLocale).format({ name: notification.account.display_name.length > 0 ? notification.account.display_name : notification.account.username });
        const body = (notification.status && notification.status.spoiler_text.length > 0) ? notification.status.spoiler_text : unescapeHTML(notification.status ? notification.status.content : '');

        const notify = new Notification(title, { body, icon: notification.account.avatar, tag: notification.id });

        notify.addEventListener('click', () => {
          window.focus();
          notify.close();
        });
      }
    } catch(e) {
      console.warn(e);
    }

    if (playSound && !filtered) {
      dispatch({
        type: NOTIFICATIONS_UPDATE_NOOP,
        meta: { sound: 'boop' },
      });
    }

    if (isOnNotificationsPage) {
      dispatch({
        type: NOTIFICATIONS_UPDATE_QUEUE,
        notification,
        intlMessages,
        intlLocale,
      });
    } else {
      dispatch(updateNotifications(notification, intlMessages, intlLocale));
    }
  };
}

export function dequeueNotifications() {
  return (dispatch, getState) => {
    const queuedNotifications = getState().getIn(['notifications', 'queuedNotifications'], ImmutableOrderedMap());
    const totalQueuedNotificationsCount = getState().getIn(['notifications', 'totalQueuedNotificationsCount'], 0);

    if (totalQueuedNotificationsCount === 0) {
      return;
    } else if (totalQueuedNotificationsCount > 0 && totalQueuedNotificationsCount <= MAX_QUEUED_NOTIFICATIONS) {
      queuedNotifications.forEach(block => {
        dispatch(updateNotifications(block.notification, block.intlMessages, block.intlLocale));
      });
    } else {
      dispatch(expandNotifications());
    }

    dispatch({
      type: NOTIFICATIONS_DEQUEUE,
    });
    dispatch(markReadNotifications());
  };
}

const excludeTypesFromSettings = getState => getSettings(getState()).getIn(['notifications', 'shows']).filter(enabled => !enabled).keySeq().toJS();

const excludeTypesFromFilter = filter => {
  const allTypes = ImmutableList(['follow', 'follow_request', 'favourite', 'reblog', 'mention', 'poll', 'move', 'pleroma:emoji_reaction']);
  return allTypes.filterNot(item => item === filter).toJS();
};

const noOp = () => {};

export function expandNotifications({ maxId } = {}, done = noOp) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    const activeFilter = getSettings(getState()).getIn(['notifications', 'quickFilter', 'active']);
    const notifications = getState().get('notifications');
    const isLoadingMore = !!maxId;

    if (notifications.get('isLoading')) {
      done();
      return;
    }

    const params = {
      max_id: maxId,
      exclude_types: activeFilter === 'all'
        ? excludeTypesFromSettings(getState)
        : excludeTypesFromFilter(activeFilter),
    };

    if (!maxId && notifications.get('items').size > 0) {
      params.since_id = notifications.getIn(['items', 0, 'id']);
    }

    dispatch(expandNotificationsRequest(isLoadingMore));

    api(getState).get('/api/v1/notifications', { params }).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      const entries = response.data.reduce((acc, item) => {
        if (item.account && item.account.id) {
          acc.accounts[item.account.id] = item.account;
        }

        // Used by Move notification
        if (item.target && item.target.id) {
          acc.accounts[item.target.id] = item.target;
        }

        if (item.status && item.status.id) {
          acc.statuses[item.status.id] = item.status;
        }

        return acc;
      }, { accounts: {}, statuses: {} });

      dispatch(importFetchedAccounts(Object.values(entries.accounts)));
      dispatch(importFetchedStatuses(Object.values(entries.statuses)));

      dispatch(expandNotificationsSuccess(response.data, next ? next.uri : null, isLoadingMore));
      fetchRelatedRelationships(dispatch, response.data);
      done();
    }).catch(error => {
      dispatch(expandNotificationsFail(error, isLoadingMore));
      done();
    });
  };
}

export function expandNotificationsRequest(isLoadingMore) {
  return {
    type: NOTIFICATIONS_EXPAND_REQUEST,
    skipLoading: !isLoadingMore,
  };
}

export function expandNotificationsSuccess(notifications, next, isLoadingMore) {
  return {
    type: NOTIFICATIONS_EXPAND_SUCCESS,
    notifications,
    next,
    skipLoading: !isLoadingMore,
  };
}

export function expandNotificationsFail(error, isLoadingMore) {
  return {
    type: NOTIFICATIONS_EXPAND_FAIL,
    error,
    skipLoading: !isLoadingMore,
  };
}

export function clearNotifications() {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    dispatch({
      type: NOTIFICATIONS_CLEAR,
    });

    api(getState).post('/api/v1/notifications/clear');
  };
}

export function scrollTopNotifications(top) {
  return (dispatch, getState) => {
    dispatch({
      type: NOTIFICATIONS_SCROLL_TOP,
      top,
    });
    dispatch(markReadNotifications());
  };
}

export function setFilter(filterType) {
  return dispatch => {
    dispatch({
      type: NOTIFICATIONS_FILTER_SET,
      path: ['notifications', 'quickFilter', 'active'],
      value: filterType,
    });
    dispatch(expandNotifications());
    dispatch(saveSettings());
  };
}

export function markReadNotifications() {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    const state = getState();
    const topNotification = state.getIn(['notifications', 'items'], ImmutableOrderedMap()).first(ImmutableMap()).get('id');
    const lastRead = state.getIn(['notifications', 'lastRead']);

    if (!(topNotification && topNotification > lastRead)) return;

    dispatch({
      type: NOTIFICATIONS_MARK_READ_REQUEST,
      lastRead: topNotification,
    });

    api(getState).post('/api/v1/pleroma/notifications/read', {
      max_id: topNotification,
    }).then(response => {
      dispatch({
        type: NOTIFICATIONS_MARK_READ_SUCCESS,
        notifications: response.data,
      });
    }).catch(e => {
      dispatch({ type: NOTIFICATIONS_MARK_READ_FAIL });
    });
  };
}

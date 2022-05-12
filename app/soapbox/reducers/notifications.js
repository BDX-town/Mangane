import {
  Record as ImmutableRecord,
  OrderedMap as ImmutableOrderedMap,
  fromJS,
} from 'immutable';

import { normalizeNotification } from 'soapbox/normalizers/notification';

import {
  ACCOUNT_BLOCK_SUCCESS,
  ACCOUNT_MUTE_SUCCESS,
  FOLLOW_REQUEST_AUTHORIZE_SUCCESS,
  FOLLOW_REQUEST_REJECT_SUCCESS,
} from '../actions/accounts';
import {
  MARKER_FETCH_SUCCESS,
  MARKER_SAVE_REQUEST,
  MARKER_SAVE_SUCCESS,
} from '../actions/markers';
import {
  NOTIFICATIONS_UPDATE,
  NOTIFICATIONS_EXPAND_SUCCESS,
  NOTIFICATIONS_EXPAND_REQUEST,
  NOTIFICATIONS_EXPAND_FAIL,
  NOTIFICATIONS_FILTER_SET,
  NOTIFICATIONS_CLEAR,
  NOTIFICATIONS_SCROLL_TOP,
  NOTIFICATIONS_UPDATE_QUEUE,
  NOTIFICATIONS_DEQUEUE,
  NOTIFICATIONS_MARK_READ_REQUEST,
  MAX_QUEUED_NOTIFICATIONS,
} from '../actions/notifications';
import { TIMELINE_DELETE } from '../actions/timelines';

const ReducerRecord = ImmutableRecord({
  items: ImmutableOrderedMap(),
  hasMore: true,
  top: false,
  unread: 0,
  isLoading: false,
  queuedNotifications: ImmutableOrderedMap(), //max = MAX_QUEUED_NOTIFICATIONS
  totalQueuedNotificationsCount: 0, //used for queuedItems overflow for MAX_QUEUED_NOTIFICATIONS+
  lastRead: -1,
});

const parseId = id => parseInt(id, 10);

// For sorting the notifications
const comparator = (a, b) => {
  const parse = m => parseId(m.get('id'));
  if (parse(a) < parse(b)) return 1;
  if (parse(a) > parse(b)) return -1;
  return 0;
};

const minifyNotification = notification => {
  return notification.mergeWith((o, n) => n || o, {
    account: notification.getIn(['account', 'id']),
    target: notification.getIn(['target', 'id']),
    status: notification.getIn(['status', 'id']),
  });
};

const fixNotification = notification => {
  return minifyNotification(normalizeNotification(notification));
};

const isValid = notification => {
  try {
    // https://gitlab.com/soapbox-pub/soapbox-fe/-/issues/424
    if (!notification.account.id) {
      return false;
    }

    // Mastodon can return status notifications with a null status
    if (['mention', 'reblog', 'favourite', 'poll', 'status'].includes(notification.type) && !notification.status.id) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

// Count how many notifications appear after the given ID (for unread count)
const countFuture = (notifications, lastId) => {
  return notifications.reduce((acc, notification) => {
    if (parseId(notification.get('id')) > parseId(lastId)) {
      return acc + 1;
    } else {
      return acc;
    }
  }, 0);
};

const importNotification = (state, notification) => {
  const top = state.get('top');

  if (!top) state = state.update('unread', unread => unread + 1);

  return state.update('items', map => {
    if (top && map.size > 40) {
      map = map.take(20);
    }

    return map.set(notification.id, fixNotification(notification)).sort(comparator);
  });
};

const processRawNotifications = notifications => (
  ImmutableOrderedMap(
    notifications
      .filter(isValid)
      .map(n => [n.id, fixNotification(n)]),
  ));

const expandNormalizedNotifications = (state, notifications, next) => {
  const items = processRawNotifications(notifications);

  return state.withMutations(mutable => {
    mutable.update('items', map => map.merge(items).sort(comparator));

    if (!next) mutable.set('hasMore', false);
    mutable.set('isLoading', false);
  });
};

const filterNotifications = (state, relationship) => {
  return state.update('items', map => map.filterNot(item => item !== null && item.get('account') === relationship.id));
};

const filterNotificationIds = (state, accountIds, type) => {
  const helper = list => list.filterNot(item => item !== null && accountIds.includes(item.get('account')) && (type === undefined || type === item.get('type')));
  return state.update('items', helper);
};

const updateTop = (state, top) => {
  if (top) state = state.set('unread', 0);
  return state.set('top', top);
};

const deleteByStatus = (state, statusId) => {
  return state.update('items', map => map.filterNot(item => item !== null && item.get('status') === statusId));
};

const updateNotificationsQueue = (state, notification, intlMessages, intlLocale) => {
  const queuedNotifications = state.getIn(['queuedNotifications'], ImmutableOrderedMap());
  const listedNotifications = state.getIn(['items'], ImmutableOrderedMap());
  const totalQueuedNotificationsCount = state.getIn(['totalQueuedNotificationsCount'], 0);

  const alreadyExists = queuedNotifications.has(notification.id) || listedNotifications.has(notification.id);
  if (alreadyExists) return state;

  const newQueuedNotifications = queuedNotifications;

  return state.withMutations(mutable => {
    if (totalQueuedNotificationsCount <= MAX_QUEUED_NOTIFICATIONS) {
      mutable.set('queuedNotifications', newQueuedNotifications.set(notification.id, {
        notification,
        intlMessages,
        intlLocale,
      }));
    }
    mutable.set('totalQueuedNotificationsCount', totalQueuedNotificationsCount + 1);
  });
};

const importMarker = (state, marker) => {
  const lastReadId = marker.getIn(['notifications', 'last_read_id'], -1);

  if (!lastReadId) {
    return state;
  }

  return state.withMutations(state => {
    const notifications = state.get('items');
    const unread = countFuture(notifications, lastReadId);

    state.set('unread', unread);
    state.set('lastRead', lastReadId);
  });
};

export default function notifications(state = ReducerRecord(), action) {
  switch (action.type) {
    case NOTIFICATIONS_EXPAND_REQUEST:
      return state.set('isLoading', true);
    case NOTIFICATIONS_EXPAND_FAIL:
      return state.set('isLoading', false);
    case NOTIFICATIONS_FILTER_SET:
      return state.delete('items').set('hasMore', true);
    case NOTIFICATIONS_SCROLL_TOP:
      return updateTop(state, action.top);
    case NOTIFICATIONS_UPDATE:
      return importNotification(state, action.notification);
    case NOTIFICATIONS_UPDATE_QUEUE:
      return updateNotificationsQueue(state, action.notification, action.intlMessages, action.intlLocale);
    case NOTIFICATIONS_DEQUEUE:
      return state.withMutations(mutable => {
        mutable.delete('queuedNotifications');
        mutable.set('totalQueuedNotificationsCount', 0);
      });
    case NOTIFICATIONS_EXPAND_SUCCESS:
      return expandNormalizedNotifications(state, action.notifications, action.next);
    case ACCOUNT_BLOCK_SUCCESS:
      return filterNotifications(state, action.relationship);
    case ACCOUNT_MUTE_SUCCESS:
      return action.relationship.muting_notifications ? filterNotifications(state, action.relationship) : state;
    case FOLLOW_REQUEST_AUTHORIZE_SUCCESS:
    case FOLLOW_REQUEST_REJECT_SUCCESS:
      return filterNotificationIds(state, [action.id], 'follow_request');
    case NOTIFICATIONS_CLEAR:
      return state.delete('items').set('hasMore', false);
    case NOTIFICATIONS_MARK_READ_REQUEST:
      return state.set('lastRead', action.lastRead);
    case MARKER_FETCH_SUCCESS:
    case MARKER_SAVE_REQUEST:
    case MARKER_SAVE_SUCCESS:
      return importMarker(state, fromJS(action.marker));
    case TIMELINE_DELETE:
      return deleteByStatus(state, action.id);
    default:
      return state;
  }
}

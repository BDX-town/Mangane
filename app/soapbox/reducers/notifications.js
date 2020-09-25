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
import {
  ACCOUNT_BLOCK_SUCCESS,
  ACCOUNT_MUTE_SUCCESS,
} from '../actions/accounts';
import { TIMELINE_DELETE } from '../actions/timelines';
import { Map as ImmutableMap, OrderedMap as ImmutableOrderedMap } from 'immutable';
import { get } from 'lodash';

const initialState = ImmutableMap({
  items: ImmutableOrderedMap(),
  hasMore: true,
  top: false,
  unread: 0,
  isLoading: false,
  queuedNotifications: ImmutableOrderedMap(), //max = MAX_QUEUED_NOTIFICATIONS
  totalQueuedNotificationsCount: 0, //used for queuedItems overflow for MAX_QUEUED_NOTIFICATIONS+
  lastRead: -1,
});

// For sorting the notifications
const comparator = (a, b) => {
  if (a.get('id') < b.get('id')) return 1;
  if (a.get('id') > b.get('id')) return -1;
  return 0;
};

const notificationToMap = notification => ImmutableMap({
  id: notification.id,
  type: notification.type,
  account: notification.account.id,
  created_at: notification.created_at,
  status: notification.status ? notification.status.id : null,
  emoji: notification.emoji,
  chat_message: notification.chat_message,
  is_seen: get(notification, ['pleroma', 'is_seen'], true),
});

// https://gitlab.com/soapbox-pub/soapbox-fe/-/issues/424
const isValid = notification => Boolean(notification.account.id);

const normalizeNotification = (state, notification) => {
  const top = state.get('top');

  if (!top) state = state.update('unread', unread => unread + 1);

  return state.update('items', map => {
    if (top && map.size > 40) {
      map = map.take(20);
    }

    return map.set(notification.id, notificationToMap(notification)).sort(comparator);
  });
};

const processRawNotifications = notifications => (
  ImmutableOrderedMap(
    notifications
      .filter(isValid)
      .map(n => [n.id, notificationToMap(n)])
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

  let newQueuedNotifications = queuedNotifications;

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

const countUnseen = notifications => notifications.reduce((acc, cur) =>
  get(cur, ['pleroma', 'is_seen'], false) === false ? acc + 1 : acc, 0);

export default function notifications(state = initialState, action) {
  switch(action.type) {
  case NOTIFICATIONS_EXPAND_REQUEST:
    return state.set('isLoading', true);
  case NOTIFICATIONS_EXPAND_FAIL:
    return state.set('isLoading', false);
  case NOTIFICATIONS_FILTER_SET:
    return state.set('items', ImmutableOrderedMap()).set('hasMore', true);
  case NOTIFICATIONS_SCROLL_TOP:
    return updateTop(state, action.top);
  case NOTIFICATIONS_UPDATE:
    return normalizeNotification(state, action.notification);
  case NOTIFICATIONS_UPDATE_QUEUE:
    return updateNotificationsQueue(state, action.notification, action.intlMessages, action.intlLocale);
  case NOTIFICATIONS_DEQUEUE:
    return state.withMutations(mutable => {
      mutable.set('queuedNotifications', ImmutableOrderedMap());
      mutable.set('totalQueuedNotificationsCount', 0);
    });
  case NOTIFICATIONS_EXPAND_SUCCESS:
    const legacyUnread = countUnseen(action.notifications);
    return expandNormalizedNotifications(state, action.notifications, action.next)
      .merge({ unread: Math.max(legacyUnread, state.get('unread')) });
  case ACCOUNT_BLOCK_SUCCESS:
    return filterNotifications(state, action.relationship);
  case ACCOUNT_MUTE_SUCCESS:
    return action.relationship.muting_notifications ? filterNotifications(state, action.relationship) : state;
  case NOTIFICATIONS_CLEAR:
    return state.set('items', ImmutableOrderedMap()).set('hasMore', false);
  case NOTIFICATIONS_MARK_READ_REQUEST:
    return state.set('lastRead', action.lastRead);
  case TIMELINE_DELETE:
    return deleteByStatus(state, action.id);

  // Disable for now
  // https://gitlab.com/soapbox-pub/soapbox-fe/-/issues/432
  //
  // case TIMELINE_DISCONNECT:
  //   // This is kind of a hack - `null` renders a LoadGap in the component
  //   // https://github.com/tootsuite/mastodon/pull/6886
  //   return action.timeline === 'home' ?
  //     state.update('items', items => items.first() ? ImmutableOrderedSet([null]).union(items) : items) :
  //     state;
  default:
    return state;
  }
};

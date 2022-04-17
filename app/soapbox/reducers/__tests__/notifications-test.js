import {
  Map as ImmutableMap,
  OrderedMap as ImmutableOrderedMap,
  Record as ImmutableRecord,
} from 'immutable';
import { take } from 'lodash';

import intlMessages from 'soapbox/__fixtures__/intlMessages.json';
import notification from 'soapbox/__fixtures__/notification.json';
import notifications from 'soapbox/__fixtures__/notifications.json';
import relationship from 'soapbox/__fixtures__/relationship.json';
import { ACCOUNT_BLOCK_SUCCESS, ACCOUNT_MUTE_SUCCESS } from 'soapbox/actions/accounts';
import {
  MARKER_FETCH_SUCCESS,
  MARKER_SAVE_REQUEST,
  MARKER_SAVE_SUCCESS,
} from 'soapbox/actions/markers';
import {
  NOTIFICATIONS_EXPAND_SUCCESS,
  NOTIFICATIONS_EXPAND_REQUEST,
  NOTIFICATIONS_EXPAND_FAIL,
  NOTIFICATIONS_FILTER_SET,
  NOTIFICATIONS_SCROLL_TOP,
  NOTIFICATIONS_UPDATE,
  NOTIFICATIONS_UPDATE_QUEUE,
  NOTIFICATIONS_DEQUEUE,
  NOTIFICATIONS_CLEAR,
  NOTIFICATIONS_MARK_READ_REQUEST,
} from 'soapbox/actions/notifications';
import { TIMELINE_DELETE } from 'soapbox/actions/timelines';
import { applyActions } from 'soapbox/jest/test-helpers';

import reducer from '../notifications';

const initialState = reducer(undefined, {});

describe('notifications reducer', () => {
  it('should return the initial state', () => {
    const expected = {
      items: {},
      hasMore: true,
      top: false,
      unread: 0,
      isLoading: false,
      queuedNotifications: {},
      totalQueuedNotificationsCount: 0,
      lastRead: -1,
    };

    expect(ImmutableRecord.isRecord(initialState)).toBe(true);
    expect(initialState.toJS()).toMatchObject(expected);
  });

  describe('NOTIFICATIONS_EXPAND_SUCCESS', () => {
    it('imports the notifications', () => {
      const action = {
        type: NOTIFICATIONS_EXPAND_SUCCESS,
        notifications: take(notifications, 3),
        next: null,
        skipLoading: true,
      };

      const result = reducer(undefined, action);

      // The items are parsed as records
      expect(ImmutableOrderedMap.isOrderedMap(result.items)).toBe(true);
      expect(ImmutableRecord.isRecord(result.items.get('10743'))).toBe(true);

      // We can get an item
      expect(result.items.get('10744').emoji).toEqual('😢');

      // hasMore is set to false because `next` is null
      expect(result.hasMore).toBe(false);
    });

    it('drops invalid notifications', () => {
      const action = {
        type: NOTIFICATIONS_EXPAND_SUCCESS,
        notifications: [
          { id: '1', type: 'mention', status: null, account: { id: '10' } },
          { id: '2', type: 'reblog', status: null, account: { id: '9' } },
          { id: '3', type: 'favourite', status: null, account: { id: '8' } },
          { id: '4', type: 'mention', status: { id: 'a' }, account: { id: '7' } },
          { id: '5', type: 'reblog', status: { id: 'b' }, account: null },
        ],
        next: null,
        skipLoading: true,
      };

      const result = reducer(undefined, action);

      // Only '4' is valid
      expect(result.items.size).toEqual(1);
      expect(result.items.get('4').id).toEqual('4');
    });

    it('imports move notification', () => {
      const action = {
        type: NOTIFICATIONS_EXPAND_SUCCESS,
        notifications: [
          require('soapbox/__fixtures__/pleroma-notification-move.json'),
        ],
        next: null,
        skipLoading: true,
      };

      const result = reducer(undefined, action).items.get('406814');

      expect(result.account).toEqual('AFmHQ18XZ7Lco68MW8');
      expect(result.target).toEqual('A5c5LK7EJTFR0u26Pg');
    });
  });

  describe('NOTIFICATIONS_EXPAND_REQUEST', () => {
    it('sets isLoading to true', () => {
      const state = initialState.set('isLoading', false);
      const action = { type: NOTIFICATIONS_EXPAND_REQUEST };

      expect(reducer(state, action).isLoading).toBe(true);
    });
  });

  describe('NOTIFICATIONS_EXPAND_FAIL', () => {
    it('sets isLoading to false', () => {
      const state = initialState.set('isLoading', true);
      const action = { type: NOTIFICATIONS_EXPAND_FAIL };

      expect(reducer(state, action).isLoading).toBe(false);
    });
  });

  describe('NOTIFICATIONS_FILTER_SET', () => {
    it('clears the items', () => {
      const actions = [{
        type: NOTIFICATIONS_EXPAND_SUCCESS,
        notifications: [
          { id: '1', type: 'mention', status: { id: '4' }, account: { id: '7' } },
          { id: '2', type: 'mention', status: { id: '5' }, account: { id: '8' } },
          { id: '3', type: 'mention', status: { id: '6' }, account: { id: '9' } },
        ],
        next: null,
        skipLoading: true,
      }, {
        type: NOTIFICATIONS_FILTER_SET,
      }];

      // Setup by expanding, then calling `NOTIFICATIONS_FILTER_SET`
      const result = applyActions(initialState, actions, reducer);

      // Setting the filter wipes notifications
      expect(result.items.isEmpty()).toBe(true);
    });

    it('sets hasMore to true', () => {
      const state = initialState.set('hasMore', false);
      const action = { type: NOTIFICATIONS_FILTER_SET };
      const result = reducer(state, action);

      expect(result.hasMore).toBe(true);
    });
  });

  describe('NOTIFICATIONS_SCROLL_TOP', () => {
    it('resets `unread` counter to 0 when top is true (ie, scrolled to the top)', () => {
      const state = initialState.set('unread', 1);
      const action = { type: NOTIFICATIONS_SCROLL_TOP, top: true };
      const result = reducer(state, action);

      expect(result.unread).toEqual(0);
      expect(result.top).toBe(true);
    });

    it('leaves `unread` alone when top is false (ie, not scrolled to top)', () => {
      const state = initialState.set('unread', 3);
      const action = { type: NOTIFICATIONS_SCROLL_TOP, top: false };
      const result = reducer(state, action);

      expect(result.unread).toEqual(3);
      expect(result.top).toBe(false);
    });
  });

  describe('NOTIFICATIONS_UPDATE', () => {
    it('imports the notification', () => {
      const action = { type: NOTIFICATIONS_UPDATE, notification };
      const result = reducer(initialState, action);

      expect(result.items.get('10743').type).toEqual('favourite');
    });

    it('imports follow_request notification', () => {
      const action = {
        type: NOTIFICATIONS_UPDATE,
        notification: require('soapbox/__fixtures__/notification-follow_request.json'),
      };

      const result = reducer(initialState, action);
      expect(result.items.get('87967').type).toEqual('follow_request');
    });

    it('increments `unread` counter when top is false', () => {
      const action = { type: NOTIFICATIONS_UPDATE, notification };
      const result = reducer(initialState, action);

      expect(result.unread).toEqual(1);
    });
  });

  describe('NOTIFICATIONS_UPDATE_QUEUE', () => {
    it('adds the notification to the queue (and increases the counter)', () => {
      const action = {
        type: NOTIFICATIONS_UPDATE_QUEUE,
        notification,
        intlMessages,
        intlLocale: 'en',
      };

      const result = reducer(initialState, action);

      // Doesn't add it as a regular item
      expect(result.items.isEmpty()).toBe(true);

      // Adds it to the queued items
      expect(result.queuedNotifications.size).toEqual(1);
      expect(result.totalQueuedNotificationsCount).toEqual(1);
      expect(result.queuedNotifications.getIn(['10743', 'notification', 'type'])).toEqual('favourite');
    });
  });

  describe('NOTIFICATIONS_DEQUEUE', () => {
    it('resets the queued counter to 0', () => {
      const state = initialState.set('totalQueuedNotificationsCount', 1);
      const action = { type: NOTIFICATIONS_DEQUEUE };
      const result = reducer(state, action);

      expect(result.totalQueuedNotificationsCount).toEqual(0);
    });
  });

  describe('NOTIFICATIONS_EXPAND_SUCCESS', () => {
    it('with non-empty items and next set true', () => {
      const state = ImmutableMap({
        items: ImmutableOrderedMap([
          ['10734', ImmutableMap({
            id: '10734',
            type: 'pleroma:emoji_reaction',
            account: '9vMAje101ngtjlMj7w',
            target: null,
            created_at: '2020-06-10T02:54:39.000Z',
            status: '9vvNxoo5EFbbnfdXQu',
            emoji: '😢',
            chat_message: null,
          })],
        ]),
        unread: 1,
        hasMore: true,
        isLoading: false,
      });

      const action = {
        type: NOTIFICATIONS_EXPAND_SUCCESS,
        notifications: take(notifications, 3),
        next: true,
      };

      const expected = ImmutableMap({
        items: ImmutableOrderedMap([
          ['10744', ImmutableMap({
            id: '10744',
            type: 'pleroma:emoji_reaction',
            account: '9vMAje101ngtjlMj7w',
            target: null,
            created_at: '2020-06-10T02:54:39.000Z',
            status: '9vvNxoo5EFbbnfdXQu',
            emoji: '😢',
            chat_message: null,
          })],
          ['10743', ImmutableMap({
            id: '10743',
            type: 'favourite',
            account: '9v5c6xSEgAi3Zu1Lv6',
            target: null,
            created_at: '2020-06-10T02:51:05.000Z',
            status: '9vvNxoo5EFbbnfdXQu',
            emoji: null,
            chat_message: null,
          })],
          ['10741', ImmutableMap({
            id: '10741',
            type: 'favourite',
            account: '9v5cKMOPGqPcgfcWp6',
            target: null,
            created_at: '2020-06-10T02:05:06.000Z',
            status: '9vvNxoo5EFbbnfdXQu',
            emoji: null,
            chat_message: null,
          })],
          ['10734', ImmutableMap({
            id: '10734',
            type: 'pleroma:emoji_reaction',
            account: '9vMAje101ngtjlMj7w',
            target: null,
            created_at: '2020-06-10T02:54:39.000Z',
            status: '9vvNxoo5EFbbnfdXQu',
            emoji: '😢',
            chat_message: null,
          })],
        ]),
        unread: 1,
        hasMore: true,
        isLoading: false,
      });

      expect(reducer(state, action).toJS()).toEqual(expected.toJS());
    });

    it('with empty items and next set true', () => {
      const state = ImmutableMap({
        items: ImmutableOrderedMap(),
        unread: 1,
        hasMore: true,
        isLoading: false,
      });

      const action = {
        type: NOTIFICATIONS_EXPAND_SUCCESS,
        notifications: take(notifications, 3),
        next: true,
      };

      const expected = ImmutableMap({
        items: ImmutableOrderedMap([
          ['10744', ImmutableMap({
            id: '10744',
            type: 'pleroma:emoji_reaction',
            account: '9vMAje101ngtjlMj7w',
            target: null,
            created_at: '2020-06-10T02:54:39.000Z',
            status: '9vvNxoo5EFbbnfdXQu',
            emoji: '😢',
            chat_message: null,
          })],
          ['10743', ImmutableMap({
            id: '10743',
            type: 'favourite',
            account: '9v5c6xSEgAi3Zu1Lv6',
            target: null,
            created_at: '2020-06-10T02:51:05.000Z',
            status: '9vvNxoo5EFbbnfdXQu',
            emoji: null,
            chat_message: null,
          })],
          ['10741', ImmutableMap({
            id: '10741',
            type: 'favourite',
            account: '9v5cKMOPGqPcgfcWp6',
            target: null,
            created_at: '2020-06-10T02:05:06.000Z',
            status: '9vvNxoo5EFbbnfdXQu',
            emoji: null,
            chat_message: null,
          })],
        ]),
        unread: 1,
        hasMore: true,
        isLoading: false,
      });

      expect(reducer(state, action).toJS()).toEqual(expected.toJS());
    });
  });

  describe('ACCOUNT_BLOCK_SUCCESS', () => {
    it('should handle', () => {
      const state = ImmutableMap({
        items: ImmutableOrderedMap([
          ['10744', ImmutableMap({
            id: '10744',
            type: 'pleroma:emoji_reaction',
            account: '9vMAje101ngtjlMj7w',
            target: null,
            created_at: '2020-06-10T02:54:39.000Z',
            status: '9vvNxoo5EFbbnfdXQu',
            emoji: '😢',
            chat_message: null,
          })],
          ['10743', ImmutableMap({
            id: '10743',
            type: 'favourite',
            account: '9v5c6xSEgAi3Zu1Lv6',
            target: null,
            created_at: '2020-06-10T02:51:05.000Z',
            status: '9vvNxoo5EFbbnfdXQu',
            emoji: null,
            chat_message: null,
          })],
          ['10741', ImmutableMap({
            id: '10741',
            type: 'favourite',
            account: '9v5cKMOPGqPcgfcWp6',
            target: null,
            created_at: '2020-06-10T02:05:06.000Z',
            status: '9vvNxoo5EFbbnfdXQu',
            emoji: null,
            chat_message: null,
          })],
        ]),
      });
      const action = {
        type: ACCOUNT_BLOCK_SUCCESS,
        relationship,
      };
      expect(reducer(state, action)).toEqual(ImmutableMap({
        items: ImmutableOrderedMap([
          ['10743', ImmutableMap({
            id: '10743',
            type: 'favourite',
            account: '9v5c6xSEgAi3Zu1Lv6',
            target: null,
            created_at: '2020-06-10T02:51:05.000Z',
            status: '9vvNxoo5EFbbnfdXQu',
            emoji: null,
            chat_message: null,
          })],
          ['10741', ImmutableMap({
            id: '10741',
            type: 'favourite',
            account: '9v5cKMOPGqPcgfcWp6',
            target: null,
            created_at: '2020-06-10T02:05:06.000Z',
            status: '9vvNxoo5EFbbnfdXQu',
            emoji: null,
            chat_message: null,
          })],
        ]),
      }));
    });
  });

  describe('ACCOUNT_MUTE_SUCCESS', () => {
    it('should handle', () => {
      const state = ImmutableMap({
        items: ImmutableOrderedMap([
          ['10744', ImmutableMap({
            id: '10744',
            type: 'pleroma:emoji_reaction',
            account: '9vMAje101ngtjlMj7w',
            target: null,
            created_at: '2020-06-10T02:54:39.000Z',
            status: '9vvNxoo5EFbbnfdXQu',
            emoji: '😢',
            chat_message: null,
          })],
          ['10743', ImmutableMap({
            id: '10743',
            type: 'favourite',
            account: '9v5c6xSEgAi3Zu1Lv6',
            target: null,
            created_at: '2020-06-10T02:51:05.000Z',
            status: '9vvNxoo5EFbbnfdXQu',
            emoji: null,
            chat_message: null,
          })],
          ['10741', ImmutableMap({
            id: '10741',
            type: 'favourite',
            account: '9v5cKMOPGqPcgfcWp6',
            target: null,
            created_at: '2020-06-10T02:05:06.000Z',
            status: '9vvNxoo5EFbbnfdXQu',
            emoji: null,
            chat_message: null,
          })],
        ]),
      });
      const action = {
        type: ACCOUNT_MUTE_SUCCESS,
        relationship: relationship,
      };
      expect(reducer(state, action)).toEqual(ImmutableMap({
        items: ImmutableOrderedMap([
          ['10743', ImmutableMap({
            id: '10743',
            type: 'favourite',
            account: '9v5c6xSEgAi3Zu1Lv6',
            target: null,
            created_at: '2020-06-10T02:51:05.000Z',
            status: '9vvNxoo5EFbbnfdXQu',
            emoji: null,
            chat_message: null,
          })],
          ['10741', ImmutableMap({
            id: '10741',
            type: 'favourite',
            account: '9v5cKMOPGqPcgfcWp6',
            target: null,
            created_at: '2020-06-10T02:05:06.000Z',
            status: '9vvNxoo5EFbbnfdXQu',
            emoji: null,
            chat_message: null,
          })],
        ]),
      }));
    });
  });

  describe('NOTIFICATIONS_CLEAR', () => {
    it('clears the items', () => {
      const state = initialState.set('items', ImmutableOrderedMap([['1', {}], ['2', {}]]));
      const action = { type: NOTIFICATIONS_CLEAR };
      const result = reducer(state, action);

      expect(result.items.isEmpty()).toBe(true);
    });
  });

  describe('NOTIFICATIONS_MARK_READ_REQUEST', () => {
    it('sets lastRead to the one in the action', () => {
      const action = { type: NOTIFICATIONS_MARK_READ_REQUEST, lastRead: '1234' };
      const result = reducer(undefined, action);

      expect(result.lastRead).toEqual('1234');
    });
  });

  describe('TIMELINE_DELETE', () => {
    it('deletes notifications corresponding to the status ID', () => {
      const actions = [{
        type: NOTIFICATIONS_EXPAND_SUCCESS,
        notifications: [
          { id: '1', type: 'mention', status: { id: '4' }, account: { id: '7' } },
          { id: '2', type: 'mention', status: { id: '5' }, account: { id: '8' } },
          { id: '3', type: 'mention', status: { id: '6' }, account: { id: '9' } },
          { id: '4', type: 'mention', status: { id: '5' }, account: { id: '7' } },
        ],
        next: null,
        skipLoading: true,
      }, {
        type: TIMELINE_DELETE,
        id: '5',
      }];

      // Setup by expanding, then calling `NOTIFICATIONS_FILTER_SET`
      const result = applyActions(initialState, actions, reducer);

      expect(result.items.size).toEqual(2);
      expect(result.items.get('5')).toBe(undefined);
    });
  });

  describe('MARKER_FETCH_SUCCESS', () => {
    it('sets lastRead', () => {
      const action = {
        type: MARKER_FETCH_SUCCESS,
        timeline: ['notifications'],
        marker: {
          notifications: {
            last_read_id: '1234',
          },
        },
      };

      expect(reducer(undefined, action).get('lastRead')).toEqual('1234');
    });

    it('updates the unread count', () => {
      const action = {
        type: MARKER_FETCH_SUCCESS,
        timeline: ['notifications'],
        marker: {
          notifications: {
            last_read_id: '5678',
          },
        },
      };

      const state = ImmutableMap({
        items: ImmutableOrderedMap({
          '9012': ImmutableMap({ id: '9012' }),
          '5678': ImmutableMap({ id: '5678' }),
          '1234': ImmutableMap({ id: '1234' }),
        }),
        unread: 3,
      });

      expect(reducer(state, action).get('unread')).toEqual(1);
    });
  });

  describe('MARKER_SAVE_REQUEST', () => {
    it('sets lastRead', () => {
      const action = {
        type: MARKER_SAVE_REQUEST,
        timeline: ['notifications'],
        marker: {
          notifications: {
            last_read_id: '1234',
          },
        },
      };

      expect(reducer(undefined, action).get('lastRead')).toEqual('1234');
    });

    it('updates the unread count', () => {
      const action = {
        type: MARKER_SAVE_REQUEST,
        timeline: ['notifications'],
        marker: {
          notifications: {
            last_read_id: '5678',
          },
        },
      };

      const state = ImmutableMap({
        items: ImmutableOrderedMap({
          '9012': ImmutableMap({ id: '9012' }),
          '5678': ImmutableMap({ id: '5678' }),
          '1234': ImmutableMap({ id: '1234' }),
        }),
        unread: 3,
      });

      expect(reducer(state, action).get('unread')).toEqual(1);
    });
  });

  describe('MARKER_SAVE_SUCCESS', () => {
    it('sets lastRead', () => {
      const action = {
        type: MARKER_SAVE_SUCCESS,
        timeline: ['notifications'],
        marker: {
          notifications: {
            last_read_id: '5678',
          },
        },
      };

      expect(reducer(undefined, action).get('lastRead')).toEqual('5678');
    });

    it('updates the unread count', () => {
      const action = {
        type: MARKER_SAVE_SUCCESS,
        timeline: ['notifications'],
        marker: {
          notifications: {
            last_read_id: '9012',
          },
        },
      };

      const state = ImmutableMap({
        items: ImmutableOrderedMap({
          '9012': ImmutableMap({ id: '9012' }),
          '5678': ImmutableMap({ id: '5678' }),
          '1234': ImmutableMap({ id: '1234' }),
        }),
        unread: 3,
      });

      expect(reducer(state, action).get('unread')).toEqual(0);
    });
  });
});

import {
  NOTIFICATIONS_EXPAND_SUCCESS,
} from 'soapbox/actions/notifications';
import reducer from '../notifications';
import notifications from 'soapbox/__fixtures__/notifications.json';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import { take } from 'lodash';

describe('notifications reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      items: ImmutableList(),
      hasMore: true,
      top: false,
      unread: 0,
      isLoading: false,
      queuedNotifications: ImmutableList(),
      totalQueuedNotificationsCount: 0,
      lastRead: -1,
    }));
  });

  test('NOTIFICATIONS_EXPAND_SUCCESS', () => {
    const state = undefined;
    const action = {
      type: NOTIFICATIONS_EXPAND_SUCCESS,
      notifications: take(notifications, 3),
      next: null,
      skipLoading: true,
    };
    expect(reducer(state, action)).toEqual(ImmutableMap({
      items: ImmutableList([
        ImmutableMap({
          id: '10744',
          type: 'pleroma:emoji_reaction',
          account: '9vMAje101ngtjlMj7w',
          created_at: '2020-06-10T02:54:39.000Z',
          status: '9vvNxoo5EFbbnfdXQu',
          emoji: '😢',
          is_seen: false,
        }),
        ImmutableMap({
          id: '10743',
          type: 'favourite',
          account: '9v5c6xSEgAi3Zu1Lv6',
          created_at: '2020-06-10T02:51:05.000Z',
          status: '9vvNxoo5EFbbnfdXQu',
          emoji: undefined,
          is_seen: true,
        }),
        ImmutableMap({
          id: '10741',
          type: 'favourite',
          account: '9v5cKMOPGqPcgfcWp6',
          created_at: '2020-06-10T02:05:06.000Z',
          status: '9vvNxoo5EFbbnfdXQu',
          emoji: undefined,
          is_seen: true,
        }),
      ]),
      hasMore: false,
      top: false,
      unread: 0,
      isLoading: false,
      queuedNotifications: ImmutableList(),
      totalQueuedNotificationsCount: 0,
      lastRead: -1,
    }));
  });

});

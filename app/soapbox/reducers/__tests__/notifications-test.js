import * as actions from 'soapbox/actions/notifications';
import reducer from '../notifications';
import notifications from 'soapbox/__fixtures__/notifications.json';
import markers from 'soapbox/__fixtures__/markers.json';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import { take } from 'lodash';
import { SAVE_MARKERS_SUCCESS } from 'soapbox/actions/markers';
import { ACCOUNT_BLOCK_SUCCESS, ACCOUNT_MUTE_SUCCESS } from 'soapbox/actions/accounts';
import notification from 'soapbox/__fixtures__/notification.json';
import intlMessages from 'soapbox/__fixtures__/intlMessages.json';

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

  it('should handle NOTIFICATIONS_EXPAND_SUCCESS', () => {
    const state = undefined;
    const action = {
      type: actions.NOTIFICATIONS_EXPAND_SUCCESS,
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
      unread: 1,
      isLoading: false,
      queuedNotifications: ImmutableList(),
      totalQueuedNotificationsCount: 0,
      lastRead: -1,
    }));
  });

  it('should handle SAVE_MARKERS_SUCCESS', () => {
    const state = ImmutableMap({
      unread: 1,
      lastRead: '35098811',
    });
    const action = {
      type: SAVE_MARKERS_SUCCESS,
      markers: markers,
    };
    expect(reducer(state, action)).toEqual(ImmutableMap({
      unread: 3,
      lastRead: '35098814',
    }));
  });

  it('should handle NOTIFICATIONS_EXPAND_REQUEST', () => {
    const state = ImmutableMap({
      isLoading: false,
    });
    const action = {
      type: actions.NOTIFICATIONS_EXPAND_REQUEST,
    };
    expect(reducer(state, action)).toEqual(ImmutableMap({
      isLoading: true,
    }));
  });

  it('should handle NOTIFICATIONS_EXPAND_FAIL', () => {
    const state = ImmutableMap({
      isLoading: true,
    });
    const action = {
      type: actions.NOTIFICATIONS_EXPAND_FAIL,
    };
    expect(reducer(state, action)).toEqual(ImmutableMap({
      isLoading: false,
    }));
  });

  it('should handle NOTIFICATIONS_FILTER_SET', () => {
    const state = ImmutableMap({
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
      unread: 1,
      isLoading: false,
      queuedNotifications: ImmutableList(),
      totalQueuedNotificationsCount: 0,
      lastRead: -1,
    });
    const action = {
      type: actions.NOTIFICATIONS_FILTER_SET,
    };
    expect(reducer(state, action)).toEqual(ImmutableMap({
      items: ImmutableList(),
      hasMore: true,
      top: false,
      unread: 1,
      isLoading: false,
      queuedNotifications: ImmutableList(),
      totalQueuedNotificationsCount: 0,
      lastRead: -1,
    }));
  });

  it('should handle NOTIFICATIONS_SCROLL_TOP by changing unread to 0 when top = true', () => {
    const state = ImmutableMap({
      unread: 1,
    });
    const action = {
      type: actions.NOTIFICATIONS_SCROLL_TOP,
      top: true,
    };
    expect(reducer(state, action)).toEqual(ImmutableMap({
      unread: 0,
      top: true,
    }));
  });

  it('should handle NOTIFICATIONS_SCROLL_TOP by not changing unread val when top = false', () => {
    const state = ImmutableMap({
      unread: 3,
    });
    const action = {
      type: actions.NOTIFICATIONS_SCROLL_TOP,
      top: false,
    };
    expect(reducer(state, action)).toEqual(ImmutableMap({
      unread: 3,
      top: false,
    }));
  });

  it('should handle NOTIFICATIONS_UPDATE, when top = false, increment unread', () => {
    const state = ImmutableMap({
      items: ImmutableList(),
      top: false,
      unread: 1,
    });
    //const notification = notification;
    const action = {
      type: actions.NOTIFICATIONS_UPDATE,
      notification: notification,
    };
    expect(reducer(state, action)).toEqual(ImmutableMap({
      items: ImmutableList([
                ImmutableMap({
                  id: '10743',
                  type: 'favourite',
                  account: '9v5c6xSEgAi3Zu1Lv6',
                  created_at: '2020-06-10T02:51:05.000Z',
                  status: '9vvNxoo5EFbbnfdXQu',
                  emoji: undefined,
                  is_seen: true,
                }),
            ]),
      top: false,
      unread: 2,
    }));
  });

  // it('should handle NOTIFICATIONS_UPDATE_QUEUE', () => {
  //   const state = ImmutableMap({
  //     items: ImmutableList(),
  //     queuedNotifications: ImmutableList([ take(notifications, 1) ]),
  //     totalQueuedNotificationsCount: 1,
  //   });
  //   const action = {
  //     type: actions.NOTIFICATIONS_UPDATE_QUEUE,
  //     notification: notification,
  //     intlMessages: intlMessages,
  //     intlLocale: 'en',
  //   };
  //   debugger;
  //   expect(reducer(state, action)).toEqual(ImmutableMap({
  //     items: ImmutableList([]),
  //     queuedNotifications: ImmutableList([ take(notifications, 2), ImmutableMap( intlMessages ), 'en' ]),
  //     totalQueuedNotificationsCount: 2,
  //   }));
  // });

  it('should handle NOTIFICATIONS_DEQUEUE', () => {
    const state = ImmutableMap({
      items: ImmutableList([]),
      queuedNotifications: take(notifications, 1),
      totalQueuedNotificationsCount: 1,
    });
    const action = {
      type: actions.NOTIFICATIONS_DEQUEUE,
    };
    expect(reducer(state, action)).toEqual(ImmutableMap({
      items: ImmutableList([]),
      queuedNotifications: ImmutableList([]),
      totalQueuedNotificationsCount: 0,
    }));
  });

});

import * as actions from 'soapbox/actions/notifications';
import reducer from '../notifications';
import notifications from 'soapbox/__fixtures__/notifications.json';
import { Map as ImmutableMap, OrderedMap as ImmutableOrderedMap } from 'immutable';
import { take } from 'lodash';
import { ACCOUNT_BLOCK_SUCCESS, ACCOUNT_MUTE_SUCCESS } from 'soapbox/actions/accounts';
import notification from 'soapbox/__fixtures__/notification.json';
import intlMessages from 'soapbox/__fixtures__/intlMessages.json';
import relationship from 'soapbox/__fixtures__/relationship.json';
import { TIMELINE_DELETE } from 'soapbox/actions/timelines';

describe('notifications reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      items: ImmutableOrderedMap(),
      hasMore: true,
      top: false,
      unread: 0,
      isLoading: false,
      queuedNotifications: ImmutableOrderedMap(),
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
      items: ImmutableOrderedMap([
        ['10744', ImmutableMap({
          id: '10744',
          type: 'pleroma:emoji_reaction',
          account: '9vMAje101ngtjlMj7w',
          target: null,
          created_at: '2020-06-10T02:54:39.000Z',
          status: '9vvNxoo5EFbbnfdXQu',
          emoji: '😢',
          chat_message: undefined,
          is_seen: false,
        })],
        ['10743', ImmutableMap({
          id: '10743',
          type: 'favourite',
          account: '9v5c6xSEgAi3Zu1Lv6',
          target: null,
          created_at: '2020-06-10T02:51:05.000Z',
          status: '9vvNxoo5EFbbnfdXQu',
          emoji: undefined,
          chat_message: undefined,
          is_seen: true,
        })],
        ['10741', ImmutableMap({
          id: '10741',
          type: 'favourite',
          account: '9v5cKMOPGqPcgfcWp6',
          target: null,
          created_at: '2020-06-10T02:05:06.000Z',
          status: '9vvNxoo5EFbbnfdXQu',
          emoji: undefined,
          chat_message: undefined,
          is_seen: true,
        })],
      ]),
      hasMore: false,
      top: false,
      unread: 1,
      isLoading: false,
      queuedNotifications: ImmutableOrderedMap(),
      totalQueuedNotificationsCount: 0,
      lastRead: -1,
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
      items: ImmutableOrderedMap([
        ['10744', ImmutableMap({
          id: '10744',
          type: 'pleroma:emoji_reaction',
          account: '9vMAje101ngtjlMj7w',
          target: null,
          created_at: '2020-06-10T02:54:39.000Z',
          status: '9vvNxoo5EFbbnfdXQu',
          emoji: '😢',
          chat_message: undefined,
          is_seen: false,
        })],
        ['10743', ImmutableMap({
          id: '10743',
          type: 'favourite',
          account: '9v5c6xSEgAi3Zu1Lv6',
          target: null,
          created_at: '2020-06-10T02:51:05.000Z',
          status: '9vvNxoo5EFbbnfdXQu',
          emoji: undefined,
          chat_message: undefined,
          is_seen: true,
        })],
        ['10741', ImmutableMap({
          id: '10741',
          type: 'favourite',
          account: '9v5cKMOPGqPcgfcWp6',
          target: null,
          created_at: '2020-06-10T02:05:06.000Z',
          status: '9vvNxoo5EFbbnfdXQu',
          emoji: undefined,
          chat_message: undefined,
          is_seen: true,
        })],
      ]),
      hasMore: false,
      top: false,
      unread: 1,
      isLoading: false,
      queuedNotifications: ImmutableOrderedMap(),
      totalQueuedNotificationsCount: 0,
      lastRead: -1,
    });
    const action = {
      type: actions.NOTIFICATIONS_FILTER_SET,
    };
    expect(reducer(state, action)).toEqual(ImmutableMap({
      items: ImmutableOrderedMap(),
      hasMore: true,
      top: false,
      unread: 1,
      isLoading: false,
      queuedNotifications: ImmutableOrderedMap(),
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
      items: ImmutableOrderedMap(),
      top: false,
      unread: 1,
    });
    const action = {
      type: actions.NOTIFICATIONS_UPDATE,
      notification: notification,
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
          emoji: undefined,
          chat_message: undefined,
          is_seen: true,
        })],
      ]),
      top: false,
      unread: 2,
    }));
  });

  it('should handle NOTIFICATIONS_UPDATE_QUEUE', () => {
    const state = ImmutableMap({
      items: ImmutableOrderedMap(),
      queuedNotifications: ImmutableOrderedMap(),
      totalQueuedNotificationsCount: 0,
    });
    const action = {
      type: actions.NOTIFICATIONS_UPDATE_QUEUE,
      notification: notification,
      intlMessages: intlMessages,
      intlLocale: 'en',
    };
    expect(reducer(state, action)).toEqual(ImmutableMap({
      items: ImmutableOrderedMap(),
      queuedNotifications: ImmutableOrderedMap([[notification.id, {
        notification: notification,
        intlMessages: intlMessages,
        intlLocale: 'en',
      }]]),
      totalQueuedNotificationsCount: 1,
    }));
  });

  it('should handle NOTIFICATIONS_DEQUEUE', () => {
    const state = ImmutableMap({
      items: ImmutableOrderedMap(),
      queuedNotifications: take(notifications, 1),
      totalQueuedNotificationsCount: 1,
    });
    const action = {
      type: actions.NOTIFICATIONS_DEQUEUE,
    };
    expect(reducer(state, action)).toEqual(ImmutableMap({
      items: ImmutableOrderedMap(),
      queuedNotifications: ImmutableOrderedMap(),
      totalQueuedNotificationsCount: 0,
    }));
  });

  it('should handle NOTIFICATIONS_EXPAND_SUCCESS with non-empty items and next set true', () => {
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
          chat_message: undefined,
          is_seen: false,
        })],
      ]),
      unread: 1,
      hasMore: true,
      isLoading: false,
    });
    const action = {
      type: actions.NOTIFICATIONS_EXPAND_SUCCESS,
      notifications: take(notifications, 3),
      next: true,
    };
    expect(reducer(state, action)).toEqual(ImmutableMap({
      items: ImmutableOrderedMap([
        ['10744', ImmutableMap({
          id: '10744',
          type: 'pleroma:emoji_reaction',
          account: '9vMAje101ngtjlMj7w',
          target: null,
          created_at: '2020-06-10T02:54:39.000Z',
          status: '9vvNxoo5EFbbnfdXQu',
          emoji: '😢',
          chat_message: undefined,
          is_seen: false,
        })],
        ['10743', ImmutableMap({
          id: '10743',
          type: 'favourite',
          account: '9v5c6xSEgAi3Zu1Lv6',
          target: null,
          created_at: '2020-06-10T02:51:05.000Z',
          status: '9vvNxoo5EFbbnfdXQu',
          emoji: undefined,
          chat_message: undefined,
          is_seen: true,
        })],
        ['10741', ImmutableMap({
          id: '10741',
          type: 'favourite',
          account: '9v5cKMOPGqPcgfcWp6',
          target: null,
          created_at: '2020-06-10T02:05:06.000Z',
          status: '9vvNxoo5EFbbnfdXQu',
          emoji: undefined,
          chat_message: undefined,
          is_seen: true,
        })],
        ['10734', ImmutableMap({
          id: '10734',
          type: 'pleroma:emoji_reaction',
          account: '9vMAje101ngtjlMj7w',
          target: null,
          created_at: '2020-06-10T02:54:39.000Z',
          status: '9vvNxoo5EFbbnfdXQu',
          emoji: '😢',
          chat_message: undefined,
          is_seen: false,
        })],
      ]),
      unread: 1,
      hasMore: true,
      isLoading: false,
    }));
  });

  it('should handle NOTIFICATIONS_EXPAND_SUCCESS with empty items and next set true', () => {
    const state = ImmutableMap({
      items: ImmutableOrderedMap(),
      unread: 1,
      hasMore: true,
      isLoading: false,
    });
    const action = {
      type: actions.NOTIFICATIONS_EXPAND_SUCCESS,
      notifications: take(notifications, 3),
      next: true,
    };
    expect(reducer(state, action)).toEqual(ImmutableMap({
      items: ImmutableOrderedMap([
        ['10744', ImmutableMap({
          id: '10744',
          type: 'pleroma:emoji_reaction',
          account: '9vMAje101ngtjlMj7w',
          target: null,
          created_at: '2020-06-10T02:54:39.000Z',
          status: '9vvNxoo5EFbbnfdXQu',
          emoji: '😢',
          chat_message: undefined,
          is_seen: false,
        })],
        ['10743', ImmutableMap({
          id: '10743',
          type: 'favourite',
          account: '9v5c6xSEgAi3Zu1Lv6',
          target: null,
          created_at: '2020-06-10T02:51:05.000Z',
          status: '9vvNxoo5EFbbnfdXQu',
          emoji: undefined,
          chat_message: undefined,
          is_seen: true,
        })],
        ['10741', ImmutableMap({
          id: '10741',
          type: 'favourite',
          account: '9v5cKMOPGqPcgfcWp6',
          target: null,
          created_at: '2020-06-10T02:05:06.000Z',
          status: '9vvNxoo5EFbbnfdXQu',
          emoji: undefined,
          chat_message: undefined,
          is_seen: true,
        })],
      ]),
      unread: 1,
      hasMore: true,
      isLoading: false,
    }));
  });

  it('should handle ACCOUNT_BLOCK_SUCCESS', () => {
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
          chat_message: undefined,
          is_seen: false,
        })],
        ['10743', ImmutableMap({
          id: '10743',
          type: 'favourite',
          account: '9v5c6xSEgAi3Zu1Lv6',
          target: null,
          created_at: '2020-06-10T02:51:05.000Z',
          status: '9vvNxoo5EFbbnfdXQu',
          emoji: undefined,
          chat_message: undefined,
          is_seen: true,
        })],
        ['10741', ImmutableMap({
          id: '10741',
          type: 'favourite',
          account: '9v5cKMOPGqPcgfcWp6',
          target: null,
          created_at: '2020-06-10T02:05:06.000Z',
          status: '9vvNxoo5EFbbnfdXQu',
          emoji: undefined,
          chat_message: undefined,
          is_seen: true,
        })],
      ]),
    });
    const action = {
      type: ACCOUNT_BLOCK_SUCCESS,
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
          emoji: undefined,
          chat_message: undefined,
          is_seen: true,
        })],
        ['10741', ImmutableMap({
          id: '10741',
          type: 'favourite',
          account: '9v5cKMOPGqPcgfcWp6',
          target: null,
          created_at: '2020-06-10T02:05:06.000Z',
          status: '9vvNxoo5EFbbnfdXQu',
          emoji: undefined,
          chat_message: undefined,
          is_seen: true,
        })],
      ]),
    }));
  });

  it('should handle ACCOUNT_MUTE_SUCCESS', () => {
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
          chat_message: undefined,
          is_seen: false,
        })],
        ['10743', ImmutableMap({
          id: '10743',
          type: 'favourite',
          account: '9v5c6xSEgAi3Zu1Lv6',
          target: null,
          created_at: '2020-06-10T02:51:05.000Z',
          status: '9vvNxoo5EFbbnfdXQu',
          emoji: undefined,
          chat_message: undefined,
          is_seen: true,
        })],
        ['10741', ImmutableMap({
          id: '10741',
          type: 'favourite',
          account: '9v5cKMOPGqPcgfcWp6',
          target: null,
          created_at: '2020-06-10T02:05:06.000Z',
          status: '9vvNxoo5EFbbnfdXQu',
          emoji: undefined,
          chat_message: undefined,
          is_seen: true,
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
          emoji: undefined,
          chat_message: undefined,
          is_seen: true,
        })],
        ['10741', ImmutableMap({
          id: '10741',
          type: 'favourite',
          account: '9v5cKMOPGqPcgfcWp6',
          target: null,
          created_at: '2020-06-10T02:05:06.000Z',
          status: '9vvNxoo5EFbbnfdXQu',
          emoji: undefined,
          chat_message: undefined,
          is_seen: true,
        })],
      ]),
    }));
  });

  it('should handle NOTIFICATIONS_CLEAR', () => {
    const state = ImmutableMap({
      items: ImmutableOrderedMap(),
      hasMore: true,
    });
    const action = {
      type: actions.NOTIFICATIONS_CLEAR,
    };
    expect(reducer(state, action)).toEqual(ImmutableMap({
      items: ImmutableOrderedMap(),
      hasMore: false,
    }));
  });

  it('should handle NOTIFICATIONS_MARK_READ_REQUEST', () => {
    const state = ImmutableMap({
      items: ImmutableOrderedMap(),
    });
    const action = {
      type: actions.NOTIFICATIONS_MARK_READ_REQUEST,
      lastRead: 35098814,
    };
    expect(reducer(state, action)).toEqual(ImmutableMap({
      items: ImmutableOrderedMap(),
      lastRead: 35098814,
    }));
  });

  it('should handle TIMELINE_DELETE', () => {
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
          chat_message: undefined,
          is_seen: false,
        })],
        ['10743', ImmutableMap({
          id: '10743',
          type: 'favourite',
          account: '9v5c6xSEgAi3Zu1Lv6',
          target: null,
          created_at: '2020-06-10T02:51:05.000Z',
          status: '9vvNxoo5EFbbnfdXQu',
          emoji: undefined,
          chat_message: undefined,
          is_seen: true,
        })],
        ['10741', ImmutableMap({
          id: '10741',
          type: 'favourite',
          account: '9v5cKMOPGqPcgfcWp6',
          target: null,
          created_at: '2020-06-10T02:05:06.000Z',
          status: '9vvNxoo5EFbbnfdXQu',
          emoji: undefined,
          chat_message: undefined,
          is_seen: true,
        })],
      ]),
    });
    const action = {
      type: TIMELINE_DELETE,
      id: '9vvNxoo5EFbbnfdXQu',
    };
    expect(reducer(state, action)).toEqual(ImmutableMap({
      items: ImmutableOrderedMap(),
    }));
  });

  // Disable for now
  // https://gitlab.com/soapbox-pub/soapbox-fe/-/issues/432
  //
  // it('should handle TIMELINE_DISCONNECT', () => {
  //   const state = ImmutableMap({
  //     items: ImmutableOrderedSet([
  //       ImmutableMap({
  //         id: '10744',
  //         type: 'pleroma:emoji_reaction',
  //         account: '9vMAje101ngtjlMj7w',
  //         created_at: '2020-06-10T02:54:39.000Z',
  //         status: '9vvNxoo5EFbbnfdXQu',
  //         emoji: '😢',
  //         chat_message: undefined,
  //         is_seen: false,
  //       }),
  //       ImmutableMap({
  //         id: '10743',
  //         type: 'favourite',
  //         account: '9v5c6xSEgAi3Zu1Lv6',
  //         created_at: '2020-06-10T02:51:05.000Z',
  //         status: '9vvNxoo5EFbbnfdXQu',
  //         emoji: undefined,
  //         chat_message: undefined,
  //         is_seen: true,
  //       }),
  //       ImmutableMap({
  //         id: '10741',
  //         type: 'favourite',
  //         account: '9v5cKMOPGqPcgfcWp6',
  //         created_at: '2020-06-10T02:05:06.000Z',
  //         status: '9vvNxoo5EFbbnfdXQu',
  //         emoji: undefined,
  //         chat_message: undefined,
  //         is_seen: true,
  //       }),
  //     ]),
  //   });
  //   const action = {
  //     type: TIMELINE_DISCONNECT,
  //     timeline: 'home',
  //   };
  //   expect(reducer(state, action)).toEqual(ImmutableMap({
  //     items: ImmutableOrderedSet([
  //       null,
  //       ImmutableMap({
  //         id: '10744',
  //         type: 'pleroma:emoji_reaction',
  //         account: '9vMAje101ngtjlMj7w',
  //         created_at: '2020-06-10T02:54:39.000Z',
  //         status: '9vvNxoo5EFbbnfdXQu',
  //         emoji: '😢',
  //         chat_message: undefined,
  //         is_seen: false,
  //       }),
  //       ImmutableMap({
  //         id: '10743',
  //         type: 'favourite',
  //         account: '9v5c6xSEgAi3Zu1Lv6',
  //         created_at: '2020-06-10T02:51:05.000Z',
  //         status: '9vvNxoo5EFbbnfdXQu',
  //         emoji: undefined,
  //         chat_message: undefined,
  //         is_seen: true,
  //       }),
  //       ImmutableMap({
  //         id: '10741',
  //         type: 'favourite',
  //         account: '9v5cKMOPGqPcgfcWp6',
  //         created_at: '2020-06-10T02:05:06.000Z',
  //         status: '9vvNxoo5EFbbnfdXQu',
  //         emoji: undefined,
  //         chat_message: undefined,
  //         is_seen: true,
  //       }),
  //     ]),
  //   }));
  // });

});

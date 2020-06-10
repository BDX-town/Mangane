import reducer from '../notifications';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';

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
});

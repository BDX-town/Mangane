import { OrderedMap as ImmutableOrderedMap } from 'immutable';

import { __stub } from 'soapbox/api';
import { mockStore, rootState } from 'soapbox/jest/test-helpers';
import { normalizeNotification } from 'soapbox/normalizers';

import { markReadNotifications } from '../notifications';

describe('markReadNotifications()', () => {
  it('fires off marker when top notification is newer than lastRead', async() => {
    __stub((mock) => mock.onPost('/api/v1/markers').reply(200, {}));

    const items = ImmutableOrderedMap({
      '10': normalizeNotification({ id: '10' }),
    });

    const state = rootState
      .set('me', '123')
      .setIn(['notifications', 'lastRead'], '9')
      .setIn(['notifications', 'items'], items);

    const store = mockStore(state);

    const expectedActions =  [{
      type: 'MARKER_SAVE_REQUEST',
      marker: {
        notifications: {
          last_read_id: '10',
        },
      },
    }];

    store.dispatch(markReadNotifications());
    const actions = store.getActions();

    expect(actions).toEqual(expectedActions);
  });
});

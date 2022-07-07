import { __stub } from 'soapbox/api';
import { mockStore, rootState } from 'soapbox/jest/test-helpers';

import { fetchCarouselAvatars } from '../carousels';

describe('fetchCarouselAvatars()', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore(rootState);
  });

  describe('with a successful API request', () => {
    let avatars: Record<string, any>[];

    beforeEach(() => {
      avatars = [
        { account_id: '1', acct: 'jl', account_avatar: 'https://example.com/some.jpg' },
      ];

      __stub((mock) => {
        mock.onGet('/api/v1/truth/carousels/avatars').reply(200, avatars);
      });
    });

    it('should fetch the users from the API', async() => {
      const expectedActions = [
        { type: 'CAROUSEL_AVATAR_REQUEST' },
        { type: 'CAROUSEL_AVATAR_SUCCESS', payload: avatars },
      ];

      await store.dispatch(fetchCarouselAvatars());
      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('with an unsuccessful API request', () => {
    beforeEach(() => {
      __stub((mock) => {
        mock.onGet('/api/v1/truth/carousels/avatars').networkError();
      });
    });

    it('should dispatch failed action', async() => {
      const expectedActions = [
        { type: 'CAROUSEL_AVATAR_REQUEST' },
        { type: 'CAROUSEL_AVATAR_FAIL' },
      ];

      await store.dispatch(fetchCarouselAvatars());
      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });
});

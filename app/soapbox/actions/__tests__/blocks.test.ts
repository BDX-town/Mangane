import { __stub } from 'soapbox/api';
import { mockStore, rootState } from 'soapbox/jest/test-helpers';
import { ListRecord, ReducerRecord as UserListsRecord } from 'soapbox/reducers/user_lists';

import { expandBlocks, fetchBlocks } from '../blocks';

const account = {
  acct: 'twoods',
  display_name: 'Tiger Woods',
  id: '22',
  username: 'twoods',
};

describe('fetchBlocks()', () => {
  let store: ReturnType<typeof mockStore>;

  describe('if logged out', () => {
    beforeEach(() => {
      const state = rootState.set('me', null);
      store = mockStore(state);
    });

    it('should do nothing', async() => {
      await store.dispatch(fetchBlocks());
      const actions = store.getActions();

      expect(actions).toEqual([]);
    });
  });

  describe('if logged in', () => {
    beforeEach(() => {
      const state = rootState.set('me', '1234');
      store = mockStore(state);
    });

    describe('with a successful API request', () => {
      beforeEach(() => {
        const blocks = require('soapbox/__fixtures__/blocks.json');

        __stub((mock) => {
          mock.onGet('/api/v1/blocks').reply(200, blocks, {
            link: '<https://example.com/api/v1/blocks?since_id=1>; rel=\'prev\'',
          });
        });
      });

      it('should fetch blocks from the API', async() => {
        const expectedActions = [
          { type: 'BLOCKS_FETCH_REQUEST' },
          { type: 'ACCOUNTS_IMPORT', accounts: [account] },
          { type: 'BLOCKS_FETCH_SUCCESS', accounts: [account], next: null },
          {
            type: 'RELATIONSHIPS_FETCH_REQUEST',
            ids: ['22'],
            skipLoading: true,
          },
        ];
        await store.dispatch(fetchBlocks());
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });

    describe('with an unsuccessful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet('/api/v1/blocks').networkError();
        });
      });

      it('should dispatch failed action', async() => {
        const expectedActions = [
          { type: 'BLOCKS_FETCH_REQUEST' },
          { type: 'BLOCKS_FETCH_FAIL', error: new Error('Network Error') },
        ];
        await store.dispatch(fetchBlocks());
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });
  });
});

describe('expandBlocks()', () => {
  let store: ReturnType<typeof mockStore>;

  describe('if logged out', () => {
    beforeEach(() => {
      const state = rootState.set('me', null);
      store = mockStore(state);
    });

    it('should do nothing', async() => {
      await store.dispatch(expandBlocks());
      const actions = store.getActions();

      expect(actions).toEqual([]);
    });
  });

  describe('if logged in', () => {
    beforeEach(() => {
      const state = rootState.set('me', '1234');
      store = mockStore(state);
    });

    describe('without a url', () => {
      beforeEach(() => {
        const state = rootState
          .set('me', '1234')
          .set('user_lists', UserListsRecord({ blocks: ListRecord({ next: null }) }));
        store = mockStore(state);
      });

      it('should do nothing', async() => {
        await store.dispatch(expandBlocks());
        const actions = store.getActions();

        expect(actions).toEqual([]);
      });
    });

    describe('with a url', () => {
      beforeEach(() => {
        const state = rootState
          .set('me', '1234')
          .set('user_lists', UserListsRecord({ blocks: ListRecord({ next: 'example' }) }));
        store = mockStore(state);
      });

      describe('with a successful API request', () => {
        beforeEach(() => {
          const blocks = require('soapbox/__fixtures__/blocks.json');

          __stub((mock) => {
            mock.onGet('example').reply(200, blocks, {
              link: '<https://example.com/api/v1/blocks?since_id=1>; rel=\'prev\'',
            });
          });
        });

        it('should fetch blocks from the url', async() => {
          const expectedActions = [
            { type: 'BLOCKS_EXPAND_REQUEST' },
            { type: 'ACCOUNTS_IMPORT', accounts: [account] },
            { type: 'BLOCKS_EXPAND_SUCCESS', accounts: [account], next: null },
            {
              type: 'RELATIONSHIPS_FETCH_REQUEST',
              ids: ['22'],
              skipLoading: true,
            },
          ];
          await store.dispatch(expandBlocks());
          const actions = store.getActions();

          expect(actions).toEqual(expectedActions);
        });
      });

      describe('with an unsuccessful API request', () => {
        beforeEach(() => {
          __stub((mock) => {
            mock.onGet('example').networkError();
          });
        });

        it('should dispatch failed action', async() => {
          const expectedActions = [
            { type: 'BLOCKS_EXPAND_REQUEST' },
            { type: 'BLOCKS_EXPAND_FAIL', error: new Error('Network Error') },
          ];
          await store.dispatch(expandBlocks());
          const actions = store.getActions();

          expect(actions).toEqual(expectedActions);
        });
      });
    });
  });
});

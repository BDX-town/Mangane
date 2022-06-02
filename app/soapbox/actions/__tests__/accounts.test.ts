import { Map as ImmutableMap } from 'immutable';

import { __stub } from 'soapbox/api';
import { mockStore } from 'soapbox/jest/test-helpers';
import rootReducer from 'soapbox/reducers';

import { normalizeAccount } from '../../normalizers';
import { createAccount, fetchAccount, fetchAccountByUsername } from '../accounts';

let store;

describe('createAccount()', () => {
  const params = {
    email: 'foo@bar.com',
  };

  describe('with a successful API request', () => {
    beforeEach(() => {
      const state = rootReducer(undefined, {});
      store = mockStore(state);

      __stub((mock) => {
        mock.onPost('/api/v1/accounts').reply(200, { token: '123 ' });
      });
    });

    it('dispatches the correct actions', async() => {
      const expectedActions = [
        { type: 'ACCOUNT_CREATE_REQUEST', params },
        {
          type: 'ACCOUNT_CREATE_SUCCESS',
          params,
          token: { token: '123 ' },
        },
      ];
      await store.dispatch(createAccount(params));
      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });
});

describe('fetchAccount()', () => {
  const id = '123';

  describe('when the account has "should_refetch" set to false', () => {
    beforeEach(() => {
      const account = normalizeAccount({
        id,
        acct: 'justin-username',
        display_name: 'Justin L',
        avatar: 'test.jpg',
      });

      const state = rootReducer(undefined, {})
        .set('accounts', ImmutableMap({
          [id]: account,
        }));

      store = mockStore(state);

      __stub((mock) => {
        mock.onGet(`/api/v1/accounts/${id}`).reply(200, account);
      });
    });

    it('should do nothing', async() => {
      await store.dispatch(fetchAccount(id));
      const actions = store.getActions();

      expect(actions).toEqual([]);
    });
  });

  describe('with a successful API request', () => {
    const account = require('soapbox/__fixtures__/pleroma-account.json');

    beforeEach(() => {
      const state = rootReducer(undefined, {});
      store = mockStore(state);

      __stub((mock) => {
        mock.onGet(`/api/v1/accounts/${id}`).reply(200, account);
      });
    });

    it('should dispatch the correct actions', async() => {
      const expectedActions = [
        { type: 'ACCOUNT_FETCH_REQUEST', id: '123' },
        { type: 'ACCOUNTS_IMPORT', accounts: [account] },
        {
          type: 'ACCOUNT_FETCH_SUCCESS',
          account,
        },
      ];

      await store.dispatch(fetchAccount(id));
      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('with an unsuccessful API request', () => {
    beforeEach(() => {
      const state = rootReducer(undefined, {});
      store = mockStore(state);

      __stub((mock) => {
        mock.onGet(`/api/v1/accounts/${id}`).networkError();
      });
    });

    it('should dispatch the correct actions', async() => {
      const expectedActions = [
        { type: 'ACCOUNT_FETCH_REQUEST', id: '123' },
        {
          type: 'ACCOUNT_FETCH_FAIL',
          id,
          error: new Error('Network Error'),
          skipAlert: true,
        },
      ];

      await store.dispatch(fetchAccount(id));
      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });
});

describe('fetchAccountByUsername()', () => {
  const id = '123';
  const username = 'tiger';
  let state, account;

  describe('when the account has already been cached in redux', () => {
    beforeEach(() => {
      account = normalizeAccount({
        id,
        acct: username,
        display_name: 'Tiger',
        avatar: 'test.jpg',
        birthday: undefined,
      });

      state = rootReducer(undefined, {})
        .set('accounts', ImmutableMap({
          [id]: account,
        }));

      store = mockStore(state);

      __stub((mock) => {
        mock.onGet(`/api/v1/accounts/${id}`).reply(200, account);
      });
    });

    it('should return null', async() => {
      const result = await store.dispatch(fetchAccountByUsername(username));
      const actions = store.getActions();

      expect(actions).toEqual([]);
      expect(result).toBeNull();
    });
  });

  describe('when "accountByUsername" feature is enabled', () => {
    beforeEach(() => {
      const state = rootReducer(undefined, {})
        .set('instance', {
          version: '2.7.2 (compatible; Pleroma 2.4.52-1337-g4779199e.gleasonator+soapbox)',
          pleroma: ImmutableMap({
            metadata: ImmutableMap({
              features: [],
            }),
          }),
        })
        .set('me', '123');
      store = mockStore(state);
    });

    describe('with a successful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet(`/api/v1/accounts/${username}`).reply(200, account);
          mock.onGet(`/api/v1/accounts/relationships?${[account.id].map(id => `id[]=${id}`).join('&')}`);
        });
      });

      it('should return dispatch the proper actions', async() => {
        await store.dispatch(fetchAccountByUsername(username));
        const actions = store.getActions();

        expect(actions[0]).toEqual({
          type: 'RELATIONSHIPS_FETCH_REQUEST',
          ids: ['123'],
          skipLoading: true,
        });
        expect(actions[1].type).toEqual('ACCOUNTS_IMPORT');
        expect(actions[2].type).toEqual('ACCOUNT_FETCH_SUCCESS');
      });
    });

    describe('with an unsuccessful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet(`/api/v1/accounts/${username}`).networkError();
        });
      });

      it('should return dispatch the proper actions', async() => {
        const expectedActions = [
          {
            type: 'ACCOUNT_FETCH_FAIL',
            id: null,
            error: new Error('Network Error'),
            skipAlert: true,
          },
          { type: 'ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP', username: 'tiger' },
        ];

        await store.dispatch(fetchAccountByUsername(username));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });
  });

  describe('when "accountLookup" feature is enabled', () => {
    beforeEach(() => {
      const state = rootReducer(undefined, {})
        .set('instance', {
          version: '3.4.1 (compatible; TruthSocial 1.0.0)',
          pleroma: ImmutableMap({
            metadata: ImmutableMap({
              features: [],
            }),
          }),
        })
        .set('me', '123');
      store = mockStore(state);
    });

    describe('with a successful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet('/api/v1/accounts/lookup').reply(200, account);
        });
      });

      it('should return dispatch the proper actions', async() => {
        await store.dispatch(fetchAccountByUsername(username));
        const actions = store.getActions();

        expect(actions[0]).toEqual({
          type: 'ACCOUNT_LOOKUP_REQUEST',
          acct: username,
        });
        expect(actions[1].type).toEqual('ACCOUNTS_IMPORT');
        expect(actions[2].type).toEqual('ACCOUNT_LOOKUP_SUCCESS');
        expect(actions[3].type).toEqual('ACCOUNT_FETCH_SUCCESS');
      });
    });

    describe('with an unsuccessful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet('/api/v1/accounts/lookup').networkError();
        });
      });

      it('should return dispatch the proper actions', async() => {
        const expectedActions = [
          { type: 'ACCOUNT_LOOKUP_REQUEST', acct: 'tiger' },
          { type: 'ACCOUNT_LOOKUP_FAIL' },
          {
            type: 'ACCOUNT_FETCH_FAIL',
            id: null,
            error: new Error('Network Error'),
            skipAlert: true,
          },
          { type: 'ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP', username },
        ];

        await store.dispatch(fetchAccountByUsername(username));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });
  });

  describe('when using the accountSearch function', () => {
    beforeEach(() => {
      const state = rootReducer(undefined, {}).set('me', '123');
      store = mockStore(state);
    });

    describe('with a successful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet('/api/v1/accounts/search').reply(200, [account]);
        });
      });

      it('should return dispatch the proper actions', async() => {
        await store.dispatch(fetchAccountByUsername(username));
        const actions = store.getActions();

        expect(actions[0]).toEqual({
          type: 'ACCOUNT_SEARCH_REQUEST',
          params: { q: username, limit: 5, resolve: true },
        });
        expect(actions[1].type).toEqual('ACCOUNTS_IMPORT');
        expect(actions[2].type).toEqual('ACCOUNT_SEARCH_SUCCESS');
        expect(actions[3]).toEqual({
          type: 'RELATIONSHIPS_FETCH_REQUEST',
          ids: [ '123' ],
          skipLoading: true,
        });
        expect(actions[4].type).toEqual('ACCOUNT_FETCH_SUCCESS');
      });
    });

    describe('with an unsuccessful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet('/api/v1/accounts/search').networkError();
        });
      });

      it('should return dispatch the proper actions', async() => {
        const expectedActions = [
          {
            type: 'ACCOUNT_SEARCH_REQUEST',
            params: { q: username, limit: 5, resolve: true },
          },
          { type: 'ACCOUNT_SEARCH_FAIL', skipAlert: true },
          {
            type: 'ACCOUNT_FETCH_FAIL',
            id: null,
            error: new Error('Network Error'),
            skipAlert: true,
          },
          { type: 'ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP', username },
        ];

        await store.dispatch(fetchAccountByUsername(username));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });
  });
});

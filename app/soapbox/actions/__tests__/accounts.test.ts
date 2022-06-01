import { Map as ImmutableMap } from 'immutable';

import { __stub } from 'soapbox/api';
import { mockStore } from 'soapbox/jest/test-helpers';
import rootReducer from 'soapbox/reducers';

import { normalizeAccount } from '../../normalizers';
import { createAccount, fetchAccount } from '../accounts';

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

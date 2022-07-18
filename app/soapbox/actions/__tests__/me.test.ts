import { Map as ImmutableMap } from 'immutable';

import { __stub } from 'soapbox/api';
import { mockStore, rootState } from 'soapbox/jest/test-helpers';

import {
  fetchMe, patchMe,
} from '../me';

jest.mock('../../storage/kv_store', () => ({
  __esModule: true,
  default: {
    getItemOrError: jest.fn().mockReturnValue(Promise.resolve({})),
  },
}));

let store: ReturnType<typeof mockStore>;

describe('fetchMe()', () => {
  describe('without a token', () => {
    beforeEach(() => {
      const state = rootState;
      store = mockStore(state);
    });

    it('dispatches the correct actions', async() => {
      const expectedActions = [{ type: 'ME_FETCH_SKIP' }];
      await store.dispatch(fetchMe());
      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('with a token', () => {
    const accountUrl = 'accountUrl';
    const token = '123';

    beforeEach(() => {
      const state = rootState
        .set('auth', ImmutableMap({
          me: accountUrl,
          users: ImmutableMap({
            [accountUrl]: ImmutableMap({
              'access_token': token,
            }),
          }),
        }))
        .set('accounts', ImmutableMap({
          [accountUrl]: {
            url: accountUrl,
          },
        }) as any);
      store = mockStore(state);
    });

    describe('with a successful API response', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet('/api/v1/accounts/verify_credentials').reply(200, {});
        });
      });

      it('dispatches the correct actions', async() => {
        const expectedActions =  [
          { type: 'ME_FETCH_REQUEST' },
          { type: 'AUTH_ACCOUNT_REMEMBER_REQUEST', accountUrl },
          { type: 'ACCOUNTS_IMPORT', accounts: [] },
          {
            type: 'AUTH_ACCOUNT_REMEMBER_SUCCESS',
            account: {},
            accountUrl,
          },
          { type: 'VERIFY_CREDENTIALS_REQUEST', token: '123' },
          { type: 'ACCOUNTS_IMPORT', accounts: [] },
          { type: 'VERIFY_CREDENTIALS_SUCCESS', token: '123', account: {} },
        ];
        await store.dispatch(fetchMe());
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });
  });
});

describe('patchMe()', () => {
  beforeEach(() => {
    const state = rootState;
    store = mockStore(state);
  });

  describe('with a successful API response', () => {
    beforeEach(() => {
      __stub((mock) => {
        mock.onPatch('/api/v1/accounts/update_credentials').reply(200, {});
      });
    });

    it('dispatches the correct actions', async() => {
      const expectedActions =  [
        { type: 'ME_PATCH_REQUEST' },
        { type: 'ACCOUNTS_IMPORT', accounts: [] },
        {
          type: 'ME_PATCH_SUCCESS',
          me: {},
        },
      ];
      await store.dispatch(patchMe({}));
      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });
});
import { Map as ImmutableMap } from 'immutable';

import { __stub } from 'soapbox/api';
import { mockStore, rootState } from 'soapbox/jest/test-helpers';
import { normalizeInstance } from 'soapbox/normalizers';

import {
  fetchSuggestions,
} from '../suggestions';

let store: ReturnType<typeof mockStore>;
let state;

describe('fetchSuggestions()', () => {
  describe('with Truth Social software', () => {
    beforeEach(() => {
      state = rootState
        .set('instance', normalizeInstance({
          version: '3.4.1 (compatible; TruthSocial 1.0.0)',
          pleroma: ImmutableMap({
            metadata: ImmutableMap({
              features: [],
            }),
          }),
        }))
        .set('me', '123');
      store = mockStore(state);
    });

    describe('with a successful API request', () => {
      const response = [
        {
          account_id: '1',
          acct: 'jl',
          account_avatar: 'https://example.com/some.jpg',
          display_name: 'justin',
          note: '<p>note</p>',
          verified: true,
        },
      ];

      beforeEach(() => {
        __stub((mock) => {
          mock.onGet('/api/v1/truth/carousels/suggestions').reply(200, response, {
            link: '<https://example.com/api/v1/truth/carousels/suggestions?since_id=1>; rel=\'prev\'',
          });
        });
      });

      it('dispatches the correct actions', async() => {
        const expectedActions = [
          { type: 'SUGGESTIONS_V2_FETCH_REQUEST', skipLoading: true },
          {
            type: 'ACCOUNTS_IMPORT', accounts: [{
              acct: response[0].acct,
              avatar: response[0].account_avatar,
              avatar_static: response[0].account_avatar,
              id: response[0].account_id,
              note: response[0].note,
              should_refetch: true,
              verified: response[0].verified,
              display_name: response[0].display_name,
            }],
          },
          {
            type: 'SUGGESTIONS_TRUTH_FETCH_SUCCESS',
            suggestions: response,
            next: undefined,
            skipLoading: true,
          },
          {
            type: 'RELATIONSHIPS_FETCH_REQUEST',
            skipLoading: true,
            ids: [response[0].account_id],
          },
        ];
        await store.dispatch(fetchSuggestions());
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });

    describe('with an unsuccessful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet('/api/v1/truth/carousels/suggestions').networkError();
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'SUGGESTIONS_V2_FETCH_REQUEST', skipLoading: true },
          {
            type: 'SUGGESTIONS_V2_FETCH_FAIL',
            error: new Error('Network Error'),
            skipLoading: true,
            skipAlert: true,
          },
        ];

        await store.dispatch(fetchSuggestions());
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });
  });
});

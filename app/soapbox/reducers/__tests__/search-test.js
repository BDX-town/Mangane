import { Map as ImmutableMap, List as ImmutableList, Record as ImmutableRecord } from 'immutable';

import {
  SEARCH_CHANGE,
  SEARCH_CLEAR,
  SEARCH_EXPAND_SUCCESS,
} from 'soapbox/actions/search';

import reducer from '../search';

describe('search reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {}).toJS()).toEqual({
      value: '',
      submitted: false,
      submittedValue: '',
      hidden: false,
      results: {
        accounts: [],
        statuses: [],
        hashtags: [],
        accountsHasMore: false,
        statusesHasMore: false,
        hashtagsHasMore: false,
        accountsLoaded: false,
        statusesLoaded: false,
        hashtagsLoaded: false,
      },
      filter: 'accounts',
      accountId: null,
    });
  });

  describe('SEARCH_CHANGE', () => {
    it('sets the value', () => {
      const state = ImmutableMap({ value: 'hell' });
      const action = { type: SEARCH_CHANGE, value: 'hello' };
      expect(reducer(state, action).get('value')).toEqual('hello');
    });
  });

  describe('SEARCH_CLEAR', () => {
    it('resets the state', () => {
      const state = ImmutableRecord({
        value: 'hello world',
        submitted: true,
        submittedValue: 'hello world',
        hidden: false,
        results: ImmutableRecord({})(),
        filter: 'statuses',
      })();

      const action = { type: SEARCH_CLEAR };

      const expected = {
        value: '',
        submitted: false,
        submittedValue: '',
        hidden: false,
        results: {
          accounts: [],
          statuses: [],
          hashtags: [],
          accountsHasMore: false,
          statusesHasMore: false,
          hashtagsHasMore: false,
          accountsLoaded: false,
          statusesLoaded: false,
          hashtagsLoaded: false,
        },
        filter: 'accounts',
        accountId: null,
      };

      expect(reducer(state, action).toJS()).toEqual(expected);
    });
  });

  describe(SEARCH_EXPAND_SUCCESS, () => {
    it('imports hashtags as maps', () => {
      const state = ImmutableRecord({
        value: 'artist',
        submitted: true,
        submittedValue: 'artist',
        hidden: false,
        results: ImmutableRecord({
          hashtags: ImmutableList(),
          hashtagsHasMore: false,
          hashtagsLoaded: true,
        })(),
        filter: 'hashtags',
      })();

      const action = {
        type: SEARCH_EXPAND_SUCCESS,
        results: {
          accounts: [],
          statuses: [],
          hashtags: [{
            name: 'artist',
            url: 'https://gleasonator.com/tags/artist',
            history: [],
          }],
        },
        searchTerm: 'artist',
        searchType: 'hashtags',
      };

      const expected = {
        value: 'artist',
        submitted: true,
        submittedValue: 'artist',
        hidden: false,
        results: {
          hashtags: [
            {
              name: 'artist',
              url: 'https://gleasonator.com/tags/artist',
              history: [],
            },
          ],
          hashtagsHasMore: false,
          hashtagsLoaded: true,
        },
        filter: 'hashtags',
      };

      expect(reducer(state, action).toJS()).toEqual(expected);
    });
  });
});

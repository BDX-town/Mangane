import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';

import {
  SEARCH_CHANGE,
  SEARCH_CLEAR,
  SEARCH_EXPAND_SUCCESS,
} from 'soapbox/actions/search';

import reducer from '../search';

describe('search reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      value: '',
      submitted: false,
      submittedValue: '',
      hidden: false,
      results: ImmutableMap(),
      filter: 'accounts',
    }));
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
      const state = ImmutableMap({
        value: 'hello world',
        submitted: true,
        submittedValue: 'hello world',
        hidden: false,
        results: ImmutableMap(),
        filter: 'statuses',
      });

      const action = { type: SEARCH_CLEAR };

      const expected = ImmutableMap({
        value: '',
        submitted: false,
        submittedValue: '',
        hidden: false,
        results: ImmutableMap(),
        filter: 'accounts',
      });

      expect(reducer(state, action)).toEqual(expected);
    });
  });

  describe(SEARCH_EXPAND_SUCCESS, () => {
    it('imports hashtags as maps', () => {
      const state = ImmutableMap({
        value: 'artist',
        submitted: true,
        submittedValue: 'artist',
        hidden: false,
        results: ImmutableMap({
          hashtags: ImmutableList(),
        }),
        filter: 'hashtags',
      });

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

      const expected = ImmutableMap({
        value: 'artist',
        submitted: true,
        submittedValue: 'artist',
        hidden: false,
        results: ImmutableMap({
          hashtags: fromJS([{
            name: 'artist',
            url: 'https://gleasonator.com/tags/artist',
            history: [],
          }]),
          hashtagsHasMore: false,
          hashtagsLoaded: true,
        }),
        filter: 'hashtags',
      });

      expect(reducer(state, action)).toEqual(expected);
    });
  });
});

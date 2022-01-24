import { Map as ImmutableMap } from 'immutable';

import {
  SEARCH_CHANGE,
  SEARCH_CLEAR,
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
});


import { RULES_FETCH_REQUEST, RULES_FETCH_SUCCESS } from 'soapbox/actions/rules';

import reducer from '../rules';

const initialState = {
  items: [],
  isLoading: false,
};

describe('rules reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as any)).toEqual(initialState);
  });

  describe('RULES_FETCH_REQUEST', () => {
    it('sets "needsOnboarding" to "true"', () => {
      const action = { type: RULES_FETCH_REQUEST } as any;
      expect(reducer(initialState, action).isLoading).toEqual(true);
    });
  });

  describe('ONBOARDING_END', () => {
    it('sets "needsOnboarding" to "false"', () => {
      const action = { type: RULES_FETCH_SUCCESS, payload: [{ id: '123' }] } as any;
      const result = reducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.items[0].id).toEqual('123');
    });
  });
});

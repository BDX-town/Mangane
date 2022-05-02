import { ONBOARDING_START, ONBOARDING_END } from 'soapbox/actions/onboarding';

import reducer from '../onboarding';

describe('onboarding reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      needsOnboarding: false,
    });
  });

  describe('ONBOARDING_START', () => {
    it('sets "needsOnboarding" to "true"', () => {
      const initialState = { needsOnboarding: false };
      const action = { type: ONBOARDING_START };
      expect(reducer(initialState, action).needsOnboarding).toEqual(true);
    });
  });

  describe('ONBOARDING_END', () => {
    it('sets "needsOnboarding" to "false"', () => {
      const initialState = { needsOnboarding: true };
      const action = { type: ONBOARDING_END };
      expect(reducer(initialState, action).needsOnboarding).toEqual(false);
    });
  });
});

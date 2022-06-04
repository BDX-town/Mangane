import { SUGGESTIONS_FETCH_SUCCESS, SUGGESTIONS_DISMISS } from 'soapbox/actions/suggestions';

import reducer from '../suggestions';

describe('suggestions reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as any).toJS()).toEqual({
      items: [],
      next: null,
      isLoading: false,
    });
  });

  describe('SUGGESTIONS_DISMISS', () => {
    it('should remove the account', () => {
      let state = reducer(undefined, {} as any);

      state = reducer(state, {
        type: SUGGESTIONS_FETCH_SUCCESS,
        accounts: [
          { id: '123' },
          { id: '456' },
          { id: '789' },
        ],
      });

      const action = { type: SUGGESTIONS_DISMISS, id: '123' };

      const expected = {
        items: [
          { account: '456', source: 'past_interactions' },
          { account: '789', source: 'past_interactions' },
        ],
        isLoading: false,
        next: null,
      };

      expect(reducer(state, action).toJS()).toEqual(expected);
    });
  });
});

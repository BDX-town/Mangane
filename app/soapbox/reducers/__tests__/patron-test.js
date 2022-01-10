import { Map as ImmutableMap, fromJS } from 'immutable';

import { PATRON_ACCOUNT_FETCH_SUCCESS } from '../../actions/patron';
import reducer from '../patron';

describe('patron reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });

  describe('PATRON_ACCOUNT_FETCH_SUCCESS', () => {
    it('should add the account', () => {
      const action = {
        type: PATRON_ACCOUNT_FETCH_SUCCESS,
        account: {
          url: 'https://gleasonator.com/users/alex',
          is_patron: true,
        },
      };
      const state = ImmutableMap();
      expect(reducer(state, action)).toEqual(fromJS({
        accounts: {
          'https://gleasonator.com/users/alex': {
            is_patron: true,
          },
        },
      }));
    });
  });
});

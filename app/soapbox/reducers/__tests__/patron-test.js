import { Record as ImmutableRecord } from 'immutable';

import { PATRON_ACCOUNT_FETCH_SUCCESS } from '../../actions/patron';
import reducer from '../patron';

describe('patron reducer', () => {
  it('should return the initial state', () => {
    const result = reducer(undefined, {});
    expect(ImmutableRecord.isRecord(result)).toBe(true);
    expect(result.instance.url).toBe('');
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

      const result = reducer(undefined, action);

      expect(result.accounts.toJS()).toEqual({
        'https://gleasonator.com/users/alex': {
          is_patron: true,
          url: 'https://gleasonator.com/users/alex',
        },
      });
    });
  });
});

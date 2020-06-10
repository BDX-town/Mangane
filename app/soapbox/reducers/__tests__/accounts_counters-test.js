import reducer from '../accounts_counters';
import { Map as ImmutableMap } from 'immutable';

describe('accounts_counters reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });
});

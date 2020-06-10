import reducer from '../accounts';
import { Map as ImmutableMap } from 'immutable';

describe('accounts reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });
});

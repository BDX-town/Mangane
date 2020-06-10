import reducer from '../patron';
import { Map as ImmutableMap } from 'immutable';

describe('patron reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });
});

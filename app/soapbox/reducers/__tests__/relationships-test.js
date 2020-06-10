import reducer from '../relationships';
import { Map as ImmutableMap } from 'immutable';

describe('relationships reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });
});

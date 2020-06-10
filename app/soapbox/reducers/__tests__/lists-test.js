import reducer from '../lists';
import { Map as ImmutableMap } from 'immutable';

describe('lists reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });
});

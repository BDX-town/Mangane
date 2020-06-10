import reducer from '../height_cache';
import { Map as ImmutableMap } from 'immutable';

describe('height_cache reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });
});

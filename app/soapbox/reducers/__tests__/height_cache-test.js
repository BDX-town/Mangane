import { Map as ImmutableMap } from 'immutable';

import reducer from '../height_cache';
import { HEIGHT_CACHE_CLEAR } from '../height_cache';

describe('height_cache reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });

  it('should handle HEIGHT_CACHE_CLEAR', () => {
    expect(reducer(undefined, { type: HEIGHT_CACHE_CLEAR })).toEqual(ImmutableMap());
  });
});

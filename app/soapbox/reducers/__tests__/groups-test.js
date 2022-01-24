import { Map as ImmutableMap } from 'immutable';

import reducer from '../groups';

describe('groups reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });
});

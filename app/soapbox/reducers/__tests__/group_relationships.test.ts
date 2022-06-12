import { Map as ImmutableMap } from 'immutable';

import reducer from '../group_relationships';

describe('group_relationships reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });
});

import { Map as ImmutableMap, List as ImmutableList } from 'immutable';

import reducer from '../group_lists';

describe('group_lists reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      featured: ImmutableList(),
      member: ImmutableList(),
      admin: ImmutableList(),
    }));
  });
});

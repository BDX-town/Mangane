import { Map as ImmutableMap, OrderedSet as ImmutableOrderedSet } from 'immutable';

import reducer from '../domain_lists';

describe('domain_lists reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      blocks: ImmutableMap({
        items: ImmutableOrderedSet(),
      }),
    }));
  });
});

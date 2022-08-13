import { List as ImmutableList } from 'immutable';

import reducer from '../filters';

describe('filters reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as any)).toEqual(ImmutableList());
  });
});

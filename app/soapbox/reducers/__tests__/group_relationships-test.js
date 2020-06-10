import reducer from '../group_relationships';
import { Map as ImmutableMap } from 'immutable';

describe('group_relationships reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });
});

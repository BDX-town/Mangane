import reducer from '../filters';
import { List as ImmutableList } from 'immutable';

describe('filters reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableList());
  });
});

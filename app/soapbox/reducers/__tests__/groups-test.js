import reducer from '../groups';
import { Map as ImmutableMap } from 'immutable';

describe('groups reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });
});

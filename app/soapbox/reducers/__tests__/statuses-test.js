import reducer from '../statuses';
import { Map as ImmutableMap } from 'immutable';

describe('statuses reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });
});

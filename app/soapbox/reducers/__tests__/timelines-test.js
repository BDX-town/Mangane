import reducer from '../timelines';
import { Map as ImmutableMap } from 'immutable';

describe('timelines reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });
});

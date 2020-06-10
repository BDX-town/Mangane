import reducer from '../meta';
import { Map as ImmutableMap } from 'immutable';

describe('meta reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });
});

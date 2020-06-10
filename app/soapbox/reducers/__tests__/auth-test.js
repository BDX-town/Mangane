import reducer from '../auth';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';

describe('auth reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      app: ImmutableMap(),
      user: ImmutableMap(),
      tokens: ImmutableList(),
    }));
  });
});

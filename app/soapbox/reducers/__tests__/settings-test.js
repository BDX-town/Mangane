import reducer from '../settings';
import { Map as ImmutableMap } from 'immutable';

describe('settings reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      saved: true,
    }));
  });
});

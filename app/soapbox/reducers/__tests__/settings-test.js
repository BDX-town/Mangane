import { Map as ImmutableMap } from 'immutable';

import reducer from '../settings';

describe('settings reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      saved: true,
    }));
  });
});

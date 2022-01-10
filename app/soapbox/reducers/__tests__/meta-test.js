import { Map as ImmutableMap } from 'immutable';

import reducer from '../meta';

describe('meta reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });
});

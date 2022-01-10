import { Map as ImmutableMap } from 'immutable';

import reducer from '../polls';

describe('polls reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });
});

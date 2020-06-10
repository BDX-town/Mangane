import reducer from '../polls';
import { Map as ImmutableMap } from 'immutable';

describe('polls reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });
});

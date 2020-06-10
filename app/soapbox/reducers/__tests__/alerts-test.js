import reducer from '../alerts';
import { List as ImmutableList } from 'immutable';

describe('alerts reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableList());
  });
});

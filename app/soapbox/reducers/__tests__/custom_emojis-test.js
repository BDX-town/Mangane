import reducer from '../custom_emojis';
import { List as ImmutableList } from 'immutable';

describe('custom_emojis reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableList());
  });
});

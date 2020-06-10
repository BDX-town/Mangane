import reducer from '../list_adder';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';

describe('list_adder reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      accountId: null,

      lists: ImmutableMap({
        items: ImmutableList(),
        loaded: false,
        isLoading: false,
      }),
    }));
  });
});

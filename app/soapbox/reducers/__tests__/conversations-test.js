import reducer from '../conversations';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';

describe('conversations reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      items: ImmutableList(),
      isLoading: false,
      hasMore: true,
      mounted: false,
    }));
  });
});

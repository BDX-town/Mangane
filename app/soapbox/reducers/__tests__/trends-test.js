import reducer from '../trends';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';

describe('trends reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      items: ImmutableList(),
      isLoading: false,
    }));
  });
});

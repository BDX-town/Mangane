import reducer from '../suggestions';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';

describe('suggestions reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      items: ImmutableList(),
      isLoading: false,
    }));
  });
});

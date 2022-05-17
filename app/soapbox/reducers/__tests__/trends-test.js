import { Map as ImmutableMap, List as ImmutableList } from 'immutable';

import reducer from '../trends';

describe('trends reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      items: ImmutableList(),
      isLoading: false,
    }));
  });
});

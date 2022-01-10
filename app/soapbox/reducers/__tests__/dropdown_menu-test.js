import { Map as ImmutableMap } from 'immutable';

import reducer from '../dropdown_menu';

describe('dropdown_menu reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      openId: null,
      placement: null,
      keyboard: false,
    }));
  });
});

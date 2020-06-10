import reducer from '../dropdown_menu';
import { Map as ImmutableMap } from 'immutable';

describe('dropdown_menu reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      openId: null,
      placement: null,
      keyboard: false,
    }));
  });
});

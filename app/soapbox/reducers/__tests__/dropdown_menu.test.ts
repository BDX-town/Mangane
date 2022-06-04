import reducer from '../dropdown_menu';

describe('dropdown_menu reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as any).toJS()).toEqual({
      openId: null,
      placement: null,
      keyboard: false,
    });
  });
});

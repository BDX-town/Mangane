import reducer from '../trends';

describe('trends reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as any).toJS()).toEqual({
      items: [],
      isLoading: false,
    });
  });
});

import reducer from '../domain_lists';

describe('domain_lists reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as any).toJS()).toEqual({
      blocks: {
        items: [],
        next: null,
      },
    });
  });
});

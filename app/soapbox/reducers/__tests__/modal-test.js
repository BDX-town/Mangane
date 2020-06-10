import reducer from '../modal';

describe('modal reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      modalType: null,
      modalProps: {},
    });
  });
});

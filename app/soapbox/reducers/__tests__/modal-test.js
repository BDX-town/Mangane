import reducer from '../modal';
import { MODAL_OPEN, MODAL_CLOSE } from 'soapbox/actions/modal';

describe('modal reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      modalType: null,
      modalProps: {},
    });
  });

  it('should handle MODAL_OPEN', () => {
    const state = {
      modalType: null,
      modalProps: {},
    };
    const action = {
      type: MODAL_OPEN,
      modalType: 'type1',
      modalProps: { props1: '1' },
    };
    expect(reducer(state, action)).toMatchObject({
      modalType: 'type1',
      modalProps: { props1: '1' },
    });
  });

  it('should handle MODAL_CLOSE', () => {
    const state = {
      modalType: 'type1',
      modalProps: { props1: '1' },
    };
    const action = {
      type: MODAL_CLOSE,
    };
    expect(reducer(state, action)).toMatchObject({
      modalType: null,
      modalProps: {},
    });
  });

});

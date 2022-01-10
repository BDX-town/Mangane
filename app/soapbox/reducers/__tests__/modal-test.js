import { MODAL_OPEN, MODAL_CLOSE } from 'soapbox/actions/modal';

import reducer from '../modal';

describe('modal reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      modalType: null,
      modalProps: {},
      noPop: false,
    });
  });

  it('should handle MODAL_OPEN', () => {
    const state = {
      modalType: null,
      modalProps: {},
      noPop: false,
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
      noPop: false,
    });
  });

});

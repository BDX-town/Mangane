import { List as ImmutableList } from 'immutable';

import { MODAL_OPEN, MODAL_CLOSE } from 'soapbox/actions/modals';

import reducer from '../modals';

describe('modal reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableList());
  });

  it('should handle MODAL_OPEN', () => {
    const state = ImmutableList();
    const action = {
      type: MODAL_OPEN,
      modalType: 'type1',
      modalProps: { props1: '1' },
    };
    expect(reducer(state, action)).toMatchObject(ImmutableList([{
      modalType: 'type1',
      modalProps: { props1: '1' },
    }]));
  });

  it('should handle MODAL_CLOSE', () => {
    const state = ImmutableList([{
      modalType: 'type1',
      modalProps: { props1: '1' },
    }]);
    const action = {
      type: MODAL_CLOSE,
    };
    expect(reducer(state, action)).toMatchObject(ImmutableList());
  });

  it('should handle MODAL_CLOSE with specified modalType', () => {
    const state = ImmutableList([
      {
        modalType: 'type1',
      },
      {
        modalType: 'type2',
      },
      {
        modalType: 'type1',
      },
    ]);
    const action = {
      type: MODAL_CLOSE,
      modalType: 'type2',
    };
    expect(reducer(state, action)).toMatchObject(ImmutableList([{
      modalType: 'type1',
    }]));
  });

});

import { List as ImmutableList, Record as ImmutableRecord } from 'immutable';

import { MODAL_OPEN, MODAL_CLOSE } from 'soapbox/actions/modals';

import reducer from '../modals';

describe('modal reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as any)).toEqual(ImmutableList());
  });

  it('should handle MODAL_OPEN', () => {
    const state = ImmutableList<any>();
    const action = {
      type: MODAL_OPEN,
      modalType: 'type1',
      modalProps: { props1: '1' },
    };
    expect(reducer(state, action).toJS()).toMatchObject([{
      modalType: 'type1',
      modalProps: { props1: '1' },
    }]);
  });

  it('should handle MODAL_CLOSE', () => {
    const state = ImmutableList([
      ImmutableRecord({
        modalType: 'type1',
        modalProps: { props1: '1' },
      })(),
    ]);
    const action = {
      type: MODAL_CLOSE,
    };
    expect(reducer(state, action).toJS()).toMatchObject([]);
  });

  it('should handle MODAL_CLOSE with specified modalType', () => {
    const state = ImmutableList([
      ImmutableRecord({
        modalType: 'type1',
        modalProps: null,
      })(),
      ImmutableRecord({
        modalType: 'type2',
        modalProps: null,
      })(),
      ImmutableRecord({
        modalType: 'type1',
        modalProps: null,
      })(),
    ]);
    const action = {
      type: MODAL_CLOSE,
      modalType: 'type2',
    };
    expect(reducer(state, action).toJS()).toEqual([
      {
        modalType: 'type1',
        modalProps: null,
      },
    ]);
  });

});

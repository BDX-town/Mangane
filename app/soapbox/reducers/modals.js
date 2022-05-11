import { List as ImmutableList } from 'immutable';

import { MODAL_OPEN, MODAL_CLOSE } from '../actions/modals';

const initialState = ImmutableList();

export default function modal(state = initialState, action) {
  switch (action.type) {
    case MODAL_OPEN:
      return state.push({ modalType: action.modalType, modalProps: action.modalProps });
    case MODAL_CLOSE:
      if (state.size === 0) {
        return state;
      }
      if (action.modalType === undefined) {
        return state.pop();
      }
      if (state.some(({ modalType }) => action.modalType === modalType)) {
        return state.slice(0, state.findLastIndex(({ modalType }) => action.modalType === modalType));
      }
      return state;
    default:
      return state;
  }
}

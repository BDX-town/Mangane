import { List as ImmutableList, Record as ImmutableRecord } from 'immutable';

import { MODAL_OPEN, MODAL_CLOSE } from '../actions/modals';

import type { AnyAction } from 'redux';

const ModalRecord = ImmutableRecord({
  modalType: '',
  modalProps: null as Record<string, any> | null,
});

type Modal = ReturnType<typeof ModalRecord>;
type State = ImmutableList<Modal>;

export default function modal(state: State = ImmutableList<Modal>(), action: AnyAction) {
  switch (action.type) {
    case MODAL_OPEN:
      return state.push(ModalRecord({ modalType: action.modalType, modalProps: action.modalProps }));
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

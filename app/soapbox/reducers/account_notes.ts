import { Record as ImmutableRecord } from 'immutable';

import {
  ACCOUNT_NOTE_INIT_MODAL,
  ACCOUNT_NOTE_CHANGE_COMMENT,
  ACCOUNT_NOTE_SUBMIT_REQUEST,
  ACCOUNT_NOTE_SUBMIT_FAIL,
  ACCOUNT_NOTE_SUBMIT_SUCCESS,
} from '../actions/account-notes';

import type { AnyAction } from 'redux';

export const EditRecord = ImmutableRecord({
  isSubmitting: false,
  account: null as string | null,
  comment: '',
});

export const ReducerRecord = ImmutableRecord({
  edit: EditRecord(),
});

type State = ReturnType<typeof ReducerRecord>;

export default function account_notes(state: State = ReducerRecord(), action: AnyAction) {
  switch (action.type) {
    case ACCOUNT_NOTE_INIT_MODAL:
      return state.withMutations((state) => {
        state.setIn(['edit', 'isSubmitting'], false);
        state.setIn(['edit', 'account'], action.account.get('id'));
        state.setIn(['edit', 'comment'], action.comment);
      });
    case ACCOUNT_NOTE_CHANGE_COMMENT:
      return state.setIn(['edit', 'comment'], action.comment);
    case ACCOUNT_NOTE_SUBMIT_REQUEST:
      return state.setIn(['edit', 'isSubmitting'], true);
    case ACCOUNT_NOTE_SUBMIT_FAIL:
    case ACCOUNT_NOTE_SUBMIT_SUCCESS:
      return state.setIn(['edit', 'isSubmitting'], false);
    default:
      return state;
  }
}

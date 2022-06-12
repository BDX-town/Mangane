import { Record as ImmutableRecord } from 'immutable';

import {
  MUTES_INIT_MODAL,
  MUTES_TOGGLE_HIDE_NOTIFICATIONS,
} from '../actions/mutes';

import type { AnyAction } from 'redux';

const NewMuteRecord = ImmutableRecord({
  isSubmitting: false,
  accountId: null,
  notifications: true,
});

const ReducerRecord = ImmutableRecord({
  new: NewMuteRecord(),
});

type State = ReturnType<typeof ReducerRecord>;

export default function mutes(state: State = ReducerRecord(), action: AnyAction) {
  switch (action.type) {
    case MUTES_INIT_MODAL:
      return state.withMutations((state) => {
        state.setIn(['new', 'isSubmitting'], false);
        state.setIn(['new', 'accountId'], action.account.id);
        state.setIn(['new', 'notifications'], true);
      });
    case MUTES_TOGGLE_HIDE_NOTIFICATIONS:
      return state.updateIn(['new', 'notifications'], (old) => !old);
    default:
      return state;
  }
}

import { Map as ImmutableMap } from 'immutable';

import {
  MUTES_INIT_MODAL,
  MUTES_TOGGLE_HIDE_NOTIFICATIONS,
} from '../actions/mutes';

const initialState = ImmutableMap({
  new: ImmutableMap({
    isSubmitting: false,
    account: null,
    notifications: true,
  }),
});

export default function mutes(state = initialState, action) {
  switch (action.type) {
  case MUTES_INIT_MODAL:
    return state.withMutations((state) => {
      state.setIn(['new', 'isSubmitting'], false);
      state.setIn(['new', 'account'], action.account);
      state.setIn(['new', 'notifications'], true);
    });
  case MUTES_TOGGLE_HIDE_NOTIFICATIONS:
    return state.updateIn(['new', 'notifications'], (old) => !old);
  default:
    return state;
  }
}

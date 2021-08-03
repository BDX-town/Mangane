'use strict';

import { ME_FETCH_SUCCESS, ME_PATCH_SUCCESS } from 'soapbox/actions/me';
import { Map as ImmutableMap, fromJS } from 'immutable';

const initialState = ImmutableMap();

const importAccount = (state, account) => {
  return state.withMutations(state => {
    if (account.has('pleroma')) {
      const pleroPrefs = account.get('pleroma').delete('settings_store');
      state.mergeIn(['pleroma'], pleroPrefs);
    }
  });
};

export default function meta(state = initialState, action) {
  switch(action.type) {
  case ME_FETCH_SUCCESS:
  case ME_PATCH_SUCCESS:
    return importAccount(state, fromJS(action.me));
  default:
    return state;
  }
}

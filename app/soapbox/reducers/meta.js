'use strict';

import { ME_FETCH_SUCCESS, ME_PATCH_SUCCESS } from 'soapbox/actions/me';
import { INSTANCE_FETCH_FAIL } from 'soapbox/actions/instance';
import { Map as ImmutableMap, fromJS } from 'immutable';

const initialState = ImmutableMap();

const importAccount = (state, account) => {
  return state.withMutations(state => {
    const accountId = account.get('id');

    if (account.has('pleroma')) {
      const pleroPrefs = account.get('pleroma').delete('settings_store');
      state.setIn(['pleroma', accountId], pleroPrefs);
    }

    if (account.has('source')) {
      state.setIn(['source', accountId], account.get('source'));
    }
  });
};

export default function meta(state = initialState, action) {
  switch(action.type) {
  case ME_FETCH_SUCCESS:
  case ME_PATCH_SUCCESS:
    return importAccount(state, fromJS(action.me));
  case INSTANCE_FETCH_FAIL:
    return state.set('instance_fetch_failed', true);
  default:
    return state;
  }
}

/**
 * Accounts Meta: private user data only the owner should see.
 * @module soapbox/reducers/accounts_meta
 */

import { ME_FETCH_SUCCESS, ME_PATCH_SUCCESS } from 'soapbox/actions/me';
import { Map as ImmutableMap, fromJS } from 'immutable';

const initialState = ImmutableMap();

const importAccount = (state, account) => {
  const accountId = account.get('id');

  return state.set(accountId, ImmutableMap({
    pleroma: account.get('pleroma', ImmutableMap()).delete('settings_store'),
    source: account.get('source', ImmutableMap()),
  }));
};

export default function accounts_meta(state = initialState, action) {
  switch(action.type) {
  case ME_FETCH_SUCCESS:
  case ME_PATCH_SUCCESS:
    return importAccount(state, fromJS(action.me));
  default:
    return state;
  }
}

/**
 * Accounts Meta: private user data only the owner should see.
 * @module soapbox/reducers/accounts_meta
 */

import { Map as ImmutableMap, Record as ImmutableRecord, fromJS } from 'immutable';

import { VERIFY_CREDENTIALS_SUCCESS, AUTH_ACCOUNT_REMEMBER_SUCCESS } from 'soapbox/actions/auth';
import { ME_FETCH_SUCCESS, ME_PATCH_SUCCESS } from 'soapbox/actions/me';

import type { AnyAction } from 'redux';

const MetaRecord = ImmutableRecord({
  pleroma: ImmutableMap<string, any>(),
  source: ImmutableMap<string, any>(),
});

type Meta = ReturnType<typeof MetaRecord>;
type State = ImmutableMap<string, Meta>;

const importAccount = (state: State, account: ImmutableMap<string, any>) => {
  const accountId = account.get('id');

  return state.set(accountId, MetaRecord({
    pleroma: account.get('pleroma', ImmutableMap()).delete('settings_store'),
    source: account.get('source', ImmutableMap()),
  }));
};

export default function accounts_meta(state: State = ImmutableMap<string, Meta>(), action: AnyAction) {
  switch (action.type) {
    case ME_FETCH_SUCCESS:
    case ME_PATCH_SUCCESS:
      return importAccount(state, ImmutableMap(fromJS(action.me)));
    case VERIFY_CREDENTIALS_SUCCESS:
    case AUTH_ACCOUNT_REMEMBER_SUCCESS:
      return importAccount(state, ImmutableMap(fromJS(action.account)));
    default:
      return state;
  }
}

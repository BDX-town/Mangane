'use strict';

import { ME_FETCH_SUCCESS, ME_PATCH_SUCCESS } from 'soapbox/actions/me';
import { VERIFY_CREDENTIALS_SUCCESS } from 'soapbox/actions/auth';
import { Map as ImmutableMap, OrderedSet as ImmutableOrderedSet, fromJS } from 'immutable';

const initialState = ImmutableMap();

export default function meta(state = initialState, action) {
  switch(action.type) {
  case ME_FETCH_SUCCESS:
  case ME_PATCH_SUCCESS:
    const me = fromJS(action.me);
    return state.withMutations(state => {
      state.set('me', me.get('id'));
      state.update('users', ImmutableOrderedSet(), v => v.add(me.get('id')));
      if (me.has('pleroma')) {
        const pleroPrefs = me.get('pleroma').delete('settings_store');
        state.mergeIn(['pleroma'], pleroPrefs);
      }
    });
  case VERIFY_CREDENTIALS_SUCCESS:
    return state.update('users', ImmutableOrderedSet(), v => v.add(action.account.id));
  default:
    return state;
  }
};

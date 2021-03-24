'use strict';

import { ME_FETCH_SUCCESS, ME_PATCH_SUCCESS } from 'soapbox/actions/me';
import { Map as ImmutableMap, fromJS } from 'immutable';

const initialState = ImmutableMap();

export default function meta(state = initialState, action) {
  switch(action.type) {
  case ME_FETCH_SUCCESS:
  case ME_PATCH_SUCCESS:
    const me = fromJS(action.me);
    return state.withMutations(state => {
      if (me.has('pleroma')) {
        const pleroPrefs = me.get('pleroma').delete('settings_store');
        state.mergeIn(['pleroma'], pleroPrefs);
      }
    });
  default:
    return state;
  }
};

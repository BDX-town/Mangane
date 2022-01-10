'use strict';

import { Map as ImmutableMap } from 'immutable';

import { INSTANCE_FETCH_FAIL } from 'soapbox/actions/instance';

const initialState = ImmutableMap();

export default function meta(state = initialState, action) {
  switch(action.type) {
  case INSTANCE_FETCH_FAIL:
    return state.set('instance_fetch_failed', true);
  default:
    return state;
  }
}

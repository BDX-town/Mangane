'use strict';

import { INSTANCE_FETCH_FAIL } from 'soapbox/actions/instance';
import { Map as ImmutableMap } from 'immutable';

const initialState = ImmutableMap();

export default function meta(state = initialState, action) {
  switch(action.type) {
  case INSTANCE_FETCH_FAIL:
    return state.set('instance_fetch_failed', true);
  default:
    return state;
  }
}

'use strict';

import { Record as ImmutableRecord } from 'immutable';

import { INSTANCE_FETCH_FAIL } from 'soapbox/actions/instance';

import type { AnyAction } from 'redux';

const ReducerRecord = ImmutableRecord({
  instance_fetch_failed: false,
});

export default function meta(state = ReducerRecord(), action: AnyAction) {
  switch(action.type) {
  case INSTANCE_FETCH_FAIL:
    return state.set('instance_fetch_failed', true);
  default:
    return state;
  }
}

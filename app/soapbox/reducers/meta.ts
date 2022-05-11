'use strict';

import { Record as ImmutableRecord } from 'immutable';

import { fetchInstance } from 'soapbox/actions/instance';

import type { AnyAction } from 'redux';

const ReducerRecord = ImmutableRecord({
  instance_fetch_failed: false,
});

export default function meta(state = ReducerRecord(), action: AnyAction) {
  switch (action.type) {
    case fetchInstance.rejected.type:
      if (action.payload.response?.status === 404) {
        return state.set('instance_fetch_failed', true);
      }
      return state;
    default:
      return state;
  }
}

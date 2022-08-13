'use strict';

import { Record as ImmutableRecord } from 'immutable';

import { fetchInstance } from 'soapbox/actions/instance';
import { SW_UPDATING } from 'soapbox/actions/sw';

import type { AnyAction } from 'redux';

const ReducerRecord = ImmutableRecord({
  /** Whether /api/v1/instance 404'd (and we should display the external auth form). */
  instance_fetch_failed: false,
  /** Whether the ServiceWorker is currently updating (and we should display a loading screen). */
  swUpdating: false,
});

export default function meta(state = ReducerRecord(), action: AnyAction) {
  switch (action.type) {
    case fetchInstance.rejected.type:
      if (action.payload.response?.status === 404) {
        return state.set('instance_fetch_failed', true);
      }
      return state;
    case SW_UPDATING:
      return state.set('swUpdating', action.isUpdating);
    default:
      return state;
  }
}

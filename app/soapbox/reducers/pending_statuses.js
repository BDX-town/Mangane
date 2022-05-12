import { Map as ImmutableMap, fromJS } from 'immutable';

import {
  STATUS_CREATE_REQUEST,
  STATUS_CREATE_SUCCESS,
} from 'soapbox/actions/statuses';

const importStatus = (state, params, idempotencyKey) => {
  return state.set(idempotencyKey, params);
};

const deleteStatus = (state, idempotencyKey) => state.delete(idempotencyKey);

const initialState = ImmutableMap();

export default function pending_statuses(state = initialState, action) {
  switch (action.type) {
    case STATUS_CREATE_REQUEST:
      return importStatus(state, fromJS(action.params), action.idempotencyKey);
    case STATUS_CREATE_SUCCESS:
      return deleteStatus(state, action.idempotencyKey);
    default:
      return state;
  }
}

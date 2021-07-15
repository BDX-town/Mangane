import { STATUS_CREATE_SUCCESS } from 'soapbox/actions/statuses';
import {
  SCHEDULED_STATUSES_FETCH_SUCCESS,
  SCHEDULED_STATUS_CANCEL_REQUEST,
  SCHEDULED_STATUS_CANCEL_SUCCESS,
} from 'soapbox/actions/scheduled_statuses';
import { Map as ImmutableMap, fromJS } from 'immutable';

const importStatus = (state, status) => {
  if (status.scheduled_at) {
    return state.set(status.id, fromJS(status));
  } else {
    return state;
  }
};

const importStatuses = (state, statuses) =>
  state.withMutations(mutable => statuses.forEach(status => importStatus(mutable, status)));

const deleteStatus = (state, id) => state.delete(id);

const initialState = ImmutableMap();

export default function statuses(state = initialState, action) {
  switch(action.type) {
  case STATUS_CREATE_SUCCESS:
    return importStatus(state, action.status);
  case SCHEDULED_STATUSES_FETCH_SUCCESS:
    return importStatuses(state, action.statuses);
  case SCHEDULED_STATUS_CANCEL_REQUEST:
  case SCHEDULED_STATUS_CANCEL_SUCCESS:
    return deleteStatus(state, action.id);
  default:
    return state;
  }
};

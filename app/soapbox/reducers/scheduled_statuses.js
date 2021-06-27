import { STATUS_CREATE_SUCCESS } from 'soapbox/actions/statuses';
import { STATUS_IMPORT, STATUSES_IMPORT } from '../actions/importer';
import { Map as ImmutableMap, fromJS } from 'immutable';

const importStatus = (state, status) => {
  if (!status.scheduled_at) return state;
  return state.set(status.id, fromJS(status));
};

const importStatuses = (state, statuses) =>
  state.withMutations(mutable => statuses.forEach(status => importStatus(mutable, status)));

const initialState = ImmutableMap();

export default function statuses(state = initialState, action) {
  switch(action.type) {
  case STATUS_IMPORT:
  case STATUS_CREATE_SUCCESS:
    return importStatus(state, action.status);
  case STATUSES_IMPORT:
    return importStatuses(state, action.statuses);
  default:
    return state;
  }
};

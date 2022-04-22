import { Map as ImmutableMap } from 'immutable';

import { POLLS_IMPORT } from 'soapbox/actions/importer';
import { normalizeStatus } from 'soapbox/normalizers/status';

// HOTFIX: Convert the poll into a fake status to normalize it...
// TODO: get rid of POLLS_IMPORT and use STATUS_IMPORT here.
const normalizePoll = poll => {
  const status = { poll };
  return normalizeStatus(status).poll;
};

const importPolls = (state, polls) => {
  return state.withMutations(map => {
    return polls.forEach(poll => map.set(poll.id, normalizePoll(poll)));
  });
};

const initialState = ImmutableMap();

export default function polls(state = initialState, action) {
  switch(action.type) {
  case POLLS_IMPORT:
    return importPolls(state, action.polls);
  default:
    return state;
  }
}

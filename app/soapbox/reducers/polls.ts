import { Map as ImmutableMap } from 'immutable';

import { POLLS_IMPORT } from 'soapbox/actions/importer';
import { normalizeStatus } from 'soapbox/normalizers/status';

import type { AnyAction } from 'redux';
import type { Poll, APIEntity, EmbeddedEntity } from 'soapbox/types/entities';

type State = ImmutableMap<string, Poll>;

// HOTFIX: Convert the poll into a fake status to normalize it...
// TODO: get rid of POLLS_IMPORT and use STATUS_IMPORT here.
const normalizePoll = (poll: any): EmbeddedEntity<Poll> => {
  const status = { poll };
  return normalizeStatus(status).poll;
};

const importPolls = (state: State, polls: Array<APIEntity>) => {
  return state.withMutations(map => {
    return polls.forEach(poll => {
      const normalPoll = normalizePoll(poll);

      if (normalPoll && typeof normalPoll === 'object') {
        map.set(normalPoll.id, normalPoll);
      }
    });
  });
};

const initialState: State = ImmutableMap();

export default function polls(state: State = initialState, action: AnyAction): State {
  switch (action.type) {
    case POLLS_IMPORT:
      return importPolls(state, action.polls);
    default:
      return state;
  }
}

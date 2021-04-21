import {
  ACCOUNT_BLOCK_SUCCESS,
  ACCOUNT_MUTE_SUCCESS,
} from '../actions/accounts';
import { CONTEXT_FETCH_SUCCESS } from '../actions/statuses';
import { TIMELINE_DELETE } from '../actions/timelines';
import { STATUS_IMPORT, STATUSES_IMPORT } from 'soapbox/actions/importer';
import { Map as ImmutableMap, OrderedSet as ImmutableOrderedSet } from 'immutable';

const initialState = ImmutableMap({
  inReplyTos: ImmutableMap(),
  replies: ImmutableMap(),
});

const importStatus = (state, { id, in_reply_to_id }) => {
  if (!in_reply_to_id) return state;

  return state.withMutation(state => {
    state.setIn(['inReplyTos', id, in_reply_to_id]);

    state.updateIn(['replies', in_reply_to_id], ImmutableOrderedSet(), ids => {
      return ids.add(id).sort();
    });
  });
};

const importStatuses = (state, statuses) => {
  return state.withMutations(state => {
    statuses.forEach(status => importStatus(state, status));
  });
};

const normalizeContext = (immutableState, id, ancestors, descendants) => immutableState.withMutations(state => {
  state.update('inReplyTos', immutableAncestors => immutableAncestors.withMutations(inReplyTos => {
    state.update('replies', immutableDescendants => immutableDescendants.withMutations(replies => {
      ancestors.forEach(status => importStatus(state, status));

      descendants.forEach(status => {
        if (status.in_reply_to_id) {
          importStatus(state, status);
        } else {
          importStatus(state, { id: `tombstone-${status.id}`, in_reply_to_id: id });
          importStatus(state, { id: status.id, in_reply_to_id: `tombstone-${status.id}` });
        }
      });

      if (ancestors.length > 0 && !inReplyTos.get(id)) {
        const { id: lastId } = ancestors[ancestors.length - 1];
        replies.update(`tombstone-${id}`, ImmutableOrderedSet(), siblings => siblings.add(id).sort());
        replies.update(lastId, ImmutableOrderedSet(), siblings => siblings.add(`tombstone-${id}`).sort());
        inReplyTos.set(id, `tombstone-${id}`);
        inReplyTos.set(`tombstone-${id}`, lastId);
      }
    }));
  }));
});

const deleteFromContexts = (immutableState, ids) => immutableState.withMutations(state => {
  state.update('inReplyTos', immutableAncestors => immutableAncestors.withMutations(inReplyTos => {
    state.update('replies', immutableDescendants => immutableDescendants.withMutations(replies => {
      ids.forEach(id => {
        const inReplyToIdOfId = inReplyTos.get(id);
        const repliesOfId = replies.get(id);
        const siblings = replies.get(inReplyToIdOfId);

        if (siblings) {
          replies.set(inReplyToIdOfId, siblings.filterNot(sibling => sibling === id));
        }


        if (repliesOfId) {
          repliesOfId.forEach(reply => inReplyTos.delete(reply));
        }

        inReplyTos.delete(id);
        replies.delete(id);
      });
    }));
  }));
});

const filterContexts = (state, relationship, statuses) => {
  const ownedStatusIds = statuses
    .filter(status => status.get('account') === relationship.id)
    .map(status => status.get('id'));

  return deleteFromContexts(state, ownedStatusIds);
};

export default function replies(state = initialState, action) {
  switch(action.type) {
  case ACCOUNT_BLOCK_SUCCESS:
  case ACCOUNT_MUTE_SUCCESS:
    return filterContexts(state, action.relationship, action.statuses);
  case CONTEXT_FETCH_SUCCESS:
    return normalizeContext(state, action.id, action.ancestors, action.descendants);
  case TIMELINE_DELETE:
    return deleteFromContexts(state, [action.id]);
  case STATUS_IMPORT:
    return importStatus(state, action.status);
  case STATUSES_IMPORT:
    return importStatuses(state, action.statuses);
  default:
    return state;
  }
};

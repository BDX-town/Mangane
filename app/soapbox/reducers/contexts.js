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

  return state.withMutations(state => {
    state.setIn(['inReplyTos', id], in_reply_to_id);

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

const insertTombstone = (state, ancestorId, descendantId) => {
  const tombstoneId = `${descendantId}-tombstone`;
  return state.withMutations(state => {
    importStatus(state, { id: tombstoneId, in_reply_to_id: ancestorId });
    importStatus(state, { id: descendantId, in_reply_to_id: tombstoneId });
  });
};

const importBranch = (state, statuses, rootId) => {
  return state.withMutations(state => {
    statuses.forEach((status, i) => {
      const lastId = rootId && i === 0 ? rootId : (statuses[i - 1] || {}).id;

      if (status.in_reply_to_id) {
        importStatus(state, status);
      } else if (lastId) {
        insertTombstone(state, lastId, status.id);
      }
    });
  });
};

const normalizeContext = (state, id, ancestors, descendants) => state.withMutations(state => {
  importBranch(state, ancestors);
  importBranch(state, descendants, id);

  if (ancestors.length > 0 && !state.getIn(['inReplyTos', id])) {
    insertTombstone(state, ancestors[ancestors.length - 1].id, id);
  }
});

const deleteStatus = (state, id) => {
  return state.withMutations(state => {
    const parentId = state.getIn(['inReplyTos', id]);
    const replies = state.getIn(['replies', id], ImmutableOrderedSet());

    // Delete from its parent's tree
    state.updateIn(['replies', parentId], ImmutableOrderedSet(), ids => ids.delete(id));

    // Dereference children
    replies.forEach(reply => state.deleteIn(['inReplyTos', reply]));

    state.deleteIn(['inReplyTos', id]);
    state.deleteIn(['replies', id]);
  });
};

const deleteStatuses = (state, ids) => {
  return state.withMutations(state => {
    ids.forEach(id => deleteStatus(state, id));
  });
};

const filterContexts = (state, relationship, statuses) => {
  const ownedStatusIds = statuses
    .filter(status => status.get('account') === relationship.id)
    .map(status => status.get('id'));

  return deleteStatuses(state, ownedStatusIds);
};

export default function replies(state = initialState, action) {
  switch(action.type) {
  case ACCOUNT_BLOCK_SUCCESS:
  case ACCOUNT_MUTE_SUCCESS:
    return filterContexts(state, action.relationship, action.statuses);
  case CONTEXT_FETCH_SUCCESS:
    return normalizeContext(state, action.id, action.ancestors, action.descendants);
  case TIMELINE_DELETE:
    return deleteStatuses(state, [action.id]);
  case STATUS_IMPORT:
    return importStatus(state, action.status);
  case STATUSES_IMPORT:
    return importStatuses(state, action.statuses);
  default:
    return state;
  }
}

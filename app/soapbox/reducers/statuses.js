import { Map as ImmutableMap, fromJS } from 'immutable';

import { simulateEmojiReact, simulateUnEmojiReact } from 'soapbox/utils/emoji_reacts';

import {
  EMOJI_REACT_REQUEST,
  UNEMOJI_REACT_REQUEST,
} from '../actions/emoji_reacts';
import { STATUS_IMPORT, STATUSES_IMPORT } from '../actions/importer';
import {
  REBLOG_REQUEST,
  REBLOG_FAIL,
  UNREBLOG_REQUEST,
  UNREBLOG_FAIL,
  FAVOURITE_REQUEST,
  UNFAVOURITE_REQUEST,
  FAVOURITE_FAIL,
} from '../actions/interactions';
import {
  STATUS_CREATE_REQUEST,
  STATUS_CREATE_FAIL,
  STATUS_MUTE_SUCCESS,
  STATUS_UNMUTE_SUCCESS,
  STATUS_REVEAL,
  STATUS_HIDE,
} from '../actions/statuses';
import { TIMELINE_DELETE } from '../actions/timelines';

// Fix order of mentions
const fixMentions = status => {
  const mentions = status.get('mentions');
  const inReplyToAccountId = status.get('in_reply_to_account_id');

  // Sort the replied-to mention to the top
  const sorted = mentions.sort((a, b) => {
    if (a.get('id') === inReplyToAccountId) {
      return -1;
    } else {
      return 0;
    }
  });

  return status.set('mentions', sorted);
};

const fixStatus = status => {
  return status.withMutations(status => {
    fixMentions(status);
  });
};

const importStatus = (state, status) => state.set(status.id, fixStatus(fromJS(status)));

const importStatuses = (state, statuses) =>
  state.withMutations(mutable => statuses.forEach(status => importStatus(mutable, status)));

const deleteStatus = (state, id, references) => {
  references.forEach(ref => {
    state = deleteStatus(state, ref[0], []);
  });

  return state.delete(id);
};

const importPendingStatus = (state, { in_reply_to_id }) => {
  if (in_reply_to_id) {
    return state.updateIn([in_reply_to_id, 'replies_count'], 0, count => count + 1);
  } else {
    return state;
  }
};

const deletePendingStatus = (state, { in_reply_to_id }) => {
  if (in_reply_to_id) {
    return state.updateIn([in_reply_to_id, 'replies_count'], 0, count => Math.max(0, count - 1));
  } else {
    return state;
  }
};

const initialState = ImmutableMap();

export default function statuses(state = initialState, action) {
  switch(action.type) {
  case STATUS_IMPORT:
    return importStatus(state, action.status);
  case STATUSES_IMPORT:
    return importStatuses(state, action.statuses);
  case STATUS_CREATE_REQUEST:
    return importPendingStatus(state, action.params);
  case STATUS_CREATE_FAIL:
    return deletePendingStatus(state, action.params);
  case FAVOURITE_REQUEST:
    return state.update(action.status.get('id'), status =>
      status
        .set('favourited', true)
        .update('favourites_count', count => count + 1));
  case UNFAVOURITE_REQUEST:
    return state.update(action.status.get('id'), status =>
      status
        .set('favourited', false)
        .update('favourites_count', count => Math.max(0, count - 1)));
  case EMOJI_REACT_REQUEST:
    return state
      .updateIn(
        [action.status.get('id'), 'pleroma', 'emoji_reactions'],
        emojiReacts => simulateEmojiReact(emojiReacts, action.emoji),
      );
  case UNEMOJI_REACT_REQUEST:
    return state
      .updateIn(
        [action.status.get('id'), 'pleroma', 'emoji_reactions'],
        emojiReacts => simulateUnEmojiReact(emojiReacts, action.emoji),
      );
  case FAVOURITE_FAIL:
    return state.get(action.status.get('id')) === undefined ? state : state.setIn([action.status.get('id'), 'favourited'], false);
  case REBLOG_REQUEST:
    return state.setIn([action.status.get('id'), 'reblogged'], true);
  case REBLOG_FAIL:
    return state.get(action.status.get('id')) === undefined ? state : state.setIn([action.status.get('id'), 'reblogged'], false);
  case UNREBLOG_REQUEST:
    return state.setIn([action.status.get('id'), 'reblogged'], false);
  case UNREBLOG_FAIL:
    return state.get(action.status.get('id')) === undefined ? state : state.setIn([action.status.get('id'), 'reblogged'], true);
  case STATUS_MUTE_SUCCESS:
    return state.setIn([action.id, 'muted'], true);
  case STATUS_UNMUTE_SUCCESS:
    return state.setIn([action.id, 'muted'], false);
  case STATUS_REVEAL:
    return state.withMutations(map => {
      action.ids.forEach(id => {
        if (!(state.get(id) === undefined)) {
          map.setIn([id, 'hidden'], false);
        }
      });
    });
  case STATUS_HIDE:
    return state.withMutations(map => {
      action.ids.forEach(id => {
        if (!(state.get(id) === undefined)) {
          map.setIn([id, 'hidden'], true);
        }
      });
    });
  case TIMELINE_DELETE:
    return deleteStatus(state, action.id, action.references);
  default:
    return state;
  }
}

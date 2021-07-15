import {
  REBLOG_REQUEST,
  REBLOG_SUCCESS,
  REBLOG_FAIL,
  UNREBLOG_SUCCESS,
  FAVOURITE_REQUEST,
  FAVOURITE_SUCCESS,
  FAVOURITE_FAIL,
  UNFAVOURITE_REQUEST,
  UNFAVOURITE_SUCCESS,
  PIN_SUCCESS,
  UNPIN_SUCCESS,
} from 'soapbox/actions/interactions';
import {
  STATUS_FETCH_SUCCESS,
  CONTEXT_FETCH_SUCCESS,
  STATUS_MUTE_SUCCESS,
  STATUS_UNMUTE_SUCCESS,
  STATUS_REVEAL,
  STATUS_HIDE,
} from 'soapbox/actions/statuses';
import {
  EMOJI_REACT_REQUEST,
  UNEMOJI_REACT_REQUEST,
} from 'soapbox/actions/emoji_reacts';
import {
  TIMELINE_REFRESH_SUCCESS,
  TIMELINE_DELETE,
  TIMELINE_EXPAND_SUCCESS,
} from 'soapbox/actions/timelines';
import {
  NOTIFICATIONS_UPDATE,
  NOTIFICATIONS_REFRESH_SUCCESS,
  NOTIFICATIONS_EXPAND_SUCCESS,
} from 'soapbox/actions/notifications';
import {
  STREAMING_TIMELINE_UPDATE,
} from 'soapbox/actions/streaming';
import {
  FAVOURITED_STATUSES_FETCH_SUCCESS,
  FAVOURITED_STATUSES_EXPAND_SUCCESS,
} from 'soapbox/actions/favourites';
import {
  PINNED_STATUSES_FETCH_SUCCESS,
} from 'soapbox/actions/pin_statuses';
import { SEARCH_FETCH_SUCCESS } from '../actions/search';
import { Map as ImmutableMap, fromJS } from 'immutable';
import { simulateEmojiReact, simulateUnEmojiReact } from 'soapbox/utils/emoji_reacts';
import escapeTextContentForBrowser from 'escape-html';
import emojify from 'soapbox/features/emoji/emoji';

const domParser = new DOMParser();

const makeEmojiMap = record => record.emojis.reduce((obj, emoji) => {
  obj[`:${emoji.shortcode}:`] = emoji;
  return obj;
}, {});

export function normalizeStatus(status, normalOldStatus, expandSpoilers) {
  const normalStatus   = { ...status };

  normalStatus.account = status.account.id;

  if (status.reblog && status.reblog.id) {
    normalStatus.reblog = status.reblog.id;
  }

  if (status.poll && status.poll.id) {
    normalStatus.poll = status.poll.id;
  }

  // Only calculate these values when status first encountered
  // Otherwise keep the ones already in the reducer
  if (normalOldStatus) {
    normalStatus.search_index = normalOldStatus.get('search_index');
    normalStatus.contentHtml = normalOldStatus.get('contentHtml');
    normalStatus.spoilerHtml = normalOldStatus.get('spoilerHtml');
    normalStatus.hidden = normalOldStatus.get('hidden');
  } else {
    const spoilerText   = normalStatus.spoiler_text || '';
    const searchContent = [spoilerText, status.content].join('\n\n').replace(/<br\s*\/?>/g, '\n').replace(/<\/p><p>/g, '\n\n');
    const emojiMap      = makeEmojiMap(normalStatus);

    normalStatus.search_index = domParser.parseFromString(searchContent, 'text/html').documentElement.textContent;
    normalStatus.contentHtml  = emojify(normalStatus.content, emojiMap);
    normalStatus.spoilerHtml  = emojify(escapeTextContentForBrowser(spoilerText), emojiMap);
    normalStatus.hidden       = expandSpoilers ? false : spoilerText.length > 0 || normalStatus.sensitive;
  }

  return fromJS(normalStatus);
}

const importStatus = (state, status) => {
  try {
    return state.set(status.id, normalizeStatus(status));
  } catch(e) {
    // Skip broken statuses
    console.warn(`Skipped broken status returned from the API: ${e}`);
    console.warn(status);
    return state;
  }
};

const importStatuses = (state, statuses) => {
  return state.withMutations(state => {
    statuses.forEach(status => importStatus(state, status));
  });
};

const deleteStatus = (state, id, references) => {
  return state.withMutations(state => {
    references.forEach(ref => deleteStatus(state, ref[0], []));
  });
};

const initialState = ImmutableMap();

export default function statuses(state = initialState, action) {
  switch(action.type) {
  case STREAMING_TIMELINE_UPDATE:
  case STATUS_FETCH_SUCCESS:
  case NOTIFICATIONS_UPDATE:
  case REBLOG_SUCCESS:
  case UNREBLOG_SUCCESS:
  case FAVOURITE_SUCCESS:
  case UNFAVOURITE_SUCCESS:
  case PIN_SUCCESS:
  case UNPIN_SUCCESS:
    return importStatus(state, action.status);
  case TIMELINE_REFRESH_SUCCESS:
  case TIMELINE_EXPAND_SUCCESS:
  case CONTEXT_FETCH_SUCCESS:
  case NOTIFICATIONS_REFRESH_SUCCESS:
  case NOTIFICATIONS_EXPAND_SUCCESS:
  case FAVOURITED_STATUSES_FETCH_SUCCESS:
  case FAVOURITED_STATUSES_EXPAND_SUCCESS:
  case PINNED_STATUSES_FETCH_SUCCESS:
  case SEARCH_FETCH_SUCCESS:
    return importStatuses(state, action.statuses);
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
};

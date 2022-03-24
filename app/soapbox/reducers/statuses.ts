import escapeTextContentForBrowser from 'escape-html';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import { AnyAction } from 'redux';

import emojify from 'soapbox/features/emoji/emoji';
import { normalizeStatus } from 'soapbox/normalizers';
import { simulateEmojiReact, simulateUnEmojiReact } from 'soapbox/utils/emoji_reacts';
import { stripCompatibilityFeatures, unescapeHTML } from 'soapbox/utils/html';
import { makeEmojiMap } from 'soapbox/utils/normalizers';

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

const domParser = new DOMParser();

type StatusRecord = ReturnType<typeof normalizeStatus>;
type APIEntity = Record<string, any>;
type APIEntities = Array<APIEntity>;

type State = ImmutableMap<string, StatusRecord>;

const minifyStatus = (status: StatusRecord): StatusRecord => {
  return status.mergeWith((o, n) => n || o, {
    account: status.getIn(['account', 'id']),
    reblog: status.getIn(['reblog', 'id']),
    poll: status.getIn(['poll', 'id']),
    quote: status.getIn(['quote', 'id']),
  });
};

// Gets titles of poll options from status
const getPollOptionTitles = (status: StatusRecord): Array<string> => {
  return status.poll?.options.map(({ title }: { title: string }) => title);
};

// Creates search text from the status
const buildSearchContent = (status: StatusRecord): string => {
  const pollOptionTitles = getPollOptionTitles(status);

  const fields = ImmutableList([
    status.spoiler_text,
    status.content,
  ]).concat(pollOptionTitles);

  return unescapeHTML(fields.join('\n\n'));
};

// Only calculate these values when status first encountered
// Otherwise keep the ones already in the reducer
export const calculateStatus = (
  status: StatusRecord,
  oldStatus: StatusRecord,
  expandSpoilers: boolean = false,
): StatusRecord => {
  if (oldStatus) {
    return status.merge({
      search_index: oldStatus.search_index,
      contentHtml: oldStatus.contentHtml,
      spoilerHtml: oldStatus.spoilerHtml,
      hidden: oldStatus.hidden,
    });
  } else {
    const spoilerText   = status.spoiler_text;
    const searchContent = buildSearchContent(status);
    const emojiMap      = makeEmojiMap(status.emojis);

    return status.merge({
      search_index: domParser.parseFromString(searchContent, 'text/html').documentElement.textContent || undefined,
      contentHtml: stripCompatibilityFeatures(emojify(status.content, emojiMap)),
      spoilerHtml: emojify(escapeTextContentForBrowser(spoilerText), emojiMap),
      hidden: expandSpoilers ? false : spoilerText.length > 0 || status.sensitive,
    });
  }
};

// Check whether a status is a quote by secondary characteristics
const isQuote = (status: StatusRecord) => {
  return Boolean(status.getIn(['pleroma', 'quote_url']));
};

// Preserve quote if an existing status already has it
const fixQuote = (status: StatusRecord, oldStatus: StatusRecord): StatusRecord => {
  if (oldStatus && !status.quote && isQuote(status)) {
    return status
      .set('quote', oldStatus.quote)
      .updateIn(['pleroma', 'quote_visible'], visible => visible || oldStatus.getIn(['pleroma', 'quote_visible']));
  } else {
    return status;
  }
};

const fixStatus = (state: State, status: APIEntity, expandSpoilers: boolean): StatusRecord => {
  const oldStatus: StatusRecord = state.get(status.id);

  return normalizeStatus(status).withMutations(status => {
    fixQuote(status, oldStatus);
    calculateStatus(status, oldStatus, expandSpoilers);
    minifyStatus(status);
  });
};

const importStatus = (state: State, status: APIEntity, expandSpoilers: boolean): State =>
  state.set(status.id, fixStatus(state, status, expandSpoilers));

const importStatuses = (state: State, statuses: APIEntities, expandSpoilers: boolean): State =>
  state.withMutations(mutable => statuses.forEach(status => importStatus(mutable, status, expandSpoilers)));

const deleteStatus = (state: State, id: string, references: Array<string>) => {
  references.forEach(ref => {
    state = deleteStatus(state, ref[0], []);
  });

  return state.delete(id);
};

const importPendingStatus = (state: State, { in_reply_to_id }: APIEntity) => {
  if (in_reply_to_id) {
    return state.updateIn([in_reply_to_id, 'replies_count'], 0, (count: number) => count + 1);
  } else {
    return state;
  }
};

const deletePendingStatus = (state: State, { in_reply_to_id }: APIEntity) => {
  if (in_reply_to_id) {
    return state.updateIn([in_reply_to_id, 'replies_count'], 0, (count: number) => Math.max(0, count - 1));
  } else {
    return state;
  }
};

const initialState: State = ImmutableMap();

export default function statuses(state = initialState, action: AnyAction): State {
  switch(action.type) {
  case STATUS_IMPORT:
    return importStatus(state, action.status, action.expandSpoilers);
  case STATUSES_IMPORT:
    return importStatuses(state, action.statuses, action.expandSpoilers);
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
      action.ids.forEach((id: string) => {
        if (!(state.get(id) === undefined)) {
          map.setIn([id, 'hidden'], false);
        }
      });
    });
  case STATUS_HIDE:
    return state.withMutations(map => {
      action.ids.forEach((id: string) => {
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

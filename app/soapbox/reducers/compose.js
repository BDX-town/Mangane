import { Map as ImmutableMap, List as ImmutableList, OrderedSet as ImmutableOrderedSet, fromJS } from 'immutable';

import { tagHistory } from 'soapbox/settings';
import { PLEROMA } from 'soapbox/utils/features';
import { hasIntegerMediaIds } from 'soapbox/utils/status';

import {
  COMPOSE_MOUNT,
  COMPOSE_UNMOUNT,
  COMPOSE_CHANGE,
  COMPOSE_REPLY,
  COMPOSE_REPLY_CANCEL,
  COMPOSE_QUOTE,
  COMPOSE_QUOTE_CANCEL,
  COMPOSE_DIRECT,
  COMPOSE_MENTION,
  COMPOSE_SUBMIT_REQUEST,
  COMPOSE_SUBMIT_SUCCESS,
  COMPOSE_SUBMIT_FAIL,
  COMPOSE_UPLOAD_REQUEST,
  COMPOSE_UPLOAD_SUCCESS,
  COMPOSE_UPLOAD_FAIL,
  COMPOSE_UPLOAD_UNDO,
  COMPOSE_UPLOAD_PROGRESS,
  COMPOSE_SUGGESTIONS_CLEAR,
  COMPOSE_SUGGESTIONS_READY,
  COMPOSE_SUGGESTION_SELECT,
  COMPOSE_SUGGESTION_TAGS_UPDATE,
  COMPOSE_TAG_HISTORY_UPDATE,
  COMPOSE_SENSITIVITY_CHANGE,
  COMPOSE_SPOILERNESS_CHANGE,
  COMPOSE_TYPE_CHANGE,
  COMPOSE_SPOILER_TEXT_CHANGE,
  COMPOSE_VISIBILITY_CHANGE,
  COMPOSE_COMPOSING_CHANGE,
  COMPOSE_EMOJI_INSERT,
  COMPOSE_UPLOAD_CHANGE_REQUEST,
  COMPOSE_UPLOAD_CHANGE_SUCCESS,
  COMPOSE_UPLOAD_CHANGE_FAIL,
  COMPOSE_RESET,
  COMPOSE_POLL_ADD,
  COMPOSE_POLL_REMOVE,
  COMPOSE_SCHEDULE_ADD,
  COMPOSE_SCHEDULE_SET,
  COMPOSE_SCHEDULE_REMOVE,
  COMPOSE_POLL_OPTION_ADD,
  COMPOSE_POLL_OPTION_CHANGE,
  COMPOSE_POLL_OPTION_REMOVE,
  COMPOSE_POLL_SETTINGS_CHANGE,
  COMPOSE_ADD_TO_MENTIONS,
  COMPOSE_REMOVE_FROM_MENTIONS,
} from '../actions/compose';
import { ME_FETCH_SUCCESS, ME_PATCH_SUCCESS } from '../actions/me';
import { SETTING_CHANGE, FE_NAME } from '../actions/settings';
import { REDRAFT } from '../actions/statuses';
import { TIMELINE_DELETE } from '../actions/timelines';
import { unescapeHTML } from '../utils/html';
import uuid from '../uuid';

const initialState = ImmutableMap({
  id: null,
  mounted: 0,
  sensitive: false,
  spoiler: false,
  spoiler_text: '',
  content_type: 'text/plain',
  privacy: 'public',
  text: '',
  focusDate: null,
  caretPosition: null,
  in_reply_to: null,
  quote: null,
  is_composing: false,
  is_submitting: false,
  is_changing_upload: false,
  is_uploading: false,
  progress: 0,
  media_attachments: ImmutableList(),
  poll: null,
  suggestion_token: null,
  suggestions: ImmutableList(),
  default_privacy: 'public',
  default_sensitive: false,
  default_content_type: 'text/plain',
  resetFileKey: Math.floor((Math.random() * 0x10000)),
  idempotencyKey: uuid(),
  tagHistory: ImmutableList(),
});

const initialPoll = ImmutableMap({
  options: ImmutableList(['', '']),
  expires_in: 24 * 3600,
  multiple: false,
});

const statusToTextMentions = (state, status, account) => {
  const author = status.getIn(['account', 'acct']);
  const mentions = status.get('mentions', []).map(m => m.get('acct'));

  return ImmutableOrderedSet([author])
    .concat(mentions)
    .delete(account.get('acct'))
    .map(m => `@${m} `)
    .join('');
};

export const statusToMentionsArray = (state, status, account) => {
  const author = status.getIn(['account', 'acct']);
  const mentions = status.get('mentions', []).map(m => m.get('acct'));

  return ImmutableOrderedSet([author])
    .concat(mentions)
    .delete(account.get('acct'));
};

export const statusToMentionsAccountIdsArray = (state, status, account) => {
  const author = status.getIn(['account', 'id']);
  const mentions = status.get('mentions', []).map(m => m.get('id'));

  return ImmutableOrderedSet([author])
    .concat(mentions)
    .delete(account.get('id'));
};

function clearAll(state) {
  return state.withMutations(map => {
    map.set('id', null);
    map.set('text', '');
    map.set('to', ImmutableOrderedSet());
    map.set('spoiler', false);
    map.set('spoiler_text', '');
    map.set('content_type', state.get('default_content_type'));
    map.set('is_submitting', false);
    map.set('is_changing_upload', false);
    map.set('in_reply_to', null);
    map.set('quote', null);
    map.set('privacy', state.get('default_privacy'));
    map.set('sensitive', false);
    map.set('media_attachments', ImmutableList());
    map.set('poll', null);
    map.set('idempotencyKey', uuid());
    map.set('schedule', null);
  });
}

function appendMedia(state, media) {
  const prevSize = state.get('media_attachments').size;

  return state.withMutations(map => {
    map.update('media_attachments', list => list.push(media));
    map.set('is_uploading', false);
    map.set('resetFileKey', Math.floor((Math.random() * 0x10000)));
    map.set('idempotencyKey', uuid());

    if (prevSize === 0 && (state.get('default_sensitive') || state.get('spoiler'))) {
      map.set('sensitive', true);
    }
  });
}

function removeMedia(state, mediaId) {
  const prevSize = state.get('media_attachments').size;

  return state.withMutations(map => {
    map.update('media_attachments', list => list.filterNot(item => item.get('id') === mediaId));
    map.set('idempotencyKey', uuid());

    if (prevSize === 1) {
      map.set('sensitive', false);
    }
  });
}

const insertSuggestion = (state, position, token, completion, path) => {
  return state.withMutations(map => {
    map.updateIn(path, oldText => `${oldText.slice(0, position)}${completion} ${oldText.slice(position + token.length)}`);
    map.set('suggestion_token', null);
    map.set('suggestions', ImmutableList());
    if (path.length === 1 && path[0] === 'text') {
      map.set('focusDate', new Date());
      map.set('caretPosition', position + completion.length + 1);
    }
    map.set('idempotencyKey', uuid());
  });
};

const updateSuggestionTags = (state, token) => {
  const prefix = token.slice(1);

  return state.merge({
    suggestions: state.get('tagHistory')
      .filter(tag => tag.toLowerCase().startsWith(prefix.toLowerCase()))
      .slice(0, 4)
      .map(tag => '#' + tag),
    suggestion_token: token,
  });
};

const insertEmoji = (state, position, emojiData, needsSpace) => {
  const oldText = state.get('text');
  const emoji = needsSpace ? ' ' + emojiData.native : emojiData.native;

  return state.merge({
    text: `${oldText.slice(0, position)}${emoji} ${oldText.slice(position)}`,
    focusDate: new Date(),
    caretPosition: position + emoji.length + 1,
    idempotencyKey: uuid(),
  });
};

const privacyPreference = (a, b) => {
  const order = ['public', 'unlisted', 'private', 'direct'];
  return order[Math.max(order.indexOf(a), order.indexOf(b), 0)];
};

const domParser = new DOMParser();

const expandMentions = status => {
  const fragment = domParser.parseFromString(status.get('content'), 'text/html').documentElement;

  status.get('mentions').forEach(mention => {
    const node = fragment.querySelector(`a[href="${mention.get('url')}"]`);
    if (node) node.textContent = `@${mention.get('acct')}`;
  });

  return fragment.innerHTML;
};

const getExplicitMentions = (me, status) => {
  const fragment = domParser.parseFromString(status.get('content'), 'text/html').documentElement;

  const mentions = status
    .get('mentions')
    .filter(mention => !(fragment.querySelector(`a[href="${mention.get('url')}"]`) || mention.get('id') === me))
    .map(m => m.get('acct'));

  return ImmutableOrderedSet(mentions);
};

const getAccountSettings = account => {
  return account.getIn(['pleroma', 'settings_store', FE_NAME], ImmutableMap());
};

const importAccount = (state, account) => {
  account = fromJS(account);
  const settings = getAccountSettings(account);

  const defaultPrivacy = settings.get('defaultPrivacy', 'public');
  const defaultContentType = settings.get('defaultContentType', 'text/plain');

  return state.merge({
    default_privacy: defaultPrivacy,
    privacy: defaultPrivacy,
    default_content_type: defaultContentType,
    content_type: defaultContentType,
    tagHistory: ImmutableList(tagHistory.get(account.get('id'))),
  });
};

const updateAccount = (state, account) => {
  account = fromJS(account);
  const settings = getAccountSettings(account);

  const defaultPrivacy = settings.get('defaultPrivacy');
  const defaultContentType = settings.get('defaultContentType');

  return state.withMutations(state => {
    if (defaultPrivacy) state.set('default_privacy', defaultPrivacy);
    if (defaultContentType) state.set('default_content_type', defaultContentType);
  });
};

const updateSetting = (state, path, value) => {
  const pathString = path.join(',');
  switch (pathString) {
  case 'defaultPrivacy':
    return state.set('default_privacy', value).set('privacy', value);
  case 'defaultContentType':
    return state.set('default_content_type', value).set('content_type', value);
  default:
    return state;
  }
};

export default function compose(state = initialState, action) {
  switch(action.type) {
  case COMPOSE_MOUNT:
    return state.set('mounted', state.get('mounted') + 1);
  case COMPOSE_UNMOUNT:
    return state
      .set('mounted', Math.max(state.get('mounted') - 1, 0))
      .set('is_composing', false);
  case COMPOSE_SENSITIVITY_CHANGE:
    return state.withMutations(map => {
      if (!state.get('spoiler')) {
        map.set('sensitive', !state.get('sensitive'));
      }

      map.set('idempotencyKey', uuid());
    });
  case COMPOSE_TYPE_CHANGE:
    return state.withMutations(map => {
      map.set('content_type', action.value);
      map.set('idempotencyKey', uuid());
    });
  case COMPOSE_SPOILERNESS_CHANGE:
    return state.withMutations(map => {
      map.set('spoiler_text', '');
      map.set('spoiler', !state.get('spoiler'));
      map.set('idempotencyKey', uuid());

      if (!state.get('sensitive') && state.get('media_attachments').size >= 1) {
        map.set('sensitive', true);
      }
    });
  case COMPOSE_SPOILER_TEXT_CHANGE:
    return state
      .set('spoiler_text', action.text)
      .set('idempotencyKey', uuid());
  case COMPOSE_VISIBILITY_CHANGE:
    return state
      .set('privacy', action.value)
      .set('idempotencyKey', uuid());
  case COMPOSE_CHANGE:
    return state
      .set('text', action.text)
      .set('idempotencyKey', uuid());
  case COMPOSE_COMPOSING_CHANGE:
    return state.set('is_composing', action.value);
  case COMPOSE_REPLY:
    return state.withMutations(map => {
      map.set('in_reply_to', action.status.get('id'));
      map.set('to', action.explicitAddressing ? statusToMentionsArray(state, action.status, action.account) : undefined);
      map.set('text', !action.explicitAddressing ? statusToTextMentions(state, action.status, action.account) : '');
      map.set('privacy', privacyPreference(action.status.get('visibility'), state.get('default_privacy')));
      map.set('focusDate', new Date());
      map.set('caretPosition', null);
      map.set('idempotencyKey', uuid());
      map.set('content_type', state.get('default_content_type'));

      if (action.status.get('spoiler_text', '').length > 0) {
        map.set('spoiler', true);
        map.set('spoiler_text', action.status.get('spoiler_text'));
      } else {
        map.set('spoiler', false);
        map.set('spoiler_text', '');
      }
    });
  case COMPOSE_QUOTE:
    return state.withMutations(map => {
      map.set('quote', action.status.get('id'));
      map.set('to', undefined);
      map.set('text', '');
      map.set('privacy', privacyPreference(action.status.get('visibility'), state.get('default_privacy')));
      map.set('focusDate', new Date());
      map.set('caretPosition', null);
      map.set('idempotencyKey', uuid());
      map.set('content_type', state.get('default_content_type'));
      map.set('spoiler', false);
      map.set('spoiler_text', '');
    });
  case COMPOSE_SUBMIT_REQUEST:
    return state.set('is_submitting', true);
  case COMPOSE_UPLOAD_CHANGE_REQUEST:
    return state.set('is_changing_upload', true);
  case COMPOSE_REPLY_CANCEL:
  case COMPOSE_QUOTE_CANCEL:
  case COMPOSE_RESET:
  case COMPOSE_SUBMIT_SUCCESS:
    return clearAll(state);
  case COMPOSE_SUBMIT_FAIL:
    return state.set('is_submitting', false);
  case COMPOSE_UPLOAD_CHANGE_FAIL:
    return state.set('is_changing_upload', false);
  case COMPOSE_UPLOAD_REQUEST:
    return state.set('is_uploading', true);
  case COMPOSE_UPLOAD_SUCCESS:
    return appendMedia(state, fromJS(action.media));
  case COMPOSE_UPLOAD_FAIL:
    return state.set('is_uploading', false);
  case COMPOSE_UPLOAD_UNDO:
    return removeMedia(state, action.media_id);
  case COMPOSE_UPLOAD_PROGRESS:
    return state.set('progress', Math.round((action.loaded / action.total) * 100));
  case COMPOSE_MENTION:
    return state.withMutations(map => {
      map.update('text', text => [text.trim(), `@${action.account.get('acct')} `].filter((str) => str.length !== 0).join(' '));
      map.set('focusDate', new Date());
      map.set('caretPosition', null);
      map.set('idempotencyKey', uuid());
    });
  case COMPOSE_DIRECT:
    return state.withMutations(map => {
      map.update('text', text => [text.trim(), `@${action.account.get('acct')} `].filter((str) => str.length !== 0).join(' '));
      map.set('privacy', 'direct');
      map.set('focusDate', new Date());
      map.set('caretPosition', null);
      map.set('idempotencyKey', uuid());
    });
  case COMPOSE_SUGGESTIONS_CLEAR:
    return state.update('suggestions', ImmutableList(), list => list.clear()).set('suggestion_token', null);
  case COMPOSE_SUGGESTIONS_READY:
    return state.set('suggestions', ImmutableList(action.accounts ? action.accounts.map(item => item.id) : action.emojis)).set('suggestion_token', action.token);
  case COMPOSE_SUGGESTION_SELECT:
    return insertSuggestion(state, action.position, action.token, action.completion, action.path);
  case COMPOSE_SUGGESTION_TAGS_UPDATE:
    return updateSuggestionTags(state, action.token);
  case COMPOSE_TAG_HISTORY_UPDATE:
    return state.set('tagHistory', fromJS(action.tags));
  case TIMELINE_DELETE:
    if (action.id === state.get('in_reply_to')) {
      return state.set('in_reply_to', null);
    } if (action.id === state.get('quote')) {
      return state.set('quote', null);
    } else {
      return state;
    }
  case COMPOSE_EMOJI_INSERT:
    return insertEmoji(state, action.position, action.emoji, action.needsSpace);
  case COMPOSE_UPLOAD_CHANGE_SUCCESS:
    return state
      .set('is_changing_upload', false)
      .update('media_attachments', list => list.map(item => {
        if (item.get('id') === action.media.id) {
          return fromJS(action.media);
        }

        return item;
      }));
  case REDRAFT:
    return state.withMutations(map => {
      map.set('text', action.raw_text || unescapeHTML(expandMentions(action.status)));
      map.set('to', action.explicitAddressing ? getExplicitMentions(action.status.get('account', 'id'), action.status) : undefined);
      map.set('in_reply_to', action.status.get('in_reply_to_id'));
      map.set('privacy', action.status.get('visibility'));
      map.set('focusDate', new Date());
      map.set('caretPosition', null);
      map.set('idempotencyKey', uuid());
      map.set('content_type', action.content_type || 'text/plain');

      if (action.v?.software === PLEROMA && hasIntegerMediaIds(action.status)) {
        map.set('media_attachments', ImmutableList());
      } else {
        map.set('media_attachments', action.status.get('media_attachments'));
      }

      if (action.status.get('spoiler_text').length > 0) {
        map.set('spoiler', true);
        map.set('spoiler_text', action.status.get('spoiler_text'));
      } else {
        map.set('spoiler', false);
        map.set('spoiler_text', '');
      }

      if (action.status.get('poll')) {
        map.set('poll', ImmutableMap({
          options: action.status.getIn(['poll', 'options']).map(x => x.get('title')),
          multiple: action.status.getIn(['poll', 'multiple']),
          expires_in: 24 * 3600,
        }));
      }
    });
  case COMPOSE_POLL_ADD:
    return state.set('poll', initialPoll);
  case COMPOSE_POLL_REMOVE:
    return state.set('poll', null);
  case COMPOSE_SCHEDULE_ADD:
    return state.set('schedule', new Date());
  case COMPOSE_SCHEDULE_SET:
    return state.set('schedule', action.date);
  case COMPOSE_SCHEDULE_REMOVE:
    return state.set('schedule', null);
  case COMPOSE_POLL_OPTION_ADD:
    return state.updateIn(['poll', 'options'], options => options.push(action.title));
  case COMPOSE_POLL_OPTION_CHANGE:
    return state.setIn(['poll', 'options', action.index], action.title);
  case COMPOSE_POLL_OPTION_REMOVE:
    return state.updateIn(['poll', 'options'], options => options.delete(action.index));
  case COMPOSE_POLL_SETTINGS_CHANGE:
    return state.update('poll', poll => poll.set('expires_in', action.expiresIn).set('multiple', action.isMultiple));
  case COMPOSE_ADD_TO_MENTIONS:
    return state.update('to', mentions => mentions.add(action.account));
  case COMPOSE_REMOVE_FROM_MENTIONS:
    return state.update('to', mentions => mentions.delete(action.account));
  case ME_FETCH_SUCCESS:
    return importAccount(state, action.me);
  case ME_PATCH_SUCCESS:
    return updateAccount(state, action.me);
  case SETTING_CHANGE:
    return updateSetting(state, action.path, action.value);
  default:
    return state;
  }
}

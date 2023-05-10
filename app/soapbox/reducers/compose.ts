import { Map as ImmutableMap, List as ImmutableList, OrderedSet as ImmutableOrderedSet, Record as ImmutableRecord, fromJS } from 'immutable';
import { v4 as uuid } from 'uuid';

import { tagHistory } from 'soapbox/settings';
import { PLEROMA, AKKOMA } from 'soapbox/utils/features';
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
  COMPOSE_SET_STATUS,
} from '../actions/compose';
import { ME_FETCH_SUCCESS, ME_PATCH_SUCCESS } from '../actions/me';
import { SETTING_CHANGE, FE_NAME } from '../actions/settings';
import { TIMELINE_DELETE } from '../actions/timelines';
import { normalizeAttachment } from '../normalizers/attachment';
import { unescapeHTML } from '../utils/html';

import type { AnyAction } from 'redux';
import type { Emoji } from 'soapbox/components/autosuggest_emoji';
import type {
  Account as AccountEntity,
  APIEntity,
  Attachment as AttachmentEntity,
  Status as StatusEntity,
  Tag,
} from 'soapbox/types/entities';

const getResetFileKey = () => Math.floor((Math.random() * 0x10000));

const PollRecord = ImmutableRecord({
  options: ImmutableList(['', '']),
  expires_in: 24 * 3600,
  multiple: false,
});

export const ReducerRecord = ImmutableRecord({
  caretPosition: null as number | null,
  content_type: 'text/plain',
  default_content_type: 'text/plain',
  default_privacy: 'public',
  default_sensitive: false,
  focusDate: null as Date | null,
  idempotencyKey: '',
  id: null as string | null,
  in_reply_to: null as string | null,
  is_changing_upload: false,
  is_composing: false,
  is_submitting: false,
  is_uploading: false,
  media_attachments: ImmutableList<AttachmentEntity>(),
  mounted: 0,
  poll: null as Poll | null,
  privacy: 'public',
  progress: 0,
  quote: null as string | null,
  resetFileKey: null as number | null,
  schedule: null as Date | null,
  sensitive: false,
  spoiler: false,
  spoiler_text: '',
  suggestions: ImmutableList(),
  suggestion_token: null as string | null,
  tagHistory: ImmutableList<string>(),
  text: '',
  to: ImmutableOrderedSet<string>(),
});

type State = ReturnType<typeof ReducerRecord>;
type Poll = ReturnType<typeof PollRecord>;

const statusToTextMentions = (state: State, status: ImmutableMap<string, any>, account: AccountEntity) => {
  const author = status.getIn(['account', 'acct']);
  const mentions = status.get('mentions')?.map((m: ImmutableMap<string, any>) => m.get('acct')) || [];

  return ImmutableOrderedSet([author])
    .concat(mentions)
    .delete(account.acct)
    .map(m => `@${m} `)
    .join('');
};

export const statusToMentionsArray = (status: ImmutableMap<string, any>, account: AccountEntity) => {
  const author = status.getIn(['account', 'acct']) as string;
  const mentions = status.get('mentions')?.map((m: ImmutableMap<string, any>) => m.get('acct')) || [];

  return ImmutableOrderedSet([author])
    .concat(mentions)
    .delete(account.get('acct')) as ImmutableOrderedSet<string>;
};

export const statusToMentionsAccountIdsArray = (status: StatusEntity, account: AccountEntity) => {
  const author = (status.account as AccountEntity).id;
  const mentions = status.mentions.map((m) => m.id);

  return ImmutableOrderedSet([author])
    .concat(mentions)
    .delete(account.id) as ImmutableOrderedSet<string>;
};

function clearAll(state: State) {
  return ReducerRecord({
    content_type: state.default_content_type,
    default_content_type: state.default_content_type,
    privacy: state.default_privacy,
    idempotencyKey: uuid(),
  });
}

function appendMedia(state: State, media: APIEntity) {
  const prevSize = state.media_attachments.size;

  return state.withMutations(map => {
    map.update('media_attachments', list => list.push(normalizeAttachment(media)));
    map.set('is_uploading', false);
    map.set('resetFileKey', Math.floor((Math.random() * 0x10000)));
    map.set('idempotencyKey', uuid());

    if (prevSize === 0 && (state.default_sensitive || state.spoiler)) {
      map.set('sensitive', true);
    }
  });
}

function removeMedia(state: State, mediaId: string) {
  const prevSize = state.media_attachments.size;

  return state.withMutations(map => {
    map.update('media_attachments', list => list.filterNot(item => item.id === mediaId));
    map.set('idempotencyKey', uuid());

    if (prevSize === 1) {
      map.set('sensitive', false);
    }
  });
}

const insertSuggestion = (state: State, position: number, token: string, completion: string, path: Array<string | number>) => {
  return state.withMutations(map => {
    map.updateIn(path, oldText => `${(oldText as string).slice(0, position)}${completion} ${(oldText as string).slice(position + token.length)}`);
    map.set('suggestion_token', null);
    map.set('suggestions', ImmutableList());
    if (path.length === 1 && path[0] === 'text') {
      map.set('focusDate', new Date());
      map.set('caretPosition', position + completion.length + 1);
    }
    map.set('idempotencyKey', uuid());
  });
};

const updateSuggestionTags = (state: State, token: string, currentTrends: ImmutableList<Tag>) => {
  const prefix = token.slice(1);

  return state.merge({
    suggestions: ImmutableList(currentTrends
      .filter((tag) => tag.get('name').toLowerCase().startsWith(prefix.toLowerCase()))
      .slice(0, 4)
      .map((tag) => '#' + tag.name)),
    suggestion_token: token,
  });
};

const insertEmoji = (state: State, position: number, emojiData: Emoji, needsSpace: boolean) => {
  const oldText = state.text;
  const emoji = needsSpace ? ' ' + emojiData.native : emojiData.native;

  return state.merge({
    text: `${oldText.slice(0, position)}${emoji} ${oldText.slice(position)}`,
    focusDate: new Date(),
    caretPosition: position + emoji.length + 1,
    idempotencyKey: uuid(),
  });
};

const privacyPreference = (a: string, b: string) => {
  const order = ['public', 'unlisted', 'private', 'direct'];
  return order[Math.max(order.indexOf(a), order.indexOf(b), 0)];
};

const domParser = new DOMParser();

const expandMentions = (status: ImmutableMap<string, any>) => {
  const fragment = domParser.parseFromString(status.get('content'), 'text/html').documentElement;

  status.get('mentions').forEach((mention: ImmutableMap<string, any>) => {
    const node = fragment.querySelector(`a[href="${mention.get('url')}"]`);
    if (node) node.textContent = `@${mention.get('acct')}`;
  });

  return fragment.innerHTML;
};

const getExplicitMentions = (me: string, status: ImmutableMap<string, any>) => {
  const fragment = domParser.parseFromString(status.get('content'), 'text/html').documentElement;

  const mentions = status
    .get('mentions')
    .filter((mention: ImmutableMap<string, any>) => !(fragment.querySelector(`a[href="${mention.get('url')}"]`) || mention.get('id') === me))
    .map((m: ImmutableMap<string, any>) => m.get('acct'));

  return ImmutableOrderedSet<string>(mentions);
};

const getAccountSettings = (account: ImmutableMap<string, any>) => {
  return account.getIn(['pleroma', 'settings_store', FE_NAME], ImmutableMap()) as ImmutableMap<string, any>;
};

const importAccount = (state: State, account: APIEntity) => {
  const settings = getAccountSettings(ImmutableMap(fromJS(account)));

  const defaultPrivacy = settings.get('defaultPrivacy', 'public');
  const defaultContentType = settings.get('defaultContentType', 'text/plain');

  return state.merge({
    default_privacy: defaultPrivacy,
    privacy: defaultPrivacy,
    default_content_type: defaultContentType,
    content_type: defaultContentType,
    tagHistory: ImmutableList(tagHistory.get(account.id)),
  });
};

const updateAccount = (state: State, account: APIEntity) => {
  const settings = getAccountSettings(ImmutableMap(fromJS(account)));

  const defaultPrivacy = settings.get('defaultPrivacy');
  const defaultContentType = settings.get('defaultContentType');

  return state.withMutations(state => {
    if (defaultPrivacy) state.set('default_privacy', defaultPrivacy);
    if (defaultContentType) state.set('default_content_type', defaultContentType);
  });
};

const updateSetting = (state: State, path: string[], value: string) => {
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

export default function compose(state = ReducerRecord({ idempotencyKey: uuid(), resetFileKey: getResetFileKey() }), action: AnyAction) {
  switch (action.type) {
    case COMPOSE_MOUNT:
      return state.set('mounted', state.mounted + 1);
    case COMPOSE_UNMOUNT:
      return state
        .set('mounted', Math.max(state.mounted - 1, 0))
        .set('is_composing', false);
    case COMPOSE_SENSITIVITY_CHANGE:
      return state.withMutations(map => {
        if (!state.spoiler) {
          map.set('sensitive', !state.sensitive);
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
        map.set('spoiler', !state.spoiler);
        map.set('idempotencyKey', uuid());

        if (!state.sensitive && state.media_attachments.size >= 1) {
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
        map.set('to', action.explicitAddressing ? statusToMentionsArray(action.status, action.account) : ImmutableOrderedSet<string>());
        map.set('text', !action.explicitAddressing ? statusToTextMentions(state, action.status, action.account) : '');
        map.set('privacy', privacyPreference(action.status.visibility, state.default_privacy));
        map.set('focusDate', new Date());
        map.set('caretPosition', null);
        map.set('idempotencyKey', uuid());
        map.set('content_type', state.default_content_type);

        if (action.status.get('spoiler_text', '').length > 0) {
          map.set('spoiler', true);
          map.set('spoiler_text', action.status.spoiler_text);
        } else {
          map.set('spoiler', false);
          map.set('spoiler_text', '');
        }
      });
    case COMPOSE_QUOTE:
      return state.withMutations(map => {
        map.set('quote', action.status.get('id'));
        map.set('to', ImmutableOrderedSet());
        map.set('text', '');
        map.set('privacy', privacyPreference(action.status.visibility, state.default_privacy));
        map.set('focusDate', new Date());
        map.set('caretPosition', null);
        map.set('idempotencyKey', uuid());
        map.set('content_type', state.default_content_type);
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
      return state.update('suggestions', list => list.clear()).set('suggestion_token', null);
    case COMPOSE_SUGGESTIONS_READY:
      return state.set('suggestions', ImmutableList(action.accounts ? action.accounts.map((item: APIEntity) => item.id) : action.emojis)).set('suggestion_token', action.token);
    case COMPOSE_SUGGESTION_SELECT:
      return insertSuggestion(state, action.position, action.token, action.completion, action.path);
    case COMPOSE_SUGGESTION_TAGS_UPDATE:
      return updateSuggestionTags(state, action.token, action.currentTrends);
    case COMPOSE_TAG_HISTORY_UPDATE:
      return state.set('tagHistory', ImmutableList(fromJS(action.tags)) as ImmutableList<string>);
    case TIMELINE_DELETE:
      if (action.id === state.in_reply_to) {
        return state.set('in_reply_to', null);
      } if (action.id === state.quote) {
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
          if (item.id === action.media.id) {
            return normalizeAttachment(action.media);
          }

          return item;
        }));
    case COMPOSE_SET_STATUS:
      return state.withMutations(map => {
        if (!action.withRedraft) {
          map.set('id', action.status.get('id'));
        }
        map.set('text', action.rawText || unescapeHTML(expandMentions(action.status)));
        map.set('to', action.explicitAddressing ? getExplicitMentions(action.status.account.id, action.status) : ImmutableOrderedSet<string>());
        map.set('in_reply_to', action.status.get('in_reply_to_id'));
        map.set('privacy', action.status.get('visibility'));
        map.set('focusDate', new Date());
        map.set('caretPosition', null);
        map.set('idempotencyKey', uuid());
        map.set('content_type', action.contentType || 'text/plain');
        map.set('quote', action.status.get('quote'));

        if ((action.v?.software === PLEROMA || action.v?.software === AKKOMA) && action.withRedraft && hasIntegerMediaIds(action.status)) {
          map.set('media_attachments', ImmutableList());
        } else {
          map.set('media_attachments', action.status.media_attachments);
        }

        if (action.status.get('spoiler_text').length > 0) {
          map.set('spoiler', true);
          map.set('spoiler_text', action.status.get('spoiler_text'));
        } else {
          map.set('spoiler', false);
          map.set('spoiler_text', '');
        }

        if (action.status.get('poll')) {
          map.set('poll', PollRecord({
            options: action.status.poll.options.map((x: APIEntity) => x.get('title')),
            multiple: action.status.poll.multiple,
            expires_in: 24 * 3600,
          }));
        }
      });
    case COMPOSE_POLL_ADD:
      return state.set('poll', PollRecord());
    case COMPOSE_POLL_REMOVE:
      return state.set('poll', null);
    case COMPOSE_SCHEDULE_ADD:
      return state.set('schedule', new Date());
    case COMPOSE_SCHEDULE_SET:
      return state.set('schedule', action.date);
    case COMPOSE_SCHEDULE_REMOVE:
      return state.set('schedule', null);
    case COMPOSE_POLL_OPTION_ADD:
      return state.updateIn(['poll', 'options'], options => (options as ImmutableList<string>).push(action.title));
    case COMPOSE_POLL_OPTION_CHANGE:
      return state.setIn(['poll', 'options', action.index], action.title);
    case COMPOSE_POLL_OPTION_REMOVE:
      return state.updateIn(['poll', 'options'], options => (options as ImmutableList<string>).delete(action.index));
    case COMPOSE_POLL_SETTINGS_CHANGE:
      return state.update('poll', poll => poll!.set('expires_in', action.expiresIn).set('multiple', action.isMultiple));
    case COMPOSE_ADD_TO_MENTIONS:
      return state.update('to', mentions => mentions!.add(action.account));
    case COMPOSE_REMOVE_FROM_MENTIONS:
      return state.update('to', mentions => mentions!.delete(action.account));
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

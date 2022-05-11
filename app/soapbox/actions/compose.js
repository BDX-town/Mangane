import { CancelToken, isCancel } from 'axios';
import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import { throttle } from 'lodash';
import { defineMessages } from 'react-intl';

import snackbar from 'soapbox/actions/snackbar';
import { isLoggedIn } from 'soapbox/utils/auth';
import { getFeatures, parseVersion } from 'soapbox/utils/features';
import { formatBytes } from 'soapbox/utils/media';

import api from '../api';
import { search as emojiSearch } from '../features/emoji/emoji_mart_search_light';
import { tagHistory } from '../settings';
import resizeImage from '../utils/resize_image';

import { showAlert, showAlertForError } from './alerts';
import { useEmoji } from './emojis';
import { importFetchedAccounts } from './importer';
import { uploadMedia, fetchMedia, updateMedia } from './media';
import { openModal, closeModal } from './modals';
import { getSettings } from './settings';
import { createStatus } from './statuses';

let cancelFetchComposeSuggestionsAccounts;

export const COMPOSE_CHANGE          = 'COMPOSE_CHANGE';
export const COMPOSE_SUBMIT_REQUEST  = 'COMPOSE_SUBMIT_REQUEST';
export const COMPOSE_SUBMIT_SUCCESS  = 'COMPOSE_SUBMIT_SUCCESS';
export const COMPOSE_SUBMIT_FAIL     = 'COMPOSE_SUBMIT_FAIL';
export const COMPOSE_REPLY           = 'COMPOSE_REPLY';
export const COMPOSE_REPLY_CANCEL    = 'COMPOSE_REPLY_CANCEL';
export const COMPOSE_QUOTE           = 'COMPOSE_QUOTE';
export const COMPOSE_QUOTE_CANCEL    = 'COMPOSE_QUOTE_CANCEL';
export const COMPOSE_DIRECT          = 'COMPOSE_DIRECT';
export const COMPOSE_MENTION         = 'COMPOSE_MENTION';
export const COMPOSE_RESET           = 'COMPOSE_RESET';
export const COMPOSE_UPLOAD_REQUEST  = 'COMPOSE_UPLOAD_REQUEST';
export const COMPOSE_UPLOAD_SUCCESS  = 'COMPOSE_UPLOAD_SUCCESS';
export const COMPOSE_UPLOAD_FAIL     = 'COMPOSE_UPLOAD_FAIL';
export const COMPOSE_UPLOAD_PROGRESS = 'COMPOSE_UPLOAD_PROGRESS';
export const COMPOSE_UPLOAD_UNDO     = 'COMPOSE_UPLOAD_UNDO';

export const COMPOSE_SUGGESTIONS_CLEAR = 'COMPOSE_SUGGESTIONS_CLEAR';
export const COMPOSE_SUGGESTIONS_READY = 'COMPOSE_SUGGESTIONS_READY';
export const COMPOSE_SUGGESTION_SELECT = 'COMPOSE_SUGGESTION_SELECT';
export const COMPOSE_SUGGESTION_TAGS_UPDATE = 'COMPOSE_SUGGESTION_TAGS_UPDATE';

export const COMPOSE_TAG_HISTORY_UPDATE = 'COMPOSE_TAG_HISTORY_UPDATE';

export const COMPOSE_MOUNT   = 'COMPOSE_MOUNT';
export const COMPOSE_UNMOUNT = 'COMPOSE_UNMOUNT';

export const COMPOSE_SENSITIVITY_CHANGE = 'COMPOSE_SENSITIVITY_CHANGE';
export const COMPOSE_SPOILERNESS_CHANGE = 'COMPOSE_SPOILERNESS_CHANGE';
export const COMPOSE_TYPE_CHANGE = 'COMPOSE_TYPE_CHANGE';
export const COMPOSE_SPOILER_TEXT_CHANGE = 'COMPOSE_SPOILER_TEXT_CHANGE';
export const COMPOSE_VISIBILITY_CHANGE  = 'COMPOSE_VISIBILITY_CHANGE';
export const COMPOSE_LISTABILITY_CHANGE = 'COMPOSE_LISTABILITY_CHANGE';
export const COMPOSE_COMPOSING_CHANGE = 'COMPOSE_COMPOSING_CHANGE';

export const COMPOSE_EMOJI_INSERT = 'COMPOSE_EMOJI_INSERT';

export const COMPOSE_UPLOAD_CHANGE_REQUEST     = 'COMPOSE_UPLOAD_UPDATE_REQUEST';
export const COMPOSE_UPLOAD_CHANGE_SUCCESS     = 'COMPOSE_UPLOAD_UPDATE_SUCCESS';
export const COMPOSE_UPLOAD_CHANGE_FAIL        = 'COMPOSE_UPLOAD_UPDATE_FAIL';

export const COMPOSE_POLL_ADD             = 'COMPOSE_POLL_ADD';
export const COMPOSE_POLL_REMOVE          = 'COMPOSE_POLL_REMOVE';
export const COMPOSE_POLL_OPTION_ADD      = 'COMPOSE_POLL_OPTION_ADD';
export const COMPOSE_POLL_OPTION_CHANGE   = 'COMPOSE_POLL_OPTION_CHANGE';
export const COMPOSE_POLL_OPTION_REMOVE   = 'COMPOSE_POLL_OPTION_REMOVE';
export const COMPOSE_POLL_SETTINGS_CHANGE = 'COMPOSE_POLL_SETTINGS_CHANGE';

export const COMPOSE_SCHEDULE_ADD    = 'COMPOSE_SCHEDULE_ADD';
export const COMPOSE_SCHEDULE_SET    = 'COMPOSE_SCHEDULE_SET';
export const COMPOSE_SCHEDULE_REMOVE = 'COMPOSE_SCHEDULE_REMOVE';

export const COMPOSE_ADD_TO_MENTIONS = 'COMPOSE_ADD_TO_MENTIONS';
export const COMPOSE_REMOVE_FROM_MENTIONS = 'COMPOSE_REMOVE_FROM_MENTIONS';

export const COMPOSE_SET_STATUS = 'COMPOSE_SET_STATUS';

const messages = defineMessages({
  exceededImageSizeLimit: { id: 'upload_error.image_size_limit', defaultMessage: 'Image exceeds the current file size limit ({limit})' },
  exceededVideoSizeLimit: { id: 'upload_error.video_size_limit', defaultMessage: 'Video exceeds the current file size limit ({limit})' },
  scheduleError: { id: 'compose.invalid_schedule', defaultMessage: 'You must schedule a post at least 5 minutes out.'  },
  success: { id: 'compose.submit_success', defaultMessage: 'Your post was sent' },
  uploadErrorLimit: { id: 'upload_error.limit', defaultMessage: 'File upload limit exceeded.' },
  uploadErrorPoll:  { id: 'upload_error.poll', defaultMessage: 'File upload not allowed with polls.' },
  view: { id: 'snackbar.view', defaultMessage: 'View' },
});

const COMPOSE_PANEL_BREAKPOINT = 600 + (285 * 1) + (10 * 1);

export const ensureComposeIsVisible = (getState, routerHistory) => {
  if (!getState().getIn(['compose', 'mounted']) && window.innerWidth < COMPOSE_PANEL_BREAKPOINT) {
    routerHistory.push('/posts/new');
  }
};

export function setComposeToStatus(status, rawText, spoilerText, contentType) {
  return (dispatch, getState) => {
    const { instance } = getState();
    const { explicitAddressing } = getFeatures(instance);

    dispatch({
      type: COMPOSE_SET_STATUS,
      status,
      rawText,
      explicitAddressing,
      spoilerText,
      contentType,
      v: parseVersion(instance.version),
    });
  };
}

export function changeCompose(text) {
  return {
    type: COMPOSE_CHANGE,
    text: text,
  };
}

export function replyCompose(status, routerHistory) {
  return (dispatch, getState) => {
    const state = getState();
    const instance = state.get('instance');
    const { explicitAddressing } = getFeatures(instance);

    dispatch({
      type: COMPOSE_REPLY,
      status: status,
      account: state.getIn(['accounts', state.get('me')]),
      explicitAddressing,
    });

    dispatch(openModal('COMPOSE'));
  };
}

export function cancelReplyCompose() {
  return {
    type: COMPOSE_REPLY_CANCEL,
  };
}

export function quoteCompose(status, routerHistory) {
  return (dispatch, getState) => {
    const state = getState();
    const instance = state.get('instance');
    const { explicitAddressing } = getFeatures(instance);

    dispatch({
      type: COMPOSE_QUOTE,
      status: status,
      account: state.getIn(['accounts', state.get('me')]),
      explicitAddressing,
    });

    dispatch(openModal('COMPOSE'));
  };
}

export function cancelQuoteCompose() {
  return {
    type: COMPOSE_QUOTE_CANCEL,
  };
}

export function resetCompose() {
  return {
    type: COMPOSE_RESET,
  };
}

export function mentionCompose(account, routerHistory) {
  return (dispatch, getState) => {
    dispatch({
      type: COMPOSE_MENTION,
      account: account,
    });

    dispatch(openModal('COMPOSE'));
  };
}

export function directCompose(account, routerHistory) {
  return (dispatch, getState) => {
    dispatch({
      type: COMPOSE_DIRECT,
      account: account,
    });

    dispatch(openModal('COMPOSE'));
  };
}

export function directComposeById(accountId) {
  return (dispatch, getState) => {
    const account = getState().getIn(['accounts', accountId]);

    dispatch({
      type: COMPOSE_DIRECT,
      account: account,
    });

    dispatch(openModal('COMPOSE'));
  };
}

export function handleComposeSubmit(dispatch, getState, data, status) {
  if (!dispatch || !getState) return;

  dispatch(insertIntoTagHistory(data.tags || [], status));
  dispatch(submitComposeSuccess({ ...data }));
  dispatch(snackbar.success(messages.success, messages.view, `/@${data.account.acct}/posts/${data.id}`));
}

const needsDescriptions = state => {
  const media  = state.getIn(['compose', 'media_attachments']);
  const missingDescriptionModal = getSettings(state).get('missingDescriptionModal');

  const hasMissing = media.filter(item => !item.get('description')).size > 0;

  return missingDescriptionModal && hasMissing;
};

const validateSchedule = state => {
  const schedule = state.getIn(['compose', 'schedule']);
  if (!schedule) return true;

  const fiveMinutesFromNow = new Date(new Date().getTime() + 300000);

  return schedule.getTime() > fiveMinutesFromNow.getTime();
};

export function submitCompose(routerHistory, force = false) {
  return function(dispatch, getState) {
    if (!isLoggedIn(getState)) return;
    const state = getState();

    const status   = state.getIn(['compose', 'text'], '');
    const media    = state.getIn(['compose', 'media_attachments']);
    const statusId = state.getIn(['compose', 'id'], null);
    let to         = state.getIn(['compose', 'to'], ImmutableOrderedSet());

    if (!validateSchedule(state)) {
      dispatch(snackbar.error(messages.scheduleError));
      return;
    }

    if ((!status || !status.length) && media.size === 0) {
      return;
    }

    if (!force && needsDescriptions(state)) {
      dispatch(openModal('MISSING_DESCRIPTION', {
        onContinue: () => {
          dispatch(closeModal('MISSING_DESCRIPTION'));
          dispatch(submitCompose(routerHistory, true));
        },
      }));
      return;
    }

    if (to && status) {
      const mentions = status.match(/(?:^|\s|\.)@([a-z0-9_]+(?:@[a-z0-9\.\-]+)?)/gi); // not a perfect regex

      if (mentions)
        to = to.union(mentions.map(mention => mention.trim().slice(1)));
    }

    dispatch(submitComposeRequest());
    dispatch(closeModal());

    const idempotencyKey = state.getIn(['compose', 'idempotencyKey']);

    const params = {
      status,
      in_reply_to_id: state.getIn(['compose', 'in_reply_to'], null),
      quote_id: state.getIn(['compose', 'quote'], null),
      media_ids: media.map(item => item.get('id')),
      sensitive: state.getIn(['compose', 'sensitive']),
      spoiler_text: state.getIn(['compose', 'spoiler_text'], ''),
      visibility: state.getIn(['compose', 'privacy']),
      content_type: state.getIn(['compose', 'content_type']),
      poll: state.getIn(['compose', 'poll'], null),
      scheduled_at: state.getIn(['compose', 'schedule'], null),
      to,
    };

    dispatch(createStatus(params, idempotencyKey, statusId)).then(function(data) {
      if (!statusId && data.visibility === 'direct' && getState().getIn(['conversations', 'mounted']) <= 0 && routerHistory) {
        routerHistory.push('/messages');
      }
      handleComposeSubmit(dispatch, getState, data, status);
    }).catch(function(error) {
      dispatch(submitComposeFail(error));
    });
  };
}

export function submitComposeRequest() {
  return {
    type: COMPOSE_SUBMIT_REQUEST,
  };
}

export function submitComposeSuccess(status) {
  return {
    type: COMPOSE_SUBMIT_SUCCESS,
    status: status,
  };
}

export function submitComposeFail(error) {
  return {
    type: COMPOSE_SUBMIT_FAIL,
    error: error,
  };
}

export function uploadCompose(files, intl) {
  return function(dispatch, getState) {
    if (!isLoggedIn(getState)) return;
    const attachmentLimit = getState().getIn(['instance', 'configuration', 'statuses', 'max_media_attachments']);
    const maxImageSize = getState().getIn(['instance', 'configuration', 'media_attachments', 'image_size_limit']);
    const maxVideoSize = getState().getIn(['instance', 'configuration', 'media_attachments', 'video_size_limit']);

    const media  = getState().getIn(['compose', 'media_attachments']);
    const progress = new Array(files.length).fill(0);
    let total = Array.from(files).reduce((a, v) => a + v.size, 0);

    if (files.length + media.size > attachmentLimit) {
      dispatch(showAlert(undefined, messages.uploadErrorLimit, 'error'));
      return;
    }

    dispatch(uploadComposeRequest());

    Array.from(files).forEach((f, i) => {
      if (media.size + i > attachmentLimit - 1) return;

      const isImage = f.type.match(/image.*/);
      const isVideo = f.type.match(/video.*/);
      if (isImage && maxImageSize && (f.size > maxImageSize)) {
        const limit = formatBytes(maxImageSize);
        const message = intl.formatMessage(messages.exceededImageSizeLimit, { limit });
        dispatch(snackbar.error(message));
        dispatch(uploadComposeFail(true));
        return;
      } else if (isVideo && maxVideoSize && (f.size > maxVideoSize)) {
        const limit = formatBytes(maxVideoSize);
        const message = intl.formatMessage(messages.exceededVideoSizeLimit, { limit });
        dispatch(snackbar.error(message));
        dispatch(uploadComposeFail(true));
        return;
      }

      // FIXME: Don't define function in loop
      /* eslint-disable no-loop-func */
      resizeImage(f).then(file => {
        const data = new FormData();
        data.append('file', file);
        // Account for disparity in size of original image and resized data
        total += file.size - f.size;

        const onUploadProgress = function({ loaded }) {
          progress[i] = loaded;
          dispatch(uploadComposeProgress(progress.reduce((a, v) => a + v, 0), total));
        };

        return dispatch(uploadMedia(data, onUploadProgress))
          .then(({ status, data }) => {
            // If server-side processing of the media attachment has not completed yet,
            // poll the server until it is, before showing the media attachment as uploaded
            if (status === 200) {
              dispatch(uploadComposeSuccess(data, f));
            } else if (status === 202) {
              const poll = () => {
                dispatch(fetchMedia(data.id)).then(({ status, data }) => {
                  if (status === 200) {
                    dispatch(uploadComposeSuccess(data, f));
                  } else if (status === 206) {
                    setTimeout(() => poll(), 1000);
                  }
                }).catch(error => dispatch(uploadComposeFail(error)));
              };

              poll();
            }
          });
      }).catch(error => dispatch(uploadComposeFail(error)));
      /* eslint-enable no-loop-func */
    });
  };
}

export function changeUploadCompose(id, params) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(changeUploadComposeRequest());

    dispatch(updateMedia(id, params)).then(response => {
      dispatch(changeUploadComposeSuccess(response.data));
    }).catch(error => {
      dispatch(changeUploadComposeFail(id, error));
    });
  };
}

export function changeUploadComposeRequest() {
  return {
    type: COMPOSE_UPLOAD_CHANGE_REQUEST,
    skipLoading: true,
  };
}
export function changeUploadComposeSuccess(media) {
  return {
    type: COMPOSE_UPLOAD_CHANGE_SUCCESS,
    media: media,
    skipLoading: true,
  };
}

export function changeUploadComposeFail(error) {
  return {
    type: COMPOSE_UPLOAD_CHANGE_FAIL,
    error: error,
    skipLoading: true,
  };
}

export function uploadComposeRequest() {
  return {
    type: COMPOSE_UPLOAD_REQUEST,
    skipLoading: true,
  };
}

export function uploadComposeProgress(loaded, total) {
  return {
    type: COMPOSE_UPLOAD_PROGRESS,
    loaded: loaded,
    total: total,
  };
}

export function uploadComposeSuccess(media) {
  return {
    type: COMPOSE_UPLOAD_SUCCESS,
    media: media,
    skipLoading: true,
  };
}

export function uploadComposeFail(error) {
  return {
    type: COMPOSE_UPLOAD_FAIL,
    error: error,
    skipLoading: true,
  };
}

export function undoUploadCompose(media_id) {
  return {
    type: COMPOSE_UPLOAD_UNDO,
    media_id: media_id,
  };
}

export function clearComposeSuggestions() {
  if (cancelFetchComposeSuggestionsAccounts) {
    cancelFetchComposeSuggestionsAccounts();
  }
  return {
    type: COMPOSE_SUGGESTIONS_CLEAR,
  };
}

const fetchComposeSuggestionsAccounts = throttle((dispatch, getState, token) => {
  if (cancelFetchComposeSuggestionsAccounts) {
    cancelFetchComposeSuggestionsAccounts();
  }
  api(getState).get('/api/v1/accounts/search', {
    cancelToken: new CancelToken(cancel => {
      cancelFetchComposeSuggestionsAccounts = cancel;
    }),
    params: {
      q: token.slice(1),
      resolve: false,
      limit: 4,
    },
  }).then(response => {
    dispatch(importFetchedAccounts(response.data));
    dispatch(readyComposeSuggestionsAccounts(token, response.data));
  }).catch(error => {
    if (!isCancel(error)) {
      dispatch(showAlertForError(error));
    }
  });
}, 200, { leading: true, trailing: true });

const fetchComposeSuggestionsEmojis = (dispatch, getState, token) => {
  const results = emojiSearch(token.replace(':', ''), { maxResults: 5 });
  dispatch(readyComposeSuggestionsEmojis(token, results));
};

const fetchComposeSuggestionsTags = (dispatch, getState, token) => {
  dispatch(updateSuggestionTags(token));
};

export function fetchComposeSuggestions(token) {
  return (dispatch, getState) => {
    switch (token[0]) {
      case ':':
        fetchComposeSuggestionsEmojis(dispatch, getState, token);
        break;
      case '#':
        fetchComposeSuggestionsTags(dispatch, getState, token);
        break;
      default:
        fetchComposeSuggestionsAccounts(dispatch, getState, token);
        break;
    }
  };
}

export function readyComposeSuggestionsEmojis(token, emojis) {
  return {
    type: COMPOSE_SUGGESTIONS_READY,
    token,
    emojis,
  };
}

export function readyComposeSuggestionsAccounts(token, accounts) {
  return {
    type: COMPOSE_SUGGESTIONS_READY,
    token,
    accounts,
  };
}

export function selectComposeSuggestion(position, token, suggestion, path) {
  return (dispatch, getState) => {
    let completion, startPosition;

    if (typeof suggestion === 'object' && suggestion.id) {
      completion    = suggestion.native || suggestion.colons;
      startPosition = position - 1;

      dispatch(useEmoji(suggestion));
    } else if (suggestion[0] === '#') {
      completion    = suggestion;
      startPosition = position - 1;
    } else {
      completion    = getState().getIn(['accounts', suggestion, 'acct']);
      startPosition = position;
    }

    dispatch({
      type: COMPOSE_SUGGESTION_SELECT,
      position: startPosition,
      token,
      completion,
      path,
    });
  };
}

export function updateSuggestionTags(token) {
  return {
    type: COMPOSE_SUGGESTION_TAGS_UPDATE,
    token,
  };
}

export function updateTagHistory(tags) {
  return {
    type: COMPOSE_TAG_HISTORY_UPDATE,
    tags,
  };
}

function insertIntoTagHistory(recognizedTags, text) {
  return (dispatch, getState) => {
    const state = getState();
    const oldHistory = state.getIn(['compose', 'tagHistory']);
    const me = state.get('me');
    const names = recognizedTags
      .filter(tag => text.match(new RegExp(`#${tag.name}`, 'i')))
      .map(tag => tag.name);
    const intersectedOldHistory = oldHistory.filter(name => names.findIndex(newName => newName.toLowerCase() === name.toLowerCase()) === -1);

    names.push(...intersectedOldHistory.toJS());

    const newHistory = names.slice(0, 1000);

    tagHistory.set(me, newHistory);
    dispatch(updateTagHistory(newHistory));
  };
}

export function mountCompose() {
  return {
    type: COMPOSE_MOUNT,
  };
}

export function unmountCompose() {
  return {
    type: COMPOSE_UNMOUNT,
  };
}

export function changeComposeSensitivity() {
  return {
    type: COMPOSE_SENSITIVITY_CHANGE,
  };
}

export function changeComposeSpoilerness() {
  return {
    type: COMPOSE_SPOILERNESS_CHANGE,
  };
}

export function changeComposeContentType(value) {
  return {
    type: COMPOSE_TYPE_CHANGE,
    value,
  };
}

export function changeComposeSpoilerText(text) {
  return {
    type: COMPOSE_SPOILER_TEXT_CHANGE,
    text,
  };
}

export function changeComposeVisibility(value) {
  return {
    type: COMPOSE_VISIBILITY_CHANGE,
    value,
  };
}

export function insertEmojiCompose(position, emoji, needsSpace) {
  return {
    type: COMPOSE_EMOJI_INSERT,
    position,
    emoji,
    needsSpace,
  };
}

export function changeComposing(value) {
  return {
    type: COMPOSE_COMPOSING_CHANGE,
    value,
  };
}

export function addPoll() {
  return {
    type: COMPOSE_POLL_ADD,
  };
}

export function removePoll() {
  return {
    type: COMPOSE_POLL_REMOVE,
  };
}

export function addSchedule() {
  return {
    type: COMPOSE_SCHEDULE_ADD,
  };
}

export function setSchedule(date) {
  return {
    type: COMPOSE_SCHEDULE_SET,
    date: date,
  };
}

export function removeSchedule() {
  return {
    type: COMPOSE_SCHEDULE_REMOVE,
  };
}

export function addPollOption(title) {
  return {
    type: COMPOSE_POLL_OPTION_ADD,
    title,
  };
}

export function changePollOption(index, title) {
  return {
    type: COMPOSE_POLL_OPTION_CHANGE,
    index,
    title,
  };
}

export function removePollOption(index) {
  return {
    type: COMPOSE_POLL_OPTION_REMOVE,
    index,
  };
}

export function changePollSettings(expiresIn, isMultiple) {
  return {
    type: COMPOSE_POLL_SETTINGS_CHANGE,
    expiresIn,
    isMultiple,
  };
}

export function openComposeWithText(text = '') {
  return (dispatch, getState) => {
    dispatch(resetCompose());
    dispatch(openModal('COMPOSE'));
    dispatch(changeCompose(text));
  };
}

export function addToMentions(accountId) {
  return (dispatch, getState) => {
    const state = getState();
    const acct = state.getIn(['accounts', accountId, 'acct']);

    return dispatch({
      type: COMPOSE_ADD_TO_MENTIONS,
      account: acct,
    });
  };
}

export function removeFromMentions(accountId) {
  return (dispatch, getState) => {
    const state = getState();
    const acct = state.getIn(['accounts', accountId, 'acct']);

    return dispatch({
      type: COMPOSE_REMOVE_FROM_MENTIONS,
      account: acct,
    });
  };
}

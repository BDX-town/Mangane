import axios, { AxiosError, Canceler } from 'axios';
import { List as ImmutableList } from 'immutable';
import throttle from 'lodash/throttle';
import { defineMessages, IntlShape } from 'react-intl';

import snackbar from 'soapbox/actions/snackbar';
import api from 'soapbox/api';
import { search as emojiSearch } from 'soapbox/features/emoji/emoji_mart_search_light';
import { tagHistory } from 'soapbox/settings';
import { isLoggedIn } from 'soapbox/utils/auth';
import { getFeatures, parseVersion } from 'soapbox/utils/features';
import { formatBytes, getVideoDuration } from 'soapbox/utils/media';
import resizeImage from 'soapbox/utils/resize_image';

import { showAlert, showAlertForError } from './alerts';
import { useEmoji } from './emojis';
import { importFetchedAccounts } from './importer';
import { uploadMedia, fetchMedia, updateMedia } from './media';
import { openModal, closeModal } from './modals';
import { getSettings } from './settings';
import { createStatus } from './statuses';

import type { History } from 'history';
import type { Emoji } from 'soapbox/components/autosuggest_emoji';
import type { AutoSuggestion } from 'soapbox/components/autosuggest_input';
import type { AppDispatch, RootState } from 'soapbox/store';
import type { Account, APIEntity, Status, Tag } from 'soapbox/types/entities';

const { CancelToken, isCancel } = axios;

let cancelFetchComposeSuggestionsAccounts: Canceler;

const COMPOSE_CHANGE          = 'COMPOSE_CHANGE';
const COMPOSE_SUBMIT_REQUEST  = 'COMPOSE_SUBMIT_REQUEST';
const COMPOSE_SUBMIT_SUCCESS  = 'COMPOSE_SUBMIT_SUCCESS';
const COMPOSE_SUBMIT_FAIL     = 'COMPOSE_SUBMIT_FAIL';
const COMPOSE_REPLY           = 'COMPOSE_REPLY';
const COMPOSE_REPLY_CANCEL    = 'COMPOSE_REPLY_CANCEL';
const COMPOSE_QUOTE           = 'COMPOSE_QUOTE';
const COMPOSE_QUOTE_CANCEL    = 'COMPOSE_QUOTE_CANCEL';
const COMPOSE_DIRECT          = 'COMPOSE_DIRECT';
const COMPOSE_MENTION         = 'COMPOSE_MENTION';
const COMPOSE_RESET           = 'COMPOSE_RESET';
const COMPOSE_UPLOAD_REQUEST  = 'COMPOSE_UPLOAD_REQUEST';
const COMPOSE_UPLOAD_SUCCESS  = 'COMPOSE_UPLOAD_SUCCESS';
const COMPOSE_UPLOAD_FAIL     = 'COMPOSE_UPLOAD_FAIL';
const COMPOSE_UPLOAD_PROGRESS = 'COMPOSE_UPLOAD_PROGRESS';
const COMPOSE_UPLOAD_UNDO     = 'COMPOSE_UPLOAD_UNDO';

const COMPOSE_SUGGESTIONS_CLEAR = 'COMPOSE_SUGGESTIONS_CLEAR';
const COMPOSE_SUGGESTIONS_READY = 'COMPOSE_SUGGESTIONS_READY';
const COMPOSE_SUGGESTION_SELECT = 'COMPOSE_SUGGESTION_SELECT';
const COMPOSE_SUGGESTION_TAGS_UPDATE = 'COMPOSE_SUGGESTION_TAGS_UPDATE';

const COMPOSE_TAG_HISTORY_UPDATE = 'COMPOSE_TAG_HISTORY_UPDATE';

const COMPOSE_MOUNT   = 'COMPOSE_MOUNT';
const COMPOSE_UNMOUNT = 'COMPOSE_UNMOUNT';

const COMPOSE_SENSITIVITY_CHANGE = 'COMPOSE_SENSITIVITY_CHANGE';
const COMPOSE_SPOILERNESS_CHANGE = 'COMPOSE_SPOILERNESS_CHANGE';
const COMPOSE_TYPE_CHANGE = 'COMPOSE_TYPE_CHANGE';
const COMPOSE_SPOILER_TEXT_CHANGE = 'COMPOSE_SPOILER_TEXT_CHANGE';
const COMPOSE_VISIBILITY_CHANGE  = 'COMPOSE_VISIBILITY_CHANGE';
const COMPOSE_LISTABILITY_CHANGE = 'COMPOSE_LISTABILITY_CHANGE';
const COMPOSE_COMPOSING_CHANGE = 'COMPOSE_COMPOSING_CHANGE';

const COMPOSE_EMOJI_INSERT = 'COMPOSE_EMOJI_INSERT';

const COMPOSE_UPLOAD_CHANGE_REQUEST     = 'COMPOSE_UPLOAD_UPDATE_REQUEST';
const COMPOSE_UPLOAD_CHANGE_SUCCESS     = 'COMPOSE_UPLOAD_UPDATE_SUCCESS';
const COMPOSE_UPLOAD_CHANGE_FAIL        = 'COMPOSE_UPLOAD_UPDATE_FAIL';

const COMPOSE_POLL_ADD             = 'COMPOSE_POLL_ADD';
const COMPOSE_POLL_REMOVE          = 'COMPOSE_POLL_REMOVE';
const COMPOSE_POLL_OPTION_ADD      = 'COMPOSE_POLL_OPTION_ADD';
const COMPOSE_POLL_OPTION_CHANGE   = 'COMPOSE_POLL_OPTION_CHANGE';
const COMPOSE_POLL_OPTION_REMOVE   = 'COMPOSE_POLL_OPTION_REMOVE';
const COMPOSE_POLL_SETTINGS_CHANGE = 'COMPOSE_POLL_SETTINGS_CHANGE';

const COMPOSE_SCHEDULE_ADD    = 'COMPOSE_SCHEDULE_ADD';
const COMPOSE_SCHEDULE_SET    = 'COMPOSE_SCHEDULE_SET';
const COMPOSE_SCHEDULE_REMOVE = 'COMPOSE_SCHEDULE_REMOVE';

const COMPOSE_ADD_TO_MENTIONS = 'COMPOSE_ADD_TO_MENTIONS';
const COMPOSE_REMOVE_FROM_MENTIONS = 'COMPOSE_REMOVE_FROM_MENTIONS';

const COMPOSE_SET_STATUS = 'COMPOSE_SET_STATUS';

const messages = defineMessages({
  exceededImageSizeLimit: { id: 'upload_error.image_size_limit', defaultMessage: 'Image exceeds the current file size limit ({limit})' },
  exceededVideoSizeLimit: { id: 'upload_error.video_size_limit', defaultMessage: 'Video exceeds the current file size limit ({limit})' },
  exceededVideoDurationLimit: { id: 'upload_error.video_duration_limit', defaultMessage: 'Video exceeds the current duration limit ({limit} seconds)' },
  scheduleError: { id: 'compose.invalid_schedule', defaultMessage: 'You must schedule a post at least 5 minutes out.' },
  success: { id: 'compose.submit_success', defaultMessage: 'Your post was sent' },
  editSuccess: { id: 'compose.edit_success', defaultMessage: 'Your post was edited' },
  uploadErrorLimit: { id: 'upload_error.limit', defaultMessage: 'File upload limit exceeded.' },
  uploadErrorPoll: { id: 'upload_error.poll', defaultMessage: 'File upload not allowed with polls.' },
  view: { id: 'snackbar.view', defaultMessage: 'View' },
  replyConfirm: { id: 'confirmations.reply.confirm', defaultMessage: 'Reply' },
  replyMessage: { id: 'confirmations.reply.message', defaultMessage: 'Replying now will overwrite the message you are currently composing. Are you sure you want to proceed?' },
});

const COMPOSE_PANEL_BREAKPOINT = 600 + (285 * 1) + (10 * 1);

const ensureComposeIsVisible = (getState: () => RootState, routerHistory: History) => {
  if (!getState().compose.mounted && window.innerWidth < COMPOSE_PANEL_BREAKPOINT) {
    routerHistory.push('/posts/new');
  }
};

const setComposeToStatus = (status: Status, rawText: string, spoilerText?: string, contentType?: string | false, withRedraft?: boolean) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
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
      withRedraft,
    });
  };

const changeCompose = (text: string) => ({
  type: COMPOSE_CHANGE,
  text: text,
});

const replyCompose = (status: Status) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const instance = state.instance;
    const { explicitAddressing } = getFeatures(instance);

    dispatch({
      type: COMPOSE_REPLY,
      status: status,
      account: state.accounts.get(state.me),
      explicitAddressing,
    });

    dispatch(openModal('COMPOSE'));
  };

const replyComposeWithConfirmation = (status: Status, intl: IntlShape) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    if (state.compose.text.trim().length !== 0) {
      dispatch(openModal('CONFIRM', {
        message: intl.formatMessage(messages.replyMessage),
        confirm: intl.formatMessage(messages.replyConfirm),
        onConfirm: () => dispatch(replyCompose(status)),
      }));
    } else {
      dispatch(replyCompose(status));
    }
  };

const cancelReplyCompose = () => ({
  type: COMPOSE_REPLY_CANCEL,
});

const quoteCompose = (status: Status) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const instance = state.instance;
    const { explicitAddressing } = getFeatures(instance);

    dispatch({
      type: COMPOSE_QUOTE,
      status: status,
      account: state.accounts.get(state.me),
      explicitAddressing,
    });

    dispatch(openModal('COMPOSE'));
  };

const cancelQuoteCompose = () => ({
  type: COMPOSE_QUOTE_CANCEL,
});

const resetCompose = () => ({
  type: COMPOSE_RESET,
});

const mentionCompose = (account: Account) =>
  (dispatch: AppDispatch) => {
    dispatch({
      type: COMPOSE_MENTION,
      account: account,
    });

    dispatch(openModal('COMPOSE'));
  };

const directCompose = (account: Account) =>
  (dispatch: AppDispatch) => {
    dispatch({
      type: COMPOSE_DIRECT,
      account: account,
    });

    dispatch(openModal('COMPOSE'));
  };

const directComposeById = (accountId: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const account = getState().accounts.get(accountId);

    dispatch({
      type: COMPOSE_DIRECT,
      account: account,
    });

    dispatch(openModal('COMPOSE'));
  };

const handleComposeSubmit = (dispatch: AppDispatch, getState: () => RootState, data: APIEntity, status: string, edit?: boolean) => {
  if (!dispatch || !getState) return;

  dispatch(insertIntoTagHistory(data.tags || [], status));
  dispatch(submitComposeSuccess({ ...data }));
  dispatch(snackbar.success(edit ? messages.editSuccess : messages.success, messages.view, `/@${data.account.acct}/posts/${data.id}`));
};

const needsDescriptions = (state: RootState) => {
  const media  = state.compose.media_attachments;
  const missingDescriptionModal = getSettings(state).get('missingDescriptionModal');

  const hasMissing = media.filter(item => !item.description).size > 0;

  return missingDescriptionModal && hasMissing;
};

const validateSchedule = (state: RootState) => {
  const schedule = state.compose.schedule;
  if (!schedule) return true;

  const fiveMinutesFromNow = new Date(new Date().getTime() + 300000);

  return schedule.getTime() > fiveMinutesFromNow.getTime();
};

const submitCompose = (routerHistory?: History, force = false) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;
    const state = getState();

    const status   = state.compose.text;
    const media    = state.compose.media_attachments;
    const statusId = state.compose.id;
    let to         = state.compose.to;

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

    const mentions: string[] | null = status.match(/(?:^|\s)@([a-z\d_-]+(?:@[^@\s]+)?)/gi);

    if (mentions) {
      to = to.union(mentions.map(mention => mention.trim().slice(1)));
    }

    dispatch(submitComposeRequest());
    dispatch(closeModal());

    const idempotencyKey = state.compose.idempotencyKey;

    const params = {
      status,
      in_reply_to_id: state.compose.in_reply_to,
      quote_id: state.compose.quote,
      media_ids: media.map(item => item.id),
      sensitive: state.compose.sensitive,
      spoiler_text: state.compose.spoiler_text,
      visibility: state.compose.privacy,
      content_type: state.compose.content_type,
      poll: state.compose.poll,
      scheduled_at: state.compose.schedule,
      to,
    };

    dispatch(createStatus(params, idempotencyKey, statusId)).then(function(data) {
      if (!statusId && data.visibility === 'direct' && getState().conversations.mounted <= 0 && routerHistory) {
        routerHistory.push('/messages');
      }
      handleComposeSubmit(dispatch, getState, data, status, !!statusId);
    }).catch(function(error) {
      dispatch(submitComposeFail(error));
    });
  };

const submitComposeRequest = () => ({
  type: COMPOSE_SUBMIT_REQUEST,
});

const submitComposeSuccess = (status: APIEntity) => ({
  type: COMPOSE_SUBMIT_SUCCESS,
  status: status,
});

const submitComposeFail = (error: AxiosError) => ({
  type: COMPOSE_SUBMIT_FAIL,
  error: error,
});

const uploadCompose = (files: FileList, intl: IntlShape) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;
    const attachmentLimit = getState().instance.configuration.getIn(['statuses', 'max_media_attachments']) as number;
    const maxImageSize = getState().instance.configuration.getIn(['media_attachments', 'image_size_limit']) as number | undefined;
    const maxVideoSize = getState().instance.configuration.getIn(['media_attachments', 'video_size_limit']) as number | undefined;
    const maxVideoDuration = getState().instance.configuration.getIn(['media_attachments', 'video_duration_limit']) as number | undefined;

    const media  = getState().compose.media_attachments;
    const progress = new Array(files.length).fill(0);
    let total = Array.from(files).reduce((a, v) => a + v.size, 0);

    if (files.length + media.size > attachmentLimit) {
      dispatch(showAlert(undefined, messages.uploadErrorLimit, 'error'));
      return;
    }

    dispatch(uploadComposeRequest());

    Array.from(files).forEach(async(f, i) => {
      if (media.size + i > attachmentLimit - 1) return;

      const isImage = f.type.match(/image.*/);
      const isVideo = f.type.match(/video.*/);
      const videoDurationInSeconds = (isVideo && maxVideoDuration) ? await getVideoDuration(f) : 0;

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
      } else if (isVideo && maxVideoDuration && (videoDurationInSeconds > maxVideoDuration)) {
        const message = intl.formatMessage(messages.exceededVideoDurationLimit, { limit: maxVideoDuration });
        dispatch(snackbar.error(message));
        dispatch(uploadComposeFail(true));
        return;
      }

      // FIXME: Don't define const in loop
      /* eslint-disable no-loop-func */
      resizeImage(f).then(file => {
        const data = new FormData();
        data.append('file', file);
        // Account for disparity in size of original image and resized data
        total += file.size - f.size;

        const onUploadProgress = ({ loaded }: any) => {
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

const changeUploadCompose = (id: string, params: Record<string, any>) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(changeUploadComposeRequest());

    dispatch(updateMedia(id, params)).then(response => {
      dispatch(changeUploadComposeSuccess(response.data));
    }).catch(error => {
      dispatch(changeUploadComposeFail(id, error));
    });
  };

const changeUploadComposeRequest = () => ({
  type: COMPOSE_UPLOAD_CHANGE_REQUEST,
  skipLoading: true,
});

const changeUploadComposeSuccess = (media: APIEntity) => ({
  type: COMPOSE_UPLOAD_CHANGE_SUCCESS,
  media: media,
  skipLoading: true,
});

const changeUploadComposeFail = (id: string, error: AxiosError) => ({
  type: COMPOSE_UPLOAD_CHANGE_FAIL,
  id,
  error: error,
  skipLoading: true,
});

const uploadComposeRequest = () => ({
  type: COMPOSE_UPLOAD_REQUEST,
  skipLoading: true,
});

const uploadComposeProgress = (loaded: number, total: number) => ({
  type: COMPOSE_UPLOAD_PROGRESS,
  loaded: loaded,
  total: total,
});

const uploadComposeSuccess = (media: APIEntity, file: File) => ({
  type: COMPOSE_UPLOAD_SUCCESS,
  media: media,
  file,
  skipLoading: true,
});

const uploadComposeFail = (error: AxiosError | true) => ({
  type: COMPOSE_UPLOAD_FAIL,
  error: error,
  skipLoading: true,
});

const undoUploadCompose = (media_id: string) => ({
  type: COMPOSE_UPLOAD_UNDO,
  media_id: media_id,
});

const clearComposeSuggestions = () => {
  if (cancelFetchComposeSuggestionsAccounts) {
    cancelFetchComposeSuggestionsAccounts();
  }
  return {
    type: COMPOSE_SUGGESTIONS_CLEAR,
  };
};

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

const fetchComposeSuggestionsEmojis = (dispatch: AppDispatch, getState: () => RootState, token: string) => {
  const results = emojiSearch(token.replace(':', ''), { maxResults: 5 } as any);
  dispatch(readyComposeSuggestionsEmojis(token, results));
};

const fetchComposeSuggestionsTags = (dispatch: AppDispatch, getState: () => RootState, token: string) => {
  const state = getState();
  const currentTrends = state.trends.items;

  dispatch(updateSuggestionTags(token, currentTrends));
};

const fetchComposeSuggestions = (token: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
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

const readyComposeSuggestionsEmojis = (token: string, emojis: Emoji[]) => ({
  type: COMPOSE_SUGGESTIONS_READY,
  token,
  emojis,
});

const readyComposeSuggestionsAccounts = (token: string, accounts: APIEntity[]) => ({
  type: COMPOSE_SUGGESTIONS_READY,
  token,
  accounts,
});

const selectComposeSuggestion = (position: number, token: string | null, suggestion: AutoSuggestion, path: Array<string | number>) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    let completion, startPosition;

    if (typeof suggestion === 'object' && suggestion.id) {
      completion    = suggestion.native || suggestion.colons;
      startPosition = position - 1;

      dispatch(useEmoji(suggestion));
    } else if (typeof suggestion === 'string' && suggestion[0] === '#') {
      completion    = suggestion;
      startPosition = position - 1;
    } else {
      completion    = getState().accounts.get(suggestion)!.acct;
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

const updateSuggestionTags = (token: string, currentTrends: ImmutableList<Tag>) => ({
  type: COMPOSE_SUGGESTION_TAGS_UPDATE,
  token,
  currentTrends,
});

const updateTagHistory = (tags: string[]) => ({
  type: COMPOSE_TAG_HISTORY_UPDATE,
  tags,
});

const insertIntoTagHistory = (recognizedTags: APIEntity[], text: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const oldHistory = state.compose.tagHistory;
    const me = state.me;
    const names = recognizedTags
      .filter(tag => text.match(new RegExp(`#${tag.name}`, 'i')))
      .map(tag => tag.name);
    const intersectedOldHistory = oldHistory.filter(name => names.findIndex(newName => newName.toLowerCase() === name.toLowerCase()) === -1);

    names.push(...intersectedOldHistory.toJS());

    const newHistory = names.slice(0, 1000);

    tagHistory.set(me as string, newHistory);
    dispatch(updateTagHistory(newHistory));
  };

const mountCompose = () => ({
  type: COMPOSE_MOUNT,
});

const unmountCompose = () => ({
  type: COMPOSE_UNMOUNT,
});

const changeComposeSensitivity = () => ({
  type: COMPOSE_SENSITIVITY_CHANGE,
});

const changeComposeSpoilerness = () => ({
  type: COMPOSE_SPOILERNESS_CHANGE,
});

const changeComposeContentType = (value: string) => ({
  type: COMPOSE_TYPE_CHANGE,
  value,
});

const changeComposeSpoilerText = (text: string) => ({
  type: COMPOSE_SPOILER_TEXT_CHANGE,
  text,
});

const changeComposeVisibility = (value: string) => ({
  type: COMPOSE_VISIBILITY_CHANGE,
  value,
});

const insertEmojiCompose = (position: number, emoji: string, needsSpace: boolean) => ({
  type: COMPOSE_EMOJI_INSERT,
  position,
  emoji,
  needsSpace,
});

const changeComposing = (value: string) => ({
  type: COMPOSE_COMPOSING_CHANGE,
  value,
});

const addPoll = () => ({
  type: COMPOSE_POLL_ADD,
});

const removePoll = () => ({
  type: COMPOSE_POLL_REMOVE,
});

const addSchedule = () => ({
  type: COMPOSE_SCHEDULE_ADD,
});

const setSchedule = (date: Date) => ({
  type: COMPOSE_SCHEDULE_SET,
  date: date,
});

const removeSchedule = () => ({
  type: COMPOSE_SCHEDULE_REMOVE,
});

const addPollOption = (title: string) => ({
  type: COMPOSE_POLL_OPTION_ADD,
  title,
});

const changePollOption = (index: number, title: string) => ({
  type: COMPOSE_POLL_OPTION_CHANGE,
  index,
  title,
});

const removePollOption = (index: number) => ({
  type: COMPOSE_POLL_OPTION_REMOVE,
  index,
});

const changePollSettings = (expiresIn?: string | number, isMultiple?: boolean) => ({
  type: COMPOSE_POLL_SETTINGS_CHANGE,
  expiresIn,
  isMultiple,
});

const openComposeWithText = (text = '') =>
  (dispatch: AppDispatch) => {
    dispatch(resetCompose());
    dispatch(openModal('COMPOSE'));
    dispatch(changeCompose(text));
  };

const addToMentions = (accountId: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const acct = state.accounts.get(accountId)!.acct;

    return dispatch({
      type: COMPOSE_ADD_TO_MENTIONS,
      account: acct,
    });
  };

const removeFromMentions = (accountId: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const acct = state.accounts.get(accountId)!.acct;

    return dispatch({
      type: COMPOSE_REMOVE_FROM_MENTIONS,
      account: acct,
    });
  };

export {
  COMPOSE_CHANGE,
  COMPOSE_SUBMIT_REQUEST,
  COMPOSE_SUBMIT_SUCCESS,
  COMPOSE_SUBMIT_FAIL,
  COMPOSE_REPLY,
  COMPOSE_REPLY_CANCEL,
  COMPOSE_QUOTE,
  COMPOSE_QUOTE_CANCEL,
  COMPOSE_DIRECT,
  COMPOSE_MENTION,
  COMPOSE_RESET,
  COMPOSE_UPLOAD_REQUEST,
  COMPOSE_UPLOAD_SUCCESS,
  COMPOSE_UPLOAD_FAIL,
  COMPOSE_UPLOAD_PROGRESS,
  COMPOSE_UPLOAD_UNDO,
  COMPOSE_SUGGESTIONS_CLEAR,
  COMPOSE_SUGGESTIONS_READY,
  COMPOSE_SUGGESTION_SELECT,
  COMPOSE_SUGGESTION_TAGS_UPDATE,
  COMPOSE_TAG_HISTORY_UPDATE,
  COMPOSE_MOUNT,
  COMPOSE_UNMOUNT,
  COMPOSE_SENSITIVITY_CHANGE,
  COMPOSE_SPOILERNESS_CHANGE,
  COMPOSE_TYPE_CHANGE,
  COMPOSE_SPOILER_TEXT_CHANGE,
  COMPOSE_VISIBILITY_CHANGE,
  COMPOSE_LISTABILITY_CHANGE,
  COMPOSE_COMPOSING_CHANGE,
  COMPOSE_EMOJI_INSERT,
  COMPOSE_UPLOAD_CHANGE_REQUEST,
  COMPOSE_UPLOAD_CHANGE_SUCCESS,
  COMPOSE_UPLOAD_CHANGE_FAIL,
  COMPOSE_POLL_ADD,
  COMPOSE_POLL_REMOVE,
  COMPOSE_POLL_OPTION_ADD,
  COMPOSE_POLL_OPTION_CHANGE,
  COMPOSE_POLL_OPTION_REMOVE,
  COMPOSE_POLL_SETTINGS_CHANGE,
  COMPOSE_SCHEDULE_ADD,
  COMPOSE_SCHEDULE_SET,
  COMPOSE_SCHEDULE_REMOVE,
  COMPOSE_ADD_TO_MENTIONS,
  COMPOSE_REMOVE_FROM_MENTIONS,
  COMPOSE_SET_STATUS,
  ensureComposeIsVisible,
  setComposeToStatus,
  changeCompose,
  replyCompose,
  replyComposeWithConfirmation,
  cancelReplyCompose,
  quoteCompose,
  cancelQuoteCompose,
  resetCompose,
  mentionCompose,
  directCompose,
  directComposeById,
  handleComposeSubmit,
  submitCompose,
  submitComposeRequest,
  submitComposeSuccess,
  submitComposeFail,
  uploadCompose,
  changeUploadCompose,
  changeUploadComposeRequest,
  changeUploadComposeSuccess,
  changeUploadComposeFail,
  uploadComposeRequest,
  uploadComposeProgress,
  uploadComposeSuccess,
  uploadComposeFail,
  undoUploadCompose,
  clearComposeSuggestions,
  fetchComposeSuggestions,
  readyComposeSuggestionsEmojis,
  readyComposeSuggestionsAccounts,
  selectComposeSuggestion,
  updateSuggestionTags,
  updateTagHistory,
  mountCompose,
  unmountCompose,
  changeComposeSensitivity,
  changeComposeSpoilerness,
  changeComposeContentType,
  changeComposeSpoilerText,
  changeComposeVisibility,
  insertEmojiCompose,
  changeComposing,
  addPoll,
  removePoll,
  addSchedule,
  setSchedule,
  removeSchedule,
  addPollOption,
  changePollOption,
  removePollOption,
  changePollSettings,
  openComposeWithText,
  addToMentions,
  removeFromMentions,
};

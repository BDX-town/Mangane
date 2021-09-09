import api from '../api';
import { importFetchedAccounts, importFetchedStatus } from './importer';
import { favourite, unfavourite } from './interactions';
import { isLoggedIn } from 'soapbox/utils/auth';
import { List as ImmutableList } from 'immutable';

export const EMOJI_REACT_REQUEST = 'EMOJI_REACT_REQUEST';
export const EMOJI_REACT_SUCCESS = 'EMOJI_REACT_SUCCESS';
export const EMOJI_REACT_FAIL    = 'EMOJI_REACT_FAIL';

export const UNEMOJI_REACT_REQUEST = 'UNEMOJI_REACT_REQUEST';
export const UNEMOJI_REACT_SUCCESS = 'UNEMOJI_REACT_SUCCESS';
export const UNEMOJI_REACT_FAIL    = 'UNEMOJI_REACT_FAIL';

export const EMOJI_REACTS_FETCH_REQUEST = 'EMOJI_REACTS_FETCH_REQUEST';
export const EMOJI_REACTS_FETCH_SUCCESS = 'EMOJI_REACTS_FETCH_SUCCESS';
export const EMOJI_REACTS_FETCH_FAIL    = 'EMOJI_REACTS_FETCH_FAIL';

const noOp = () => () => new Promise(f => f());

export const simpleEmojiReact = (status, emoji) => {
  return (dispatch, getState) => {
    const emojiReacts = status.getIn(['pleroma', 'emoji_reactions'], ImmutableList());

    if (emoji === '👍' && status.get('favourited')) return dispatch(unfavourite(status));

    const undo = emojiReacts.filter(e => e.get('me') === true && e.get('name') === emoji).count() > 0;
    if (undo) return dispatch(unEmojiReact(status, emoji));

    return Promise.all(
      emojiReacts
        .filter(emojiReact => emojiReact.get('me') === true)
        .map(emojiReact => dispatch(unEmojiReact(status, emojiReact.get('name')))),
      status.get('favourited') && dispatch(unfavourite(status)),
    ).then(() => {
      if (emoji === '👍') {
        dispatch(favourite(status));
      } else {
        dispatch(emojiReact(status, emoji));
      }
    }).catch(err => {
      console.error(err);
    });
  };
};

export function fetchEmojiReacts(id, emoji) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return dispatch(noOp());

    dispatch(fetchEmojiReactsRequest(id, emoji));

    const url = emoji
      ? `/api/v1/pleroma/statuses/${id}/reactions/${emoji}`
      : `/api/v1/pleroma/statuses/${id}/reactions`;

    return api(getState).get(url).then(response => {
      response.data.forEach(emojiReact => {
        dispatch(importFetchedAccounts(emojiReact.accounts));
      });
      dispatch(fetchEmojiReactsSuccess(id, response.data));
    }).catch(error => {
      dispatch(fetchEmojiReactsFail(id, error));
    });
  };
}

export function emojiReact(status, emoji) {
  return function(dispatch, getState) {
    if (!isLoggedIn(getState)) return dispatch(noOp());

    dispatch(emojiReactRequest(status, emoji));

    return api(getState)
      .put(`/api/v1/pleroma/statuses/${status.get('id')}/reactions/${emoji}`)
      .then(function(response) {
        dispatch(importFetchedStatus(response.data));
        dispatch(emojiReactSuccess(status, emoji));
      }).catch(function(error) {
        dispatch(emojiReactFail(status, emoji, error));
      });
  };
}

export function unEmojiReact(status, emoji) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return dispatch(noOp());

    dispatch(unEmojiReactRequest(status, emoji));

    return api(getState)
      .delete(`/api/v1/pleroma/statuses/${status.get('id')}/reactions/${emoji}`)
      .then(response => {
        dispatch(importFetchedStatus(response.data));
        dispatch(unEmojiReactSuccess(status, emoji));
      }).catch(error => {
        dispatch(unEmojiReactFail(status, emoji, error));
      });
  };
}

export function fetchEmojiReactsRequest(id, emoji) {
  return {
    type: EMOJI_REACTS_FETCH_REQUEST,
    id,
    emoji,
  };
}

export function fetchEmojiReactsSuccess(id, emojiReacts) {
  return {
    type: EMOJI_REACTS_FETCH_SUCCESS,
    id,
    emojiReacts,
  };
}

export function fetchEmojiReactsFail(id, error) {
  return {
    type: EMOJI_REACTS_FETCH_FAIL,
    error,
  };
}

export function emojiReactRequest(status, emoji) {
  return {
    type: EMOJI_REACT_REQUEST,
    status,
    emoji,
    skipLoading: true,
  };
}

export function emojiReactSuccess(status, emoji) {
  return {
    type: EMOJI_REACT_SUCCESS,
    status,
    emoji,
    skipLoading: true,
  };
}

export function emojiReactFail(status, emoji, error) {
  return {
    type: EMOJI_REACT_FAIL,
    status,
    emoji,
    error,
    skipLoading: true,
  };
}

export function unEmojiReactRequest(status, emoji) {
  return {
    type: UNEMOJI_REACT_REQUEST,
    status,
    emoji,
    skipLoading: true,
  };
}

export function unEmojiReactSuccess(status, emoji) {
  return {
    type: UNEMOJI_REACT_SUCCESS,
    status,
    emoji,
    skipLoading: true,
  };
}

export function unEmojiReactFail(status, emoji, error) {
  return {
    type: UNEMOJI_REACT_FAIL,
    status,
    emoji,
    error,
    skipLoading: true,
  };
}

import api from '../api';
import { deleteFromTimelines } from './timelines';
import { importFetchedStatus, importFetchedStatuses, importAccount, importStatus } from './importer';
import { openModal } from './modal';
import { isLoggedIn } from 'soapbox/utils/auth';

export const STATUS_CREATE_REQUEST = 'STATUS_CREATE_REQUEST';
export const STATUS_CREATE_SUCCESS = 'STATUS_CREATE_SUCCESS';
export const STATUS_CREATE_FAIL    = 'STATUS_CREATE_FAIL';

export const STATUS_FETCH_REQUEST = 'STATUS_FETCH_REQUEST';
export const STATUS_FETCH_SUCCESS = 'STATUS_FETCH_SUCCESS';
export const STATUS_FETCH_FAIL    = 'STATUS_FETCH_FAIL';

export const STATUS_DELETE_REQUEST = 'STATUS_DELETE_REQUEST';
export const STATUS_DELETE_SUCCESS = 'STATUS_DELETE_SUCCESS';
export const STATUS_DELETE_FAIL    = 'STATUS_DELETE_FAIL';

export const CONTEXT_FETCH_REQUEST = 'CONTEXT_FETCH_REQUEST';
export const CONTEXT_FETCH_SUCCESS = 'CONTEXT_FETCH_SUCCESS';
export const CONTEXT_FETCH_FAIL    = 'CONTEXT_FETCH_FAIL';

export const STATUS_MUTE_REQUEST = 'STATUS_MUTE_REQUEST';
export const STATUS_MUTE_SUCCESS = 'STATUS_MUTE_SUCCESS';
export const STATUS_MUTE_FAIL    = 'STATUS_MUTE_FAIL';

export const STATUS_UNMUTE_REQUEST = 'STATUS_UNMUTE_REQUEST';
export const STATUS_UNMUTE_SUCCESS = 'STATUS_UNMUTE_SUCCESS';
export const STATUS_UNMUTE_FAIL    = 'STATUS_UNMUTE_FAIL';

export const STATUS_REVEAL = 'STATUS_REVEAL';
export const STATUS_HIDE   = 'STATUS_HIDE';

export const REDRAFT = 'REDRAFT';

export function fetchStatusRequest(id, skipLoading) {
  return {
    type: STATUS_FETCH_REQUEST,
    id,
    skipLoading,
  };
};

export function createStatus(params, idempotencyKey) {
  return (dispatch, getState) => {
    dispatch({ type: STATUS_CREATE_REQUEST, params, idempotencyKey });

    return api(getState).post('/api/v1/statuses', params, {
      headers: { 'Idempotency-Key': idempotencyKey },
    }).then(({ data: status }) => {
      dispatch({ type: STATUS_CREATE_SUCCESS, status, params, idempotencyKey });
      return status;
    }).catch(error => {
      dispatch({ type: STATUS_CREATE_FAIL, error, params, idempotencyKey });
      throw error;
    });
  };
};

export function fetchStatus(id) {
  return (dispatch, getState) => {
    const skipLoading = getState().getIn(['statuses', id], null) !== null;

    dispatch(fetchContext(id));

    if (skipLoading) {
      return;
    }

    dispatch(fetchStatusRequest(id, skipLoading));

    api(getState).get(`/api/v1/statuses/${id}`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(fetchStatusSuccess(response.data, skipLoading));
    }).catch(error => {
      dispatch(fetchStatusFail(id, error, skipLoading));
    });
  };
};

export function fetchStatusSuccess(status, skipLoading) {
  return {
    type: STATUS_FETCH_SUCCESS,
    status,
    skipLoading,
  };
};

export function fetchStatusFail(id, error, skipLoading) {
  return {
    type: STATUS_FETCH_FAIL,
    id,
    error,
    skipLoading,
    skipAlert: true,
  };
};

export function redraft(status, raw_text) {
  return {
    type: REDRAFT,
    status,
    raw_text,
  };
};

export function deleteStatus(id, routerHistory, withRedraft = false) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    let status = getState().getIn(['statuses', id]);

    if (status.get('poll')) {
      status = status.set('poll', getState().getIn(['polls', status.get('poll')]));
    }

    dispatch(deleteStatusRequest(id));

    api(getState).delete(`/api/v1/statuses/${id}`).then(response => {
      dispatch(deleteStatusSuccess(id));
      dispatch(deleteFromTimelines(id));

      if (withRedraft) {
        dispatch(redraft(status, response.data.text));
        dispatch(openModal('COMPOSE'));
      }
    }).catch(error => {
      dispatch(deleteStatusFail(id, error));
    });
  };
};

export function deleteStatusRequest(id) {
  return {
    type: STATUS_DELETE_REQUEST,
    id: id,
  };
};

export function deleteStatusSuccess(id) {
  return {
    type: STATUS_DELETE_SUCCESS,
    id: id,
  };
};

export function deleteStatusFail(id, error) {
  return {
    type: STATUS_DELETE_FAIL,
    id: id,
    error: error,
  };
};

export function fetchContext(id) {
  return (dispatch, getState) => {
    dispatch(fetchContextRequest(id));

    api(getState).get(`/api/v1/statuses/${id}/context`).then(response => {
      dispatch(importFetchedStatuses(response.data.ancestors.concat(response.data.descendants)));
      dispatch(fetchContextSuccess(id, response.data.ancestors, response.data.descendants));

    }).catch(error => {
      if (error.response && error.response.status === 404) {
        dispatch(deleteFromTimelines(id));
      }

      dispatch(fetchContextFail(id, error));
    });
  };
};

export function fetchContextRequest(id) {
  return {
    type: CONTEXT_FETCH_REQUEST,
    id,
  };
};

export function fetchContextSuccess(id, ancestors, descendants) {
  return {
    type: CONTEXT_FETCH_SUCCESS,
    id,
    ancestors,
    descendants,
  };
};

export function fetchContextFail(id, error) {
  return {
    type: CONTEXT_FETCH_FAIL,
    id,
    error,
    skipAlert: true,
  };
};

export function muteStatus(id) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(muteStatusRequest(id));

    api(getState).post(`/api/v1/statuses/${id}/mute`).then(() => {
      dispatch(muteStatusSuccess(id));
    }).catch(error => {
      dispatch(muteStatusFail(id, error));
    });
  };
};

export function muteStatusRequest(id) {
  return {
    type: STATUS_MUTE_REQUEST,
    id,
  };
};

export function muteStatusSuccess(id) {
  return {
    type: STATUS_MUTE_SUCCESS,
    id,
  };
};

export function muteStatusFail(id, error) {
  return {
    type: STATUS_MUTE_FAIL,
    id,
    error,
  };
};

export function unmuteStatus(id) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(unmuteStatusRequest(id));

    api(getState).post(`/api/v1/statuses/${id}/unmute`).then(() => {
      dispatch(unmuteStatusSuccess(id));
    }).catch(error => {
      dispatch(unmuteStatusFail(id, error));
    });
  };
};

export function unmuteStatusRequest(id) {
  return {
    type: STATUS_UNMUTE_REQUEST,
    id,
  };
};

export function unmuteStatusSuccess(id) {
  return {
    type: STATUS_UNMUTE_SUCCESS,
    id,
  };
};

export function unmuteStatusFail(id, error) {
  return {
    type: STATUS_UNMUTE_FAIL,
    id,
    error,
  };
};

export function hideStatus(ids) {
  if (!Array.isArray(ids)) {
    ids = [ids];
  }

  return {
    type: STATUS_HIDE,
    ids,
  };
};

export function revealStatus(ids) {
  if (!Array.isArray(ids)) {
    ids = [ids];
  }

  return {
    type: STATUS_REVEAL,
    ids,
  };
};

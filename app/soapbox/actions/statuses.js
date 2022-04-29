import { isLoggedIn } from 'soapbox/utils/auth';
import { getFeatures } from 'soapbox/utils/features';
import { shouldHaveCard } from 'soapbox/utils/status';

import api, { getNextLink } from '../api';

import { setComposeToStatus } from './compose';
import { importFetchedStatus, importFetchedStatuses } from './importer';
import { openModal } from './modals';
import { deleteFromTimelines } from './timelines';

export const STATUS_CREATE_REQUEST = 'STATUS_CREATE_REQUEST';
export const STATUS_CREATE_SUCCESS = 'STATUS_CREATE_SUCCESS';
export const STATUS_CREATE_FAIL    = 'STATUS_CREATE_FAIL';

export const STATUS_FETCH_SOURCE_REQUEST = 'STATUS_FETCH_SOURCE_REQUEST';
export const STATUS_FETCH_SOURCE_SUCCESS = 'STATUS_FETCH_SOURCE_SUCCESS';
export const STATUS_FETCH_SOURCE_FAIL    = 'STATUS_FETCH_SOURCE_FAIL';

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

const statusExists = (getState, statusId) => {
  return getState().getIn(['statuses', statusId], null) !== null;
};

export function createStatus(params, idempotencyKey, statusId) {
  return (dispatch, getState) => {
    dispatch({ type: STATUS_CREATE_REQUEST, params, idempotencyKey });

    return api(getState).request({
      url: statusId === null ? '/api/v1/statuses' : `/api/v1/statuses/${statusId}`,
      method: statusId === null ? 'post' : 'put',
      data: params,
      headers: { 'Idempotency-Key': idempotencyKey },
    }).then(({ data: status }) => {
      // The backend might still be processing the rich media attachment
      if (!status.card && shouldHaveCard(status)) {
        status.expectsCard = true;
      }

      dispatch(importFetchedStatus(status, idempotencyKey));
      dispatch({ type: STATUS_CREATE_SUCCESS, status, params, idempotencyKey });

      // Poll the backend for the updated card
      if (status.expectsCard) {
        const delay = 1000;

        const poll = (retries = 5) => {
          api(getState).get(`/api/v1/statuses/${status.id}`).then(response => {
            if (response.data?.card) {
              dispatch(importFetchedStatus(response.data));
            } else if (retries > 0 && response.status === 200) {
              setTimeout(() => poll(retries - 1), delay);
            }
          }).catch(console.error);
        };

        setTimeout(() => poll(), delay);
      }

      return status;
    }).catch(error => {
      dispatch({ type: STATUS_CREATE_FAIL, error, params, idempotencyKey });
      throw error;
    });
  };
}

export const editStatus = (id) => (dispatch, getState) => {
  let status = getState().getIn(['statuses', id]);

  if (status.get('poll')) {
    status = status.set('poll', getState().getIn(['polls', status.get('poll')]));
  }

  dispatch({ type: STATUS_FETCH_SOURCE_REQUEST });

  api(getState).get(`/api/v1/statuses/${id}/source`).then(response => {
    dispatch({ type: STATUS_FETCH_SOURCE_SUCCESS });
    dispatch(setComposeToStatus(status, response.data.text, response.data.spoiler_text));
    dispatch(openModal('COMPOSE'));
  }).catch(error => {
    dispatch({ type: STATUS_FETCH_SOURCE_FAIL, error });

  });
};

export function fetchStatus(id) {
  return (dispatch, getState) => {
    const skipLoading = statusExists(getState, id);

    dispatch({ type: STATUS_FETCH_REQUEST, id, skipLoading });

    return api(getState).get(`/api/v1/statuses/${id}`).then(({ data: status }) => {
      dispatch(importFetchedStatus(status));
      dispatch({ type: STATUS_FETCH_SUCCESS, status, skipLoading });
      return status;
    }).catch(error => {
      dispatch({ type: STATUS_FETCH_FAIL, id, error, skipLoading, skipAlert: true });
    });
  };
}

export function deleteStatus(id, routerHistory, withRedraft = false) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    let status = getState().getIn(['statuses', id]);

    if (status.get('poll')) {
      status = status.set('poll', getState().getIn(['polls', status.get('poll')]));
    }

    dispatch({ type: STATUS_DELETE_REQUEST, id });

    api(getState).delete(`/api/v1/statuses/${id}`).then(response => {
      dispatch({ type: STATUS_DELETE_SUCCESS, id });
      dispatch(deleteFromTimelines(id));

      if (withRedraft) {
        dispatch(setComposeToStatus(status, response.data.text, response.data.spoiler_text, response.data.pleroma?.content_type));
        dispatch(openModal('COMPOSE'));
      }
    }).catch(error => {
      dispatch({ type: STATUS_DELETE_FAIL, id, error });
    });
  };
}

export const updateStatus = status => dispatch =>
  dispatch(importFetchedStatus(status));

export function fetchContext(id) {
  return (dispatch, getState) => {
    dispatch({ type: CONTEXT_FETCH_REQUEST, id });

    return api(getState).get(`/api/v1/statuses/${id}/context`).then(({ data: context }) => {
      if (Array.isArray(context)) {
        // Mitra: returns a list of statuses
        dispatch(importFetchedStatuses(context));
      } else if (typeof context === 'object') {
        // Standard Mastodon API returns a map with `ancestors` and `descendants`
        const { ancestors, descendants } = context;
        const statuses = ancestors.concat(descendants);
        dispatch(importFetchedStatuses(statuses));
        dispatch({ type: CONTEXT_FETCH_SUCCESS, id, ancestors, descendants });
      } else {
        throw context;
      }
      return context;
    }).catch(error => {
      if (error.response?.status === 404) {
        dispatch(deleteFromTimelines(id));
      }

      dispatch({ type: CONTEXT_FETCH_FAIL, id, error, skipAlert: true });
    });
  };
}

export function fetchNext(next) {
  return async(dispatch, getState) => {
    const response = await api(getState).get(next);
    dispatch(importFetchedStatuses(response.data));
    return { next: getNextLink(response) };
  };
}

export function fetchAncestors(id) {
  return async(dispatch, getState) => {
    const response = await api(getState).get(`/api/v1/statuses/${id}/context/ancestors`);
    dispatch(importFetchedStatuses(response.data));
    return response;
  };
}

export function fetchDescendants(id) {
  return async(dispatch, getState) => {
    const response = await api(getState).get(`/api/v1/statuses/${id}/context/descendants`);
    dispatch(importFetchedStatuses(response.data));
    return response;
  };
}

export function fetchStatusWithContext(id) {
  return async(dispatch, getState) => {
    const features = getFeatures(getState().instance);

    if (features.paginatedContext) {
      const responses = await Promise.all([
        dispatch(fetchAncestors(id)),
        dispatch(fetchDescendants(id)),
        dispatch(fetchStatus(id)),
      ]);
      const next = getNextLink(responses[1]);
      return { next };
    } else {
      await Promise.all([
        dispatch(fetchContext(id)),
        dispatch(fetchStatus(id)),
      ]);
      return { next: undefined };
    }
  };
}

export function muteStatus(id) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    dispatch({ type: STATUS_MUTE_REQUEST, id });
    api(getState).post(`/api/v1/statuses/${id}/mute`).then(() => {
      dispatch({ type: STATUS_MUTE_SUCCESS, id });
    }).catch(error => {
      dispatch({ type: STATUS_MUTE_FAIL, id, error });
    });
  };
}

export function unmuteStatus(id) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    dispatch({ type: STATUS_UNMUTE_REQUEST, id });
    api(getState).post(`/api/v1/statuses/${id}/unmute`).then(() => {
      dispatch({ type: STATUS_UNMUTE_SUCCESS, id });
    }).catch(error => {
      dispatch({ type: STATUS_UNMUTE_FAIL, id, error });
    });
  };
}

export function hideStatus(ids) {
  if (!Array.isArray(ids)) {
    ids = [ids];
  }

  return {
    type: STATUS_HIDE,
    ids,
  };
}

export function revealStatus(ids) {
  if (!Array.isArray(ids)) {
    ids = [ids];
  }

  return {
    type: STATUS_REVEAL,
    ids,
  };
}

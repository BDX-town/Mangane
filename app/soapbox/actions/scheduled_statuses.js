import api, { getLinks } from '../api';

export const SCHEDULED_STATUSES_FETCH_REQUEST = 'SCHEDULED_STATUSES_FETCH_REQUEST';
export const SCHEDULED_STATUSES_FETCH_SUCCESS = 'SCHEDULED_STATUSES_FETCH_SUCCESS';
export const SCHEDULED_STATUSES_FETCH_FAIL    = 'SCHEDULED_STATUSES_FETCH_FAIL';

export const SCHEDULED_STATUSES_EXPAND_REQUEST = 'SCHEDULED_STATUSES_EXPAND_REQUEST';
export const SCHEDULED_STATUSES_EXPAND_SUCCESS = 'SCHEDULED_STATUSES_EXPAND_SUCCESS';
export const SCHEDULED_STATUSES_EXPAND_FAIL    = 'SCHEDULED_STATUSES_EXPAND_FAIL';

export const SCHEDULED_STATUS_CANCEL_REQUEST = 'SCHEDULED_STATUS_CANCEL_REQUEST';
export const SCHEDULED_STATUS_CANCEL_SUCCESS = 'SCHEDULED_STATUS_CANCEL_SUCCESS';
export const SCHEDULED_STATUS_CANCEL_FAIL    = 'SCHEDULED_STATUS_CANCEL_FAIL';

export function fetchScheduledStatuses() {
  return (dispatch, getState) => {
    if (getState().getIn(['status_lists', 'scheduled_statuses', 'isLoading'])) {
      return;
    }

    dispatch(fetchScheduledStatusesRequest());

    api(getState).get('/api/v1/scheduled_statuses').then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(fetchScheduledStatusesSuccess(response.data, next ? next.uri : null));
    }).catch(error => {
      dispatch(fetchScheduledStatusesFail(error));
    });
  };
}

export function cancelScheduledStatus(id) {
  return (dispatch, getState) => {
    dispatch({ type: SCHEDULED_STATUS_CANCEL_REQUEST, id });
    api(getState).delete(`/api/v1/scheduled_statuses/${id}`).then(({ data }) => {
      dispatch({ type: SCHEDULED_STATUS_CANCEL_SUCCESS, id, data });
    }).catch(error => {
      dispatch({ type: SCHEDULED_STATUS_CANCEL_FAIL, id, error });
    });
  };
}

export function fetchScheduledStatusesRequest() {
  return {
    type: SCHEDULED_STATUSES_FETCH_REQUEST,
  };
}

export function fetchScheduledStatusesSuccess(statuses, next) {
  return {
    type: SCHEDULED_STATUSES_FETCH_SUCCESS,
    statuses,
    next,
  };
}

export function fetchScheduledStatusesFail(error) {
  return {
    type: SCHEDULED_STATUSES_FETCH_FAIL,
    error,
  };
}

export function expandScheduledStatuses() {
  return (dispatch, getState) => {
    const url = getState().getIn(['status_lists', 'scheduled_statuses', 'next'], null);

    if (url === null || getState().getIn(['status_lists', 'scheduled_statuses', 'isLoading'])) {
      return;
    }

    dispatch(expandScheduledStatusesRequest());

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(expandScheduledStatusesSuccess(response.data, next ? next.uri : null));
    }).catch(error => {
      dispatch(expandScheduledStatusesFail(error));
    });
  };
}

export function expandScheduledStatusesRequest() {
  return {
    type: SCHEDULED_STATUSES_EXPAND_REQUEST,
  };
}

export function expandScheduledStatusesSuccess(statuses, next) {
  return {
    type: SCHEDULED_STATUSES_EXPAND_SUCCESS,
    statuses,
    next,
  };
}

export function expandScheduledStatusesFail(error) {
  return {
    type: SCHEDULED_STATUSES_EXPAND_FAIL,
    error,
  };
}

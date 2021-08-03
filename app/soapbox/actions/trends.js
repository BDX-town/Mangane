import api from '../api';

export const TRENDS_FETCH_REQUEST = 'TRENDS_FETCH_REQUEST';
export const TRENDS_FETCH_SUCCESS = 'TRENDS_FETCH_SUCCESS';
export const TRENDS_FETCH_FAIL    = 'TRENDS_FETCH_FAIL';

export function fetchTrends() {
  return (dispatch, getState) => {
    dispatch(fetchTrendsRequest());

    api(getState).get('/api/v1/trends').then(response => {
      dispatch(fetchTrendsSuccess(response.data));
    }).catch(error => dispatch(fetchTrendsFail(error)));
  };
}

export function fetchTrendsRequest() {
  return {
    type: TRENDS_FETCH_REQUEST,
    skipLoading: true,
  };
}

export function fetchTrendsSuccess(tags) {
  return {
    type: TRENDS_FETCH_SUCCESS,
    tags,
    skipLoading: true,
  };
}

export function fetchTrendsFail(error) {
  return {
    type: TRENDS_FETCH_FAIL,
    error,
    skipLoading: true,
    skipAlert: true,
  };
}

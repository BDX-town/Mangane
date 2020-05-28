import api from '../api';

export const FETCH_MARKERS_REQUEST = 'FETCH_MARKERS_REQUEST';
export const FETCH_MARKERS_SUCCESS = 'FETCH_MARKERS_SUCCESS';
export const FETCH_MARKERS_FAIL    = 'FETCH_MARKERS_FAIL';

export const SAVE_MARKERS_REQUEST = 'SAVE_MARKERS_REQUEST';
export const SAVE_MARKERS_SUCCESS = 'SAVE_MARKERS_SUCCESS';
export const SAVE_MARKERS_FAIL    = 'SAVE_MARKERS_FAIL';

export function fetchMarkers(timeline) {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_MARKERS_REQUEST });
    return api(getState).get('/api/v1/markers', {
      params: { timeline },
    }).then(response => {
      dispatch({ type: FETCH_MARKERS_SUCCESS, markers: response.data });
    }).catch(error => {
      dispatch({ type: FETCH_MARKERS_FAIL, error });
    });
  };
}

export function saveMarkers(params) {
  return (dispatch, getState) => {
    dispatch({ type: SAVE_MARKERS_REQUEST });
    return api(getState).post('/api/v1/markers', params).then(response => {
      dispatch({ type: SAVE_MARKERS_SUCCESS, markers: response.data });
    }).catch(error => {
      dispatch({ type: SAVE_MARKERS_FAIL, error });
    });
  };
}

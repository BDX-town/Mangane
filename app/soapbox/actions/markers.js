import api from '../api';

export const MARKER_FETCH_REQUEST = 'MARKER_FETCH_REQUEST';
export const MARKER_FETCH_SUCCESS = 'MARKER_FETCH_SUCCESS';
export const MARKER_FETCH_FAIL    = 'MARKER_FETCH_FAIL';

export const MARKER_SAVE_REQUEST = 'MARKER_SAVE_REQUEST';
export const MARKER_SAVE_SUCCESS = 'MARKER_SAVE_SUCCESS';
export const MARKER_SAVE_FAIL    = 'MARKER_SAVE_FAIL';

export function fetchMarker(timeline) {
  return (dispatch, getState) => {
    dispatch({ type: MARKER_FETCH_REQUEST });
    return api(getState).get('/api/v1/markers', {
      params: { timeline },
    }).then(({ data: marker }) => {
      dispatch({ type: MARKER_FETCH_SUCCESS, marker });
    }).catch(error => {
      dispatch({ type: MARKER_FETCH_FAIL, error });
    });
  };
}

export function saveMarker(marker) {
  return (dispatch, getState) => {
    dispatch({ type: MARKER_SAVE_REQUEST, marker });
    return api(getState).post('/api/v1/markers', marker).then(({ data: marker }) => {
      dispatch({ type: MARKER_SAVE_SUCCESS, marker });
    }).catch(error => {
      dispatch({ type: MARKER_SAVE_FAIL, error });
    });
  };
}

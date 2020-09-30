import api from '../api';
import snackbar from 'soapbox/actions/snackbar';

export const IMPORT_FOLLOWS_REQUEST = 'IMPORT_FOLLOWS_REQUEST';
export const IMPORT_FOLLOWS_SUCCESS = 'IMPORT_FOLLOWS_SUCCESS';
export const IMPORT_FOLLOWS_FAIL    = 'IMPORT_FOLLOWS_FAIL';

export const IMPORT_BLOCKS_REQUEST = 'IMPORT_BLOCKS_REQUEST';
export const IMPORT_BLOCKS_SUCCESS = 'IMPORT_BLOCKS_SUCCESS';
export const IMPORT_BLOCKS_FAIL    = 'IMPORT_BLOCKS_FAIL';

export const IMPORT_MUTES_REQUEST = 'IMPORT_MUTES_REQUEST';
export const IMPORT_MUTES_SUCCESS = 'IMPORT_MUTES_SUCCESS';
export const IMPORT_MUTES_FAIL    = 'IMPORT_MUTES_FAIL';

export function importFollows(params) {
  return (dispatch, getState) => {
    dispatch({ type: IMPORT_FOLLOWS_REQUEST });
    return api(getState)
      .post('/api/pleroma/follow_import', params)
      .then(response => {
        dispatch(snackbar.success('Followers imported successfully'));
        dispatch({ type: IMPORT_FOLLOWS_SUCCESS, config: response.data });
      }).catch(error => {
        dispatch({ type: IMPORT_FOLLOWS_FAIL, error });
      });
  };
}

export function importBlocks(params) {
  return (dispatch, getState) => {
    dispatch({ type: IMPORT_BLOCKS_REQUEST });
    return api(getState)
      .post('/api/pleroma/blocks_import', params)
      .then(response => {
        dispatch(snackbar.success('Blocks imported successfully'));
        dispatch({ type: IMPORT_BLOCKS_SUCCESS, config: response.data });
      }).catch(error => {
        dispatch({ type: IMPORT_BLOCKS_FAIL, error });
      });
  };
}

export function importMutes(params) {
  return (dispatch, getState) => {
    dispatch({ type: IMPORT_MUTES_REQUEST });
    return api(getState)
      .post('/api/pleroma/mutes_import', params)
      .then(response => {
        dispatch(snackbar.success('Mutes imported successfully'));
        dispatch({ type: IMPORT_MUTES_SUCCESS, config: response.data });
      }).catch(error => {
        dispatch({ type: IMPORT_MUTES_FAIL, error });
      });
  };
}

import api from '../api';
import { showAlert } from 'soapbox/actions/alerts';

export const IMPORT_FOLLOWS_REQUEST = 'IMPORT_FOLLOWS_REQUEST';
export const IMPORT_FOLLOWS_SUCCESS = 'IMPORT_FOLLOWS_SUCCESS';
export const IMPORT_FOLLOWS_FAIL    = 'IMPORT_FOLLOWS_FAIL';

export function importFollows(params) {
  return (dispatch, getState) => {
    dispatch({ type: IMPORT_FOLLOWS_REQUEST });
    return api(getState)
      .post('/api/pleroma/follow_import', params)
      .then(response => {
        dispatch(showAlert('', 'Followers imported successfully'));
        dispatch({ type: IMPORT_FOLLOWS_SUCCESS, config: response.data });
      }).catch(error => {
        dispatch({ type: IMPORT_FOLLOWS_FAIL, error });
      });
  };
}

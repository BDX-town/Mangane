import api from '../api';

export const IMPORT_FOLLOWS_REQUEST = 'IMPORT_FOLLOWS_REQUEST';
export const IMPORT_FOLLOWS_SUCCESS = 'IMPORT_FOLLOWS_SUCCESS';
export const IMPORT_FOLLOWS_FAIL    = 'IMPORT_FOLLOWS_FAIL';

function whiteSpace(params) {
  const follows = params.replace(/\n/g, ' ');
  return follows;
};

export function importFollows(params) {
  return (dispatch, getState) => {
    dispatch({ type: IMPORT_FOLLOWS_REQUEST });
    return api(getState)
      .post('/api/pleroma/follow_import', whiteSpace(params))
      .then(response => {
        dispatch({ type: IMPORT_FOLLOWS_SUCCESS, config: response.data });
      }).catch(error => {
        dispatch({ type: IMPORT_FOLLOWS_FAIL, error });
      });
  };
}

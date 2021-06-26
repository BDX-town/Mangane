import { defineMessages } from 'react-intl';
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

const messages = defineMessages({
  blocksSuccess: { id: 'import_data.success.blocks', defaultMessage: 'Blocks imported successfully' },
  followersSuccess: { id: 'import_data.success.followers', defaultMessage: 'Followers imported successfully' },
  mutesSuccess: { id: 'import_data.success.mutes', defaultMessage: 'Mutes imported successfully' },
});

export function importFollows(intl, params) {
  return (dispatch, getState) => {
    dispatch({ type: IMPORT_FOLLOWS_REQUEST });
    return api(getState)
      .post('/api/pleroma/follow_import', params)
      .then(response => {
        dispatch(snackbar.success(intl.formatMessage(messages.followersSuccess)));
        dispatch({ type: IMPORT_FOLLOWS_SUCCESS, config: response.data });
      }).catch(error => {
        dispatch({ type: IMPORT_FOLLOWS_FAIL, error });
      });
  };
}

export function importBlocks(intl, params) {
  return (dispatch, getState) => {
    dispatch({ type: IMPORT_BLOCKS_REQUEST });
    return api(getState)
      .post('/api/pleroma/blocks_import', params)
      .then(response => {
        dispatch(snackbar.success(intl.formatMessage(messages.blocksSuccess)));
        dispatch({ type: IMPORT_BLOCKS_SUCCESS, config: response.data });
      }).catch(error => {
        dispatch({ type: IMPORT_BLOCKS_FAIL, error });
      });
  };
}

export function importMutes(intl, params) {
  return (dispatch, getState) => {
    dispatch({ type: IMPORT_MUTES_REQUEST });
    return api(getState)
      .post('/api/pleroma/mutes_import', params)
      .then(response => {
        dispatch(snackbar.success(intl.formatMessage(messages.mutesSuccess)));
        dispatch({ type: IMPORT_MUTES_SUCCESS, config: response.data });
      }).catch(error => {
        dispatch({ type: IMPORT_MUTES_FAIL, error });
      });
  };
}

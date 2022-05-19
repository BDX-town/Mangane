import { defineMessages } from 'react-intl';

import snackbar from 'soapbox/actions/snackbar';

import api from '../api';

import type { SnackbarAction } from './snackbar';
import type { RootState } from 'soapbox/store';

export const IMPORT_FOLLOWS_REQUEST = 'IMPORT_FOLLOWS_REQUEST';
export const IMPORT_FOLLOWS_SUCCESS = 'IMPORT_FOLLOWS_SUCCESS';
export const IMPORT_FOLLOWS_FAIL    = 'IMPORT_FOLLOWS_FAIL';

export const IMPORT_BLOCKS_REQUEST = 'IMPORT_BLOCKS_REQUEST';
export const IMPORT_BLOCKS_SUCCESS = 'IMPORT_BLOCKS_SUCCESS';
export const IMPORT_BLOCKS_FAIL    = 'IMPORT_BLOCKS_FAIL';

export const IMPORT_MUTES_REQUEST = 'IMPORT_MUTES_REQUEST';
export const IMPORT_MUTES_SUCCESS = 'IMPORT_MUTES_SUCCESS';
export const IMPORT_MUTES_FAIL    = 'IMPORT_MUTES_FAIL';

type ImportDataActions = {
  type: typeof IMPORT_FOLLOWS_REQUEST
  | typeof IMPORT_FOLLOWS_SUCCESS
  | typeof IMPORT_FOLLOWS_FAIL
  | typeof IMPORT_BLOCKS_REQUEST
  | typeof IMPORT_BLOCKS_SUCCESS
  | typeof IMPORT_BLOCKS_FAIL
  | typeof IMPORT_MUTES_REQUEST
  | typeof IMPORT_MUTES_SUCCESS
  | typeof IMPORT_MUTES_FAIL,
  error?: any,
  config?: string
} | SnackbarAction

const messages = defineMessages({
  blocksSuccess: { id: 'import_data.success.blocks', defaultMessage: 'Blocks imported successfully' },
  followersSuccess: { id: 'import_data.success.followers', defaultMessage: 'Followers imported successfully' },
  mutesSuccess: { id: 'import_data.success.mutes', defaultMessage: 'Mutes imported successfully' },
});

export const importFollows = (params: FormData) =>
  (dispatch: React.Dispatch<ImportDataActions>, getState: () => RootState) => {
    dispatch({ type: IMPORT_FOLLOWS_REQUEST });
    return api(getState)
      .post('/api/pleroma/follow_import', params)
      .then(response => {
        dispatch(snackbar.success(messages.followersSuccess));
        dispatch({ type: IMPORT_FOLLOWS_SUCCESS, config: response.data });
      }).catch(error => {
        dispatch({ type: IMPORT_FOLLOWS_FAIL, error });
      });
  };

export const importBlocks = (params: FormData) =>
  (dispatch: React.Dispatch<ImportDataActions>, getState: () => RootState) => {
    dispatch({ type: IMPORT_BLOCKS_REQUEST });
    return api(getState)
      .post('/api/pleroma/blocks_import', params)
      .then(response => {
        dispatch(snackbar.success(messages.blocksSuccess));
        dispatch({ type: IMPORT_BLOCKS_SUCCESS, config: response.data });
      }).catch(error => {
        dispatch({ type: IMPORT_BLOCKS_FAIL, error });
      });
  };

export const importMutes = (params: FormData) =>
  (dispatch: React.Dispatch<ImportDataActions>, getState: () => RootState) => {
    dispatch({ type: IMPORT_MUTES_REQUEST });
    return api(getState)
      .post('/api/pleroma/mutes_import', params)
      .then(response => {
        dispatch(snackbar.success(messages.mutesSuccess));
        dispatch({ type: IMPORT_MUTES_SUCCESS, config: response.data });
      }).catch(error => {
        dispatch({ type: IMPORT_MUTES_FAIL, error });
      });
  };

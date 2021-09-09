import { defineMessages } from 'react-intl';
import snackbar from 'soapbox/actions/snackbar';
import api, { getLinks } from '../api';

export const EXPORT_FOLLOWS_REQUEST = 'EXPORT_FOLLOWS_REQUEST';
export const EXPORT_FOLLOWS_SUCCESS = 'EXPORT_FOLLOWS_SUCCESS';
export const EXPORT_FOLLOWS_FAIL    = 'EXPORT_FOLLOWS_FAIL';

export const EXPORT_BLOCKS_REQUEST = 'EXPORT_BLOCKS_REQUEST';
export const EXPORT_BLOCKS_SUCCESS = 'EXPORT_BLOCKS_SUCCESS';
export const EXPORT_BLOCKS_FAIL    = 'EXPORT_BLOCKS_FAIL';

export const EXPORT_MUTES_REQUEST = 'EXPORT_MUTES_REQUEST';
export const EXPORT_MUTES_SUCCESS = 'EXPORT_MUTES_SUCCESS';
export const EXPORT_MUTES_FAIL    = 'EXPORT_MUTES_FAIL';

const messages = defineMessages({
  blocksSuccess: { id: 'export_data.success.blocks', defaultMessage: 'Blocks exported successfully' },
  followersSuccess: { id: 'export_data.success.followers', defaultMessage: 'Followers exported successfully' },
  mutesSuccess: { id: 'export_data.success.mutes', defaultMessage: 'Mutes exported successfully' },
});

function fileExport(content, fileName) {
  const fileToDownload = document.createElement('a');

  fileToDownload.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(content));
  fileToDownload.setAttribute('download', fileName);
  fileToDownload.style.display = 'none';
  document.body.appendChild(fileToDownload);
  fileToDownload.click();
  document.body.removeChild(fileToDownload);
}

function listAccounts(state) {
  return async apiResponse => {
    const followings = apiResponse.data;
    let accounts = [];
    let next = getLinks(apiResponse).refs.find(link => link.rel === 'next');
    while (next) {
      apiResponse = await api(state).get(next.uri);
      next = getLinks(apiResponse).refs.find(link => link.rel === 'next');
      Array.prototype.push.apply(followings, apiResponse.data);
    }

    accounts = followings.map(account => account.fqn);
    return [... new Set(accounts)];
  };
}

export function exportFollows(intl) {
  return (dispatch, getState) => {
    dispatch({ type: EXPORT_FOLLOWS_REQUEST });
    const me = getState().get('me');
    return api(getState)
      .get(`/api/v1/accounts/${me}/following?limit=40`)
      .then(listAccounts(getState))
      .then((followings) => {
        followings = followings.map(fqn => fqn + ',true');
        followings.unshift('Account address,Show boosts');
        fileExport(followings.join('\n'), 'export_followings.csv');

        dispatch(snackbar.success(intl.formatMessage(messages.followersSuccess)));
        dispatch({ type: EXPORT_FOLLOWS_SUCCESS });
      }).catch(error => {
        dispatch({ type: EXPORT_FOLLOWS_FAIL, error });
      });
  };
}

export function exportBlocks(intl) {
  return (dispatch, getState) => {
    dispatch({ type: EXPORT_BLOCKS_REQUEST });
    return api(getState)
      .get('/api/v1/blocks?limit=40')
      .then(listAccounts(getState))
      .then((blocks) => {
        fileExport(blocks.join('\n'), 'export_block.csv');

        dispatch(snackbar.success(intl.formatMessage(messages.blocksSuccess)));
        dispatch({ type: EXPORT_BLOCKS_SUCCESS });
      }).catch(error => {
        dispatch({ type: EXPORT_BLOCKS_FAIL, error });
      });
  };
}

export function exportMutes(intl) {
  return (dispatch, getState) => {
    dispatch({ type: EXPORT_MUTES_REQUEST });
    return api(getState)
      .get('/api/v1/mutes?limit=40')
      .then(listAccounts(getState))
      .then((mutes) => {
        fileExport(mutes.join('\n'), 'export_mutes.csv');

        dispatch(snackbar.success(intl.formatMessage(messages.mutesSuccess)));
        dispatch({ type: EXPORT_MUTES_SUCCESS });
      }).catch(error => {
        dispatch({ type: EXPORT_MUTES_FAIL, error });
      });
  };
}

import { isLoggedIn } from 'soapbox/utils/auth';
import { getNextLinkName } from 'soapbox/utils/quirks';

import api, { getLinks } from '../api';

import { fetchRelationships } from './accounts';
import { importFetchedAccounts } from './importer';

import type { AnyAction } from '@reduxjs/toolkit';
import type { AxiosError } from 'axios';
import type { RootState } from 'soapbox/store';

const BLOCKS_FETCH_REQUEST = 'BLOCKS_FETCH_REQUEST';
const BLOCKS_FETCH_SUCCESS = 'BLOCKS_FETCH_SUCCESS';
const BLOCKS_FETCH_FAIL = 'BLOCKS_FETCH_FAIL';

const BLOCKS_EXPAND_REQUEST = 'BLOCKS_EXPAND_REQUEST';
const BLOCKS_EXPAND_SUCCESS = 'BLOCKS_EXPAND_SUCCESS';
const BLOCKS_EXPAND_FAIL = 'BLOCKS_EXPAND_FAIL';

const fetchBlocks = () => (dispatch: React.Dispatch<AnyAction>, getState: () => RootState) => {
  if (!isLoggedIn(getState)) return null;
  const nextLinkName = getNextLinkName(getState);

  dispatch(fetchBlocksRequest());

  return api(getState)
    .get('/api/v1/blocks')
    .then(response => {
      const next = getLinks(response).refs.find(link => link.rel === nextLinkName);
      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchBlocksSuccess(response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map((item: any) => item.id)) as any);
    })
    .catch(error => dispatch(fetchBlocksFail(error)));
};

function fetchBlocksRequest() {
  return { type: BLOCKS_FETCH_REQUEST };
}

function fetchBlocksSuccess(accounts: any, next: any) {
  return {
    type: BLOCKS_FETCH_SUCCESS,
    accounts,
    next,
  };
}

function fetchBlocksFail(error: AxiosError) {
  return {
    type: BLOCKS_FETCH_FAIL,
    error,
  };
}

const expandBlocks = () => (dispatch: React.Dispatch<AnyAction>, getState: () => RootState) => {
  if (!isLoggedIn(getState)) return null;
  const nextLinkName = getNextLinkName(getState);

  const url = getState().user_lists.blocks.next;

  if (url === null) {
    return null;
  }

  dispatch(expandBlocksRequest());

  return api(getState)
    .get(url)
    .then(response => {
      const next = getLinks(response).refs.find(link => link.rel === nextLinkName);
      dispatch(importFetchedAccounts(response.data));
      dispatch(expandBlocksSuccess(response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map((item: any) => item.id)) as any);
    })
    .catch(error => dispatch(expandBlocksFail(error)));
};

function expandBlocksRequest() {
  return {
    type: BLOCKS_EXPAND_REQUEST,
  };
}

function expandBlocksSuccess(accounts: any, next: any) {
  return {
    type: BLOCKS_EXPAND_SUCCESS,
    accounts,
    next,
  };
}

function expandBlocksFail(error: AxiosError) {
  return {
    type: BLOCKS_EXPAND_FAIL,
    error,
  };
}

export {
  fetchBlocks,
  expandBlocks,
  BLOCKS_FETCH_REQUEST,
  BLOCKS_FETCH_SUCCESS,
  BLOCKS_FETCH_FAIL,
  BLOCKS_EXPAND_REQUEST,
  BLOCKS_EXPAND_SUCCESS,
  BLOCKS_EXPAND_FAIL,
};

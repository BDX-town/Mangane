import { isLoggedIn } from 'soapbox/utils/auth';

import api, { getLinks } from '../api';

import type { AxiosError } from 'axios';
import type { List as ImmutableList } from 'immutable';
import type { AppDispatch, RootState } from 'soapbox/store';

const DOMAIN_BLOCK_REQUEST = 'DOMAIN_BLOCK_REQUEST';
const DOMAIN_BLOCK_SUCCESS = 'DOMAIN_BLOCK_SUCCESS';
const DOMAIN_BLOCK_FAIL    = 'DOMAIN_BLOCK_FAIL';

const DOMAIN_UNBLOCK_REQUEST = 'DOMAIN_UNBLOCK_REQUEST';
const DOMAIN_UNBLOCK_SUCCESS = 'DOMAIN_UNBLOCK_SUCCESS';
const DOMAIN_UNBLOCK_FAIL    = 'DOMAIN_UNBLOCK_FAIL';

const DOMAIN_BLOCKS_FETCH_REQUEST = 'DOMAIN_BLOCKS_FETCH_REQUEST';
const DOMAIN_BLOCKS_FETCH_SUCCESS = 'DOMAIN_BLOCKS_FETCH_SUCCESS';
const DOMAIN_BLOCKS_FETCH_FAIL    = 'DOMAIN_BLOCKS_FETCH_FAIL';

const DOMAIN_BLOCKS_EXPAND_REQUEST = 'DOMAIN_BLOCKS_EXPAND_REQUEST';
const DOMAIN_BLOCKS_EXPAND_SUCCESS = 'DOMAIN_BLOCKS_EXPAND_SUCCESS';
const DOMAIN_BLOCKS_EXPAND_FAIL    = 'DOMAIN_BLOCKS_EXPAND_FAIL';

const blockDomain = (domain: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(blockDomainRequest(domain));

    api(getState).post('/api/v1/domain_blocks', { domain }).then(() => {
      const at_domain = '@' + domain;
      const accounts = getState().accounts.filter(item => item.acct.endsWith(at_domain)).valueSeq().map(item => item.id);
      dispatch(blockDomainSuccess(domain, accounts.toList()));
    }).catch(err => {
      dispatch(blockDomainFail(domain, err));
    });
  };

const blockDomainRequest = (domain: string) => ({
  type: DOMAIN_BLOCK_REQUEST,
  domain,
});

const blockDomainSuccess = (domain: string, accounts: ImmutableList<string>) => ({
  type: DOMAIN_BLOCK_SUCCESS,
  domain,
  accounts,
});

const blockDomainFail = (domain: string, error: AxiosError) => ({
  type: DOMAIN_BLOCK_FAIL,
  domain,
  error,
});

const unblockDomain = (domain: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(unblockDomainRequest(domain));

    // Do it both ways for maximum compatibility
    const params = {
      params: { domain },
      data: { domain },
    };

    api(getState).delete('/api/v1/domain_blocks', params).then(() => {
      const at_domain = '@' + domain;
      const accounts = getState().accounts.filter(item => item.get('acct').endsWith(at_domain)).valueSeq().map(item => item.get('id'));
      dispatch(unblockDomainSuccess(domain, accounts.toList()));
    }).catch(err => {
      dispatch(unblockDomainFail(domain, err));
    });
  };

const unblockDomainRequest = (domain: string) => ({
  type: DOMAIN_UNBLOCK_REQUEST,
  domain,
});

const unblockDomainSuccess = (domain: string, accounts: ImmutableList<string>) => ({
  type: DOMAIN_UNBLOCK_SUCCESS,
  domain,
  accounts,
});

const unblockDomainFail = (domain: string, error: AxiosError) => ({
  type: DOMAIN_UNBLOCK_FAIL,
  domain,
  error,
});

const fetchDomainBlocks = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(fetchDomainBlocksRequest());

    api(getState).get('/api/v1/domain_blocks').then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(fetchDomainBlocksSuccess(response.data, next ? next.uri : null));
    }).catch(err => {
      dispatch(fetchDomainBlocksFail(err));
    });
  };

const fetchDomainBlocksRequest = () => ({
  type: DOMAIN_BLOCKS_FETCH_REQUEST,
});

const fetchDomainBlocksSuccess = (domains: string[], next: string | null) => ({
  type: DOMAIN_BLOCKS_FETCH_SUCCESS,
  domains,
  next,
});

const fetchDomainBlocksFail = (error: AxiosError) => ({
  type: DOMAIN_BLOCKS_FETCH_FAIL,
  error,
});

const expandDomainBlocks = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    const url = getState().domain_lists.blocks.next;

    if (!url) {
      return;
    }

    dispatch(expandDomainBlocksRequest());

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(expandDomainBlocksSuccess(response.data, next ? next.uri : null));
    }).catch(err => {
      dispatch(expandDomainBlocksFail(err));
    });
  };

const expandDomainBlocksRequest = () => ({
  type: DOMAIN_BLOCKS_EXPAND_REQUEST,
});

const expandDomainBlocksSuccess = (domains: string[], next: string | null) => ({
  type: DOMAIN_BLOCKS_EXPAND_SUCCESS,
  domains,
  next,
});

const expandDomainBlocksFail = (error: AxiosError)  => ({
  type: DOMAIN_BLOCKS_EXPAND_FAIL,
  error,
});

export {
  DOMAIN_BLOCK_REQUEST,
  DOMAIN_BLOCK_SUCCESS,
  DOMAIN_BLOCK_FAIL,
  DOMAIN_UNBLOCK_REQUEST,
  DOMAIN_UNBLOCK_SUCCESS,
  DOMAIN_UNBLOCK_FAIL,
  DOMAIN_BLOCKS_FETCH_REQUEST,
  DOMAIN_BLOCKS_FETCH_SUCCESS,
  DOMAIN_BLOCKS_FETCH_FAIL,
  DOMAIN_BLOCKS_EXPAND_REQUEST,
  DOMAIN_BLOCKS_EXPAND_SUCCESS,
  DOMAIN_BLOCKS_EXPAND_FAIL,
  blockDomain,
  blockDomainRequest,
  blockDomainSuccess,
  blockDomainFail,
  unblockDomain,
  unblockDomainRequest,
  unblockDomainSuccess,
  unblockDomainFail,
  fetchDomainBlocks,
  fetchDomainBlocksRequest,
  fetchDomainBlocksSuccess,
  fetchDomainBlocksFail,
  expandDomainBlocks,
  expandDomainBlocksRequest,
  expandDomainBlocksSuccess,
  expandDomainBlocksFail,
};

import { isLoggedIn } from 'soapbox/utils/auth';
import { getNextLinkName } from 'soapbox/utils/quirks';

import api, { getLinks } from '../api';

import { fetchRelationships } from './accounts';
import { importFetchedAccounts } from './importer';
import { openModal } from './modals';

import type { AxiosError } from 'axios';
import type { AppDispatch, RootState } from 'soapbox/store';
import type { APIEntity, Account as AccountEntity } from 'soapbox/types/entities';

const MUTES_FETCH_REQUEST = 'MUTES_FETCH_REQUEST';
const MUTES_FETCH_SUCCESS = 'MUTES_FETCH_SUCCESS';
const MUTES_FETCH_FAIL    = 'MUTES_FETCH_FAIL';

const MUTES_EXPAND_REQUEST = 'MUTES_EXPAND_REQUEST';
const MUTES_EXPAND_SUCCESS = 'MUTES_EXPAND_SUCCESS';
const MUTES_EXPAND_FAIL    = 'MUTES_EXPAND_FAIL';

const MUTES_INIT_MODAL = 'MUTES_INIT_MODAL';
const MUTES_TOGGLE_HIDE_NOTIFICATIONS = 'MUTES_TOGGLE_HIDE_NOTIFICATIONS';

const fetchMutes = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;
    const nextLinkName = getNextLinkName(getState);

    dispatch(fetchMutesRequest());

    api(getState).get('/api/v1/mutes').then(response => {
      const next = getLinks(response).refs.find(link => link.rel === nextLinkName);
      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchMutesSuccess(response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map((item: APIEntity) => item.id)));
    }).catch(error => dispatch(fetchMutesFail(error)));
  };

const fetchMutesRequest = () => ({
  type: MUTES_FETCH_REQUEST,
});

const fetchMutesSuccess = (accounts: APIEntity[], next: string | null) => ({
  type: MUTES_FETCH_SUCCESS,
  accounts,
  next,
});

const fetchMutesFail = (error: AxiosError) => ({
  type: MUTES_FETCH_FAIL,
  error,
});

const expandMutes = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;
    const nextLinkName = getNextLinkName(getState);

    const url = getState().user_lists.mutes.next;

    if (url === null) {
      return;
    }

    dispatch(expandMutesRequest());

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === nextLinkName);
      dispatch(importFetchedAccounts(response.data));
      dispatch(expandMutesSuccess(response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map((item: APIEntity) => item.id)));
    }).catch(error => dispatch(expandMutesFail(error)));
  };

const expandMutesRequest = () => ({
  type: MUTES_EXPAND_REQUEST,
});

const expandMutesSuccess = (accounts: APIEntity[], next: string | null) => ({
  type: MUTES_EXPAND_SUCCESS,
  accounts,
  next,
});

const expandMutesFail = (error: AxiosError) => ({
  type: MUTES_EXPAND_FAIL,
  error,
});

const initMuteModal = (account: AccountEntity) =>
  (dispatch: AppDispatch) => {
    dispatch({
      type: MUTES_INIT_MODAL,
      account,
    });

    dispatch(openModal('MUTE'));
  };

const toggleHideNotifications = () =>
  (dispatch: AppDispatch) => {
    dispatch({ type: MUTES_TOGGLE_HIDE_NOTIFICATIONS });
  };

export {
  MUTES_FETCH_REQUEST,
  MUTES_FETCH_SUCCESS,
  MUTES_FETCH_FAIL,
  MUTES_EXPAND_REQUEST,
  MUTES_EXPAND_SUCCESS,
  MUTES_EXPAND_FAIL,
  MUTES_INIT_MODAL,
  MUTES_TOGGLE_HIDE_NOTIFICATIONS,
  fetchMutes,
  fetchMutesRequest,
  fetchMutesSuccess,
  fetchMutesFail,
  expandMutes,
  expandMutesRequest,
  expandMutesSuccess,
  expandMutesFail,
  initMuteModal,
  toggleHideNotifications,
};

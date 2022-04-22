import { defineMessages } from 'react-intl';

import { isLoggedIn } from 'soapbox/utils/auth';
import { getFeatures } from 'soapbox/utils/features';

import api from '../api';

import { showAlertForError } from './alerts';
import { importFetchedAccounts } from './importer';
import { patchMeSuccess } from './me';
import snackbar from './snackbar';

export const ALIASES_FETCH_REQUEST = 'ALIASES_FETCH_REQUEST';
export const ALIASES_FETCH_SUCCESS = 'ALIASES_FETCH_SUCCESS';
export const ALIASES_FETCH_FAIL    = 'ALIASES_FETCH_FAIL';

export const ALIASES_SUGGESTIONS_CHANGE = 'ALIASES_SUGGESTIONS_CHANGE';
export const ALIASES_SUGGESTIONS_READY  = 'ALIASES_SUGGESTIONS_READY';
export const ALIASES_SUGGESTIONS_CLEAR  = 'ALIASES_SUGGESTIONS_CLEAR';

export const ALIASES_ADD_REQUEST = 'ALIASES_ADD_REQUEST';
export const ALIASES_ADD_SUCCESS = 'ALIASES_ADD_SUCCESS';
export const ALIASES_ADD_FAIL    = 'ALIASES_ADD_FAIL';

export const ALIASES_REMOVE_REQUEST = 'ALIASES_REMOVE_REQUEST';
export const ALIASES_REMOVE_SUCCESS = 'ALIASES_REMOVE_SUCCESS';
export const ALIASES_REMOVE_FAIL    = 'ALIASES_REMOVE_FAIL';

const messages = defineMessages({
  createSuccess: { id: 'aliases.success.add', defaultMessage: 'Account alias created successfully' },
  removeSuccess: { id: 'aliases.success.remove', defaultMessage: 'Account alias removed successfully' },
});

export const fetchAliases = (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;
  const state = getState();

  const instance = state.get('instance');
  const features = getFeatures(instance);

  if (!features.accountMoving) return;

  dispatch(fetchAliasesRequest());

  api(getState).get('/api/pleroma/aliases')
    .then(response => {
      dispatch(fetchAliasesSuccess(response.data.aliases));
    })
    .catch(err => dispatch(fetchAliasesFail(err)));
};

export const fetchAliasesRequest = () => ({
  type: ALIASES_FETCH_REQUEST,
});

export const fetchAliasesSuccess = aliases => ({
  type: ALIASES_FETCH_SUCCESS,
  value: aliases,
});

export const fetchAliasesFail = error => ({
  type: ALIASES_FETCH_FAIL,
  error,
});

export const fetchAliasesSuggestions = q => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;

  const params = {
    q,
    resolve: true,
    limit: 4,
  };

  api(getState).get('/api/v1/accounts/search', { params }).then(({ data }) => {
    dispatch(importFetchedAccounts(data));
    dispatch(fetchAliasesSuggestionsReady(q, data));
  }).catch(error => dispatch(showAlertForError(error)));
};

export const fetchAliasesSuggestionsReady = (query, accounts) => ({
  type: ALIASES_SUGGESTIONS_READY,
  query,
  accounts,
});

export const clearAliasesSuggestions = () => ({
  type: ALIASES_SUGGESTIONS_CLEAR,
});

export const changeAliasesSuggestions = value => ({
  type: ALIASES_SUGGESTIONS_CHANGE,
  value,
});

export const addToAliases = (intl, account) => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;
  const state = getState();

  const instance = state.get('instance');
  const features = getFeatures(instance);

  if (!features.accountMoving) {
    const me = state.get('me');
    const alsoKnownAs = state.getIn(['accounts_meta', me, 'pleroma', 'also_known_as']);

    dispatch(addToAliasesRequest());

    api(getState).patch('/api/v1/accounts/update_credentials', { also_known_as: [...alsoKnownAs, account.getIn(['pleroma', 'ap_id'])] })
      .then((response => {
        dispatch(snackbar.success(intl.formatMessage(messages.createSuccess)));
        dispatch(addToAliasesSuccess);
        dispatch(patchMeSuccess(response.data));
      }))
      .catch(err => dispatch(addToAliasesFail(err)));

    return;
  }

  dispatch(addToAliasesRequest());

  api(getState).put('/api/pleroma/aliases', {
    alias: account.get('acct'),
  })
    .then(response => {
      dispatch(snackbar.success(intl.formatMessage(messages.createSuccess)));
      dispatch(addToAliasesSuccess);
      dispatch(fetchAliases);
    })
    .catch(err => dispatch(fetchAliasesFail(err)));
};

export const addToAliasesRequest = () => ({
  type: ALIASES_ADD_REQUEST,
});

export const addToAliasesSuccess = () => ({
  type: ALIASES_ADD_SUCCESS,
});

export const addToAliasesFail = error => ({
  type: ALIASES_ADD_FAIL,
  error,
});

export const removeFromAliases = (intl, account) => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;
  const state = getState();

  const instance = state.get('instance');
  const features = getFeatures(instance);

  if (!features.accountMoving) {
    const me = state.get('me');
    const alsoKnownAs = state.getIn(['accounts_meta', me, 'pleroma', 'also_known_as']);

    dispatch(removeFromAliasesRequest());

    api(getState).patch('/api/v1/accounts/update_credentials', { also_known_as: alsoKnownAs.filter(id => id !== account) })
      .then(response => {
        dispatch(snackbar.success(intl.formatMessage(messages.removeSuccess)));
        dispatch(removeFromAliasesSuccess);
        dispatch(patchMeSuccess(response.data));
      })
      .catch(err => dispatch(removeFromAliasesFail(err)));

    return;
  }

  dispatch(addToAliasesRequest());

  api(getState).delete('/api/pleroma/aliases', {
    data: {
      alias: account,
    },
  })
    .then(response => {
      dispatch(snackbar.success(intl.formatMessage(messages.removeSuccess)));
      dispatch(removeFromAliasesSuccess);
      dispatch(fetchAliases);
    })
    .catch(err => dispatch(fetchAliasesFail(err)));
};

export const removeFromAliasesRequest = () => ({
  type: ALIASES_REMOVE_REQUEST,
});

export const removeFromAliasesSuccess = () => ({
  type: ALIASES_REMOVE_SUCCESS,
});

export const removeFromAliasesFail = error => ({
  type: ALIASES_REMOVE_FAIL,
  error,
});

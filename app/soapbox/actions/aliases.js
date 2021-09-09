import { defineMessages } from 'react-intl';
import api from '../api';
import { importFetchedAccount, importFetchedAccounts } from './importer';
import { showAlertForError } from './alerts';
import snackbar from './snackbar';
import { isLoggedIn } from 'soapbox/utils/auth';
import { ME_PATCH_SUCCESS } from './me';

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

export const addToAliases = (intl, apId) => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;
  const state = getState();

  const me = state.get('me');
  const alsoKnownAs = state.getIn(['accounts_meta', me, 'pleroma', 'also_known_as']);

  dispatch(addToAliasesRequest(apId));

  api(getState).patch('/api/v1/accounts/update_credentials', { also_known_as: [...alsoKnownAs, apId] })
    .then((response => {
      dispatch(snackbar.success(intl.formatMessage(messages.createSuccess)));
      dispatch(addToAliasesSuccess(response.data));
    }))
    .catch(err => dispatch(addToAliasesFail(err)));
};

export const addToAliasesRequest = (apId) => ({
  type: ALIASES_ADD_REQUEST,
  apId,
});

export const addToAliasesSuccess = me => dispatch => {
  dispatch(importFetchedAccount(me));
  dispatch({
    type: ME_PATCH_SUCCESS,
    me,
  });
  dispatch({
    type: ALIASES_ADD_SUCCESS,
  });
};

export const addToAliasesFail = (apId, error) => ({
  type: ALIASES_ADD_FAIL,
  apId,
  error,
});

export const removeFromAliases = (intl, apId) => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;
  const state = getState();

  const me = state.get('me');
  const alsoKnownAs = state.getIn(['accounts_meta', me, 'pleroma', 'also_known_as']);

  dispatch(removeFromAliasesRequest(apId));

  api(getState).patch('/api/v1/accounts/update_credentials', { also_known_as: alsoKnownAs.filter(id => id !== apId) })
    .then(response => {
      dispatch(snackbar.success(intl.formatMessage(messages.removeSuccess)));
      dispatch(removeFromAliasesSuccess(response.data));
    })
    .catch(err => dispatch(removeFromAliasesFail(apId, err)));
};

export const removeFromAliasesRequest = (apId) => ({
  type: ALIASES_REMOVE_REQUEST,
  apId,
});

export const removeFromAliasesSuccess = me => dispatch => {
  dispatch(importFetchedAccount(me));
  dispatch({
    type: ME_PATCH_SUCCESS,
    me,
  });
  dispatch({
    type: ALIASES_REMOVE_SUCCESS,
  });
};

export const removeFromAliasesFail = (apId, error) => ({
  type: ALIASES_REMOVE_FAIL,
  apId,
  error,
});

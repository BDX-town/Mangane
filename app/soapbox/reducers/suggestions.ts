import {
  Map as ImmutableMap,
  List as ImmutableList,
  Record as ImmutableRecord,
} from 'immutable';

import { ACCOUNT_BLOCK_SUCCESS, ACCOUNT_MUTE_SUCCESS } from 'soapbox/actions/accounts';
import { DOMAIN_BLOCK_SUCCESS } from 'soapbox/actions/domain_blocks';

import {
  SUGGESTIONS_FETCH_REQUEST,
  SUGGESTIONS_FETCH_SUCCESS,
  SUGGESTIONS_FETCH_FAIL,
  SUGGESTIONS_DISMISS,
  SUGGESTIONS_V2_FETCH_REQUEST,
  SUGGESTIONS_V2_FETCH_SUCCESS,
  SUGGESTIONS_V2_FETCH_FAIL,
} from '../actions/suggestions';

import type { AnyAction } from 'redux';

type SuggestionSource = 'past_interactions' | 'staff' | 'global';

type ReducerSuggestion = {
  source: SuggestionSource,
  account: string,
}

type SuggestionAccount = {
  id: string,
}

type Suggestion = {
  source: SuggestionSource,
  account: SuggestionAccount,
}

const ReducerRecord = ImmutableRecord({
  items: ImmutableList<ImmutableMap<string, any>>(),
  isLoading: false,
});

type State = ReturnType<typeof ReducerRecord>;

/** Convert a v1 account into a v2 suggestion. */
const accountToSuggestion = (account: SuggestionAccount): ReducerSuggestion => {
  return {
    source: 'past_interactions',
    account: account.id,
  };
};

/** Import plain accounts into the reducer (legacy). */
const importAccounts = (state: State, accounts: SuggestionAccount[]): State => {
  return state.withMutations(state => {
    state.set('items', ImmutableList(accounts.map(account => ImmutableMap(accountToSuggestion(account)))));
    state.set('isLoading', false);
  });
};

/** Import full suggestion objects. */
const importSuggestions = (state: State, suggestions: Suggestion[]): State => {
  return state.withMutations(state => {
    state.set('items', ImmutableList(suggestions.map(x => ImmutableMap({ ...x, account: x.account.id }))));
    state.set('isLoading', false);
  });
};

const dismissAccount = (state: State, accountId: string): State => {
  return state.update('items', items => items.filterNot(item => item.get('account') === accountId));
};

const dismissAccounts = (state: State, accountIds: string[]): State => {
  return state.update('items', items => items.filterNot(item => accountIds.includes(item.get('account'))));
};

export default function suggestionsReducer(state = ReducerRecord(), action: AnyAction) {
  switch (action.type) {
    case SUGGESTIONS_FETCH_REQUEST:
    case SUGGESTIONS_V2_FETCH_REQUEST:
      return state.set('isLoading', true);
    case SUGGESTIONS_FETCH_SUCCESS:
      return importAccounts(state, action.accounts);
    case SUGGESTIONS_V2_FETCH_SUCCESS:
      return importSuggestions(state, action.suggestions);
    case SUGGESTIONS_FETCH_FAIL:
    case SUGGESTIONS_V2_FETCH_FAIL:
      return state.set('isLoading', false);
    case SUGGESTIONS_DISMISS:
      return dismissAccount(state, action.id);
    case ACCOUNT_BLOCK_SUCCESS:
    case ACCOUNT_MUTE_SUCCESS:
      return dismissAccount(state, action.relationship.id);
    case DOMAIN_BLOCK_SUCCESS:
      return dismissAccounts(state, action.accounts);
    default:
      return state;
  }
}

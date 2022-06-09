import { List as ImmutableList, Record as ImmutableRecord } from 'immutable';

import {
  LIST_CREATE_REQUEST,
  LIST_CREATE_FAIL,
  LIST_CREATE_SUCCESS,
  LIST_UPDATE_REQUEST,
  LIST_UPDATE_FAIL,
  LIST_UPDATE_SUCCESS,
  LIST_EDITOR_RESET,
  LIST_EDITOR_SETUP,
  LIST_EDITOR_TITLE_CHANGE,
  LIST_ACCOUNTS_FETCH_REQUEST,
  LIST_ACCOUNTS_FETCH_SUCCESS,
  LIST_ACCOUNTS_FETCH_FAIL,
  LIST_EDITOR_SUGGESTIONS_READY,
  LIST_EDITOR_SUGGESTIONS_CLEAR,
  LIST_EDITOR_SUGGESTIONS_CHANGE,
  LIST_EDITOR_ADD_SUCCESS,
  LIST_EDITOR_REMOVE_SUCCESS,
} from '../actions/lists';

import type { AnyAction } from 'redux';

const AccountsRecord = ImmutableRecord({
  items: ImmutableList<string>(),
  loaded: false,
  isLoading: false,
});

const SuggestionsRecord = ImmutableRecord({
  value: '',
  items: ImmutableList<string>(),
});

const ReducerRecord = ImmutableRecord({
  listId: null as string | null,
  isSubmitting: false,
  isChanged: false,
  title: '',

  accounts: AccountsRecord(),

  suggestions: SuggestionsRecord(),
});

type State = ReturnType<typeof ReducerRecord>;

export default function listEditorReducer(state: State = ReducerRecord(), action: AnyAction) {
  switch (action.type) {
    case LIST_EDITOR_RESET:
      return ReducerRecord();
    case LIST_EDITOR_SETUP:
      return state.withMutations(map => {
        map.set('listId', action.list.get('id'));
        map.set('title', action.list.get('title'));
        map.set('isSubmitting', false);
      });
    case LIST_EDITOR_TITLE_CHANGE:
      return state.withMutations(map => {
        map.set('title', action.value);
        map.set('isChanged', true);
      });
    case LIST_CREATE_REQUEST:
    case LIST_UPDATE_REQUEST:
      return state.withMutations(map => {
        map.set('isSubmitting', true);
        map.set('isChanged', false);
      });
    case LIST_CREATE_FAIL:
    case LIST_UPDATE_FAIL:
      return state.set('isSubmitting', false);
    case LIST_CREATE_SUCCESS:
    case LIST_UPDATE_SUCCESS:
      return state.withMutations(map => {
        map.set('isSubmitting', false);
        map.set('listId', action.list.id);
      });
    case LIST_ACCOUNTS_FETCH_REQUEST:
      return state.setIn(['accounts', 'isLoading'], true);
    case LIST_ACCOUNTS_FETCH_FAIL:
      return state.setIn(['accounts', 'isLoading'], false);
    case LIST_ACCOUNTS_FETCH_SUCCESS:
      return state.update('accounts', accounts => accounts.withMutations(map => {
        map.set('isLoading', false);
        map.set('loaded', true);
        map.set('items', ImmutableList(action.accounts.map((item: { id: string }) => item.id)));
      }));
    case LIST_EDITOR_SUGGESTIONS_CHANGE:
      return state.setIn(['suggestions', 'value'], action.value);
    case LIST_EDITOR_SUGGESTIONS_READY:
      return state.setIn(['suggestions', 'items'], ImmutableList(action.accounts.map((item: { id: string }) => item.id)));
    case LIST_EDITOR_SUGGESTIONS_CLEAR:
      return state.update('suggestions', suggestions => suggestions.withMutations(map => {
        map.set('items', ImmutableList());
        map.set('value', '');
      }));
    case LIST_EDITOR_ADD_SUCCESS:
      return state.updateIn(['accounts', 'items'], list => (list as ImmutableList<string>).unshift(action.accountId));
    case LIST_EDITOR_REMOVE_SUCCESS:
      return state.updateIn(['accounts', 'items'], list => (list as ImmutableList<string>).filterNot((item) => item === action.accountId));
    default:
      return state;
  }
}

import {
  Map as ImmutableMap,
  OrderedSet as ImmutableOrderedSet,
  Record as ImmutableRecord,
} from 'immutable';
import { AnyAction } from 'redux';

import {
  FOLLOWERS_FETCH_SUCCESS,
  FOLLOWERS_EXPAND_SUCCESS,
  FOLLOWING_FETCH_SUCCESS,
  FOLLOWING_EXPAND_SUCCESS,
  FOLLOW_REQUESTS_FETCH_SUCCESS,
  FOLLOW_REQUESTS_EXPAND_SUCCESS,
  FOLLOW_REQUEST_AUTHORIZE_SUCCESS,
  FOLLOW_REQUEST_REJECT_SUCCESS,
  PINNED_ACCOUNTS_FETCH_SUCCESS,
  BIRTHDAY_REMINDERS_FETCH_SUCCESS,
  FOLLOW_REQUESTS_FETCH_REQUEST,
} from '../actions/accounts';
import {
  BLOCKS_FETCH_SUCCESS,
  BLOCKS_EXPAND_SUCCESS,
  BLOCKS_FETCH_REQUEST,
} from '../actions/blocks';
import {
  DIRECTORY_FETCH_REQUEST,
  DIRECTORY_FETCH_SUCCESS,
  DIRECTORY_FETCH_FAIL,
  DIRECTORY_EXPAND_REQUEST,
  DIRECTORY_EXPAND_SUCCESS,
  DIRECTORY_EXPAND_FAIL,
} from '../actions/directory';
import {
  FAMILIAR_FOLLOWERS_FETCH_SUCCESS,
} from '../actions/familiar_followers';
import {
  GROUP_MEMBERS_FETCH_SUCCESS,
  GROUP_MEMBERS_EXPAND_SUCCESS,
  GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS,
  GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS,
  GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS,
} from '../actions/groups';
import {
  REBLOGS_FETCH_SUCCESS,
  FAVOURITES_FETCH_SUCCESS,
  REACTIONS_FETCH_SUCCESS,
} from '../actions/interactions';
import {
  MUTES_FETCH_SUCCESS,
  MUTES_EXPAND_SUCCESS,
  MUTES_FETCH_REQUEST,
} from '../actions/mutes';
import {
  NOTIFICATIONS_UPDATE,
} from '../actions/notifications';

import type { APIEntity } from 'soapbox/types/entities';

export const ListRecord = ImmutableRecord({
  next: null as string | null,
  items: ImmutableOrderedSet<string>(),
  isLoading: false,
});

export const ReactionRecord = ImmutableRecord({
  accounts: ImmutableOrderedSet<string>(),
  count: 0,
  name: '',
  url: null,
});

const ReactionListRecord = ImmutableRecord({
  next: null as string | null,
  items: ImmutableOrderedSet<Reaction>(),
  isLoading: false,
});

export const ReducerRecord = ImmutableRecord({
  followers: ImmutableMap<string, List>(),
  following: ImmutableMap<string, List>(),
  reblogged_by: ImmutableMap<string, List>(),
  favourited_by: ImmutableMap<string, List>(),
  reactions: ImmutableMap<string, ReactionList>(),
  follow_requests: ListRecord(),
  blocks: ListRecord(),
  mutes: ListRecord(),
  directory: ListRecord({ isLoading: true }),
  groups: ImmutableMap<string, List>(),
  groups_removed_accounts: ImmutableMap<string, List>(),
  pinned: ImmutableMap<string, List>(),
  birthday_reminders: ImmutableMap<string, List>(),
  familiar_followers: ImmutableMap<string, List>(),
});

type State = ReturnType<typeof ReducerRecord>;
export type List = ReturnType<typeof ListRecord>;
type Reaction = ReturnType<typeof ReactionRecord>;
type ReactionList = ReturnType<typeof ReactionListRecord>;
type Items = ImmutableOrderedSet<string>;
type NestedListPath = ['followers' | 'following' | 'reblogged_by' | 'favourited_by' | 'reactions' | 'groups' | 'groups_removed_accounts' | 'pinned' | 'birthday_reminders' | 'familiar_followers', string];
type ListPath = ['follow_requests' | 'blocks' | 'mutes' | 'directory'];

const loadingList = (state: State, path: ListPath) => {
  const current = state.getIn(path) as List;
  return state.setIn(path, current.set('isLoading', true));
};

const normalizeList = (state: State, path: NestedListPath | ListPath, accounts: APIEntity[], next?: string | null) => {

  return state.setIn(path, ListRecord({
    isLoading: false,
    next,
    items: ImmutableOrderedSet(accounts.map(item => item.id)),
  }));
};

const appendToList = (state: State, path: NestedListPath | ListPath, accounts: APIEntity[], next: string | null) => {
  return state.updateIn(path, map => {
    return (map as List)
      .set('next', next).update('items', list => (list as Items).concat(accounts.map(item => item.id)));
  });
};

const removeFromList = (state: State, path: NestedListPath | ListPath, accountId: string) => {
  return state.updateIn(path, map => {
    return (map as List)
      .update('items', list => (list as Items).filterNot(item => item === accountId));
  });
};

const normalizeFollowRequest = (state: State, notification: APIEntity) => {
  return state.updateIn(['follow_requests', 'items'], list => {
    return ImmutableOrderedSet([notification.account.id]).union(list as Items);
  });
};

export default function userLists(state = ReducerRecord(), action: AnyAction) {
  switch (action.type) {
    case BLOCKS_FETCH_REQUEST:
      return loadingList(state, ['blocks']);
    case MUTES_FETCH_REQUEST:
      return loadingList(state, ['mutes']);
    case FOLLOW_REQUESTS_FETCH_REQUEST:
      return loadingList(state, ['follow_requests']);
    case FOLLOWERS_FETCH_SUCCESS:
      return normalizeList(state, ['followers', action.id], action.accounts, action.next);
    case FOLLOWERS_EXPAND_SUCCESS:
      return appendToList(state, ['followers', action.id], action.accounts, action.next);
    case FOLLOWING_FETCH_SUCCESS:
      return normalizeList(state, ['following', action.id], action.accounts, action.next);
    case FOLLOWING_EXPAND_SUCCESS:
      return appendToList(state, ['following', action.id], action.accounts, action.next);
    case REBLOGS_FETCH_SUCCESS:
      return normalizeList(state, ['reblogged_by', action.id], action.accounts);
    case FAVOURITES_FETCH_SUCCESS:
      return normalizeList(state, ['favourited_by', action.id], action.accounts);
    case REACTIONS_FETCH_SUCCESS:
      return state.setIn(['reactions', action.id], ReactionListRecord({
        items: ImmutableOrderedSet<Reaction>(action.reactions.map(({ accounts, ...reaction }: APIEntity) => ReactionRecord({
          ...reaction,
          accounts: ImmutableOrderedSet(accounts.map((account: APIEntity) => account.id)),
        }))),
      }));
    case NOTIFICATIONS_UPDATE:
      return action.notification.type === 'follow_request' ? normalizeFollowRequest(state, action.notification) : state;
    case FOLLOW_REQUESTS_FETCH_SUCCESS:
      return normalizeList(state, ['follow_requests'], action.accounts, action.next);
    case FOLLOW_REQUESTS_EXPAND_SUCCESS:
      return appendToList(state, ['follow_requests'], action.accounts, action.next);
    case FOLLOW_REQUEST_AUTHORIZE_SUCCESS:
    case FOLLOW_REQUEST_REJECT_SUCCESS:
      return removeFromList(state, ['follow_requests'], action.id);
    case BLOCKS_FETCH_SUCCESS:
      return normalizeList(state, ['blocks'], action.accounts, action.next);
    case BLOCKS_EXPAND_SUCCESS:
      return appendToList(state, ['blocks'], action.accounts, action.next);
    case MUTES_FETCH_SUCCESS:
      return normalizeList(state, ['mutes'], action.accounts, action.next);
    case MUTES_EXPAND_SUCCESS:
      return appendToList(state, ['mutes'], action.accounts, action.next);
    case DIRECTORY_FETCH_SUCCESS:
      return normalizeList(state, ['directory'], action.accounts, action.next);
    case DIRECTORY_EXPAND_SUCCESS:
      return appendToList(state, ['directory'], action.accounts, action.next);
    case DIRECTORY_FETCH_REQUEST:
    case DIRECTORY_EXPAND_REQUEST:
      return state.setIn(['directory', 'isLoading'], true);
    case DIRECTORY_FETCH_FAIL:
    case DIRECTORY_EXPAND_FAIL:
      return state.setIn(['directory', 'isLoading'], false);
    case GROUP_MEMBERS_FETCH_SUCCESS:
      return normalizeList(state, ['groups', action.id], action.accounts, action.next);
    case GROUP_MEMBERS_EXPAND_SUCCESS:
      return appendToList(state, ['groups', action.id], action.accounts, action.next);
    case GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS:
      return normalizeList(state, ['groups_removed_accounts', action.id], action.accounts, action.next);
    case GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS:
      return appendToList(state, ['groups_removed_accounts', action.id], action.accounts, action.next);
    case GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS:
      return removeFromList(state, ['groups_removed_accounts', action.groupId], action.id);
    case PINNED_ACCOUNTS_FETCH_SUCCESS:
      return normalizeList(state, ['pinned', action.id], action.accounts, action.next);
    case BIRTHDAY_REMINDERS_FETCH_SUCCESS:
      return normalizeList(state, ['birthday_reminders', action.id], action.accounts, action.next);
    case FAMILIAR_FOLLOWERS_FETCH_SUCCESS:
      return normalizeList(state, ['familiar_followers', action.id], action.accounts, action.next);
    default:
      return state;
  }
}

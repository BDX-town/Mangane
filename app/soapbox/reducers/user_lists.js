import {
  NOTIFICATIONS_UPDATE,
} from '../actions/notifications';
import {
  FOLLOWERS_FETCH_SUCCESS,
  FOLLOWERS_EXPAND_SUCCESS,
  FOLLOWING_FETCH_SUCCESS,
  FOLLOWING_EXPAND_SUCCESS,
  FOLLOW_REQUESTS_FETCH_SUCCESS,
  FOLLOW_REQUESTS_EXPAND_SUCCESS,
  FOLLOW_REQUEST_AUTHORIZE_SUCCESS,
  FOLLOW_REQUEST_REJECT_SUCCESS,
} from '../actions/accounts';
import {
  REBLOGS_FETCH_SUCCESS,
  FAVOURITES_FETCH_SUCCESS,
  REACTIONS_FETCH_SUCCESS,
} from '../actions/interactions';
import {
  BLOCKS_FETCH_SUCCESS,
  BLOCKS_EXPAND_SUCCESS,
} from '../actions/blocks';
import {
  MUTES_FETCH_SUCCESS,
  MUTES_EXPAND_SUCCESS,
} from '../actions/mutes';
import { Map as ImmutableMap, OrderedSet as ImmutableOrderedSet } from 'immutable';
import {
  GROUP_MEMBERS_FETCH_SUCCESS,
  GROUP_MEMBERS_EXPAND_SUCCESS,
  GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS,
  GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS,
  GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS,
} from '../actions/groups';

const initialState = ImmutableMap({
  followers: ImmutableMap(),
  following: ImmutableMap(),
  reblogged_by: ImmutableMap(),
  favourited_by: ImmutableMap(),
  reactions: ImmutableMap(),
  follow_requests: ImmutableMap(),
  blocks: ImmutableMap(),
  mutes: ImmutableMap(),
  groups: ImmutableMap(),
  groups_removed_accounts: ImmutableMap(),
});

const normalizeList = (state, type, id, accounts, next) => {
  return state.setIn([type, id], ImmutableMap({
    next,
    items: ImmutableOrderedSet(accounts.map(item => item.id)),
  }));
};

const appendToList = (state, type, id, accounts, next) => {
  return state.updateIn([type, id], map => {
    return map.set('next', next).update('items', list => list.concat(accounts.map(item => item.id)));
  });
};

const normalizeFollowRequest = (state, notification) => {
  return state.updateIn(['follow_requests', 'items'], list => {
    return list.filterNot(item => item === notification.account.id).unshift(notification.account.id);
  });
};

export default function userLists(state = initialState, action) {
  switch(action.type) {
  case FOLLOWERS_FETCH_SUCCESS:
    return normalizeList(state, 'followers', action.id, action.accounts, action.next);
  case FOLLOWERS_EXPAND_SUCCESS:
    return appendToList(state, 'followers', action.id, action.accounts, action.next);
  case FOLLOWING_FETCH_SUCCESS:
    return normalizeList(state, 'following', action.id, action.accounts, action.next);
  case FOLLOWING_EXPAND_SUCCESS:
    return appendToList(state, 'following', action.id, action.accounts, action.next);
  case REBLOGS_FETCH_SUCCESS:
    return state.setIn(['reblogged_by', action.id], ImmutableOrderedSet(action.accounts.map(item => item.id)));
  case FAVOURITES_FETCH_SUCCESS:
    return state.setIn(['favourited_by', action.id], ImmutableOrderedSet(action.accounts.map(item => item.id)));
  case REACTIONS_FETCH_SUCCESS:
    return state.setIn(['reactions', action.id], action.reactions.map(({ accounts, ...reaction }) => ({ ...reaction, accounts: ImmutableOrderedSet(accounts.map(account => account.id)) })));
  case NOTIFICATIONS_UPDATE:
    return action.notification.type === 'follow_request' ? normalizeFollowRequest(state, action.notification) : state;
  case FOLLOW_REQUESTS_FETCH_SUCCESS:
    return state.setIn(['follow_requests', 'items'], ImmutableOrderedSet(action.accounts.map(item => item.id))).setIn(['follow_requests', 'next'], action.next);
  case FOLLOW_REQUESTS_EXPAND_SUCCESS:
    return state.updateIn(['follow_requests', 'items'], list => list.concat(action.accounts.map(item => item.id))).setIn(['follow_requests', 'next'], action.next);
  case FOLLOW_REQUEST_AUTHORIZE_SUCCESS:
  case FOLLOW_REQUEST_REJECT_SUCCESS:
    return state.updateIn(['follow_requests', 'items'], list => list.filterNot(item => item === action.id));
  case BLOCKS_FETCH_SUCCESS:
    return state.setIn(['blocks', 'items'], ImmutableOrderedSet(action.accounts.map(item => item.id))).setIn(['blocks', 'next'], action.next);
  case BLOCKS_EXPAND_SUCCESS:
    return state.updateIn(['blocks', 'items'], list => list.concat(action.accounts.map(item => item.id))).setIn(['blocks', 'next'], action.next);
  case MUTES_FETCH_SUCCESS:
    return state.setIn(['mutes', 'items'], ImmutableOrderedSet(action.accounts.map(item => item.id))).setIn(['mutes', 'next'], action.next);
  case MUTES_EXPAND_SUCCESS:
    return state.updateIn(['mutes', 'items'], list => list.concat(action.accounts.map(item => item.id))).setIn(['mutes', 'next'], action.next);
  case GROUP_MEMBERS_FETCH_SUCCESS:
    return normalizeList(state, 'groups', action.id, action.accounts, action.next);
  case GROUP_MEMBERS_EXPAND_SUCCESS:
    return appendToList(state, 'groups', action.id, action.accounts, action.next);
  case GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS:
    return normalizeList(state, 'groups_removed_accounts', action.id, action.accounts, action.next);
  case GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS:
    return appendToList(state, 'groups_removed_accounts', action.id, action.accounts, action.next);
  case GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS:
    return state.updateIn(['groups_removed_accounts', action.groupId, 'items'], list => list.filterNot(item => item === action.id));
  default:
    return state;
  }
}

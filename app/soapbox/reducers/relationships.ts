import { List as ImmutableList, Map as ImmutableMap } from 'immutable';
import get from 'lodash/get';

import { STREAMING_FOLLOW_RELATIONSHIPS_UPDATE } from 'soapbox/actions/streaming';
import { normalizeRelationship } from 'soapbox/normalizers/relationship';

import { ACCOUNT_NOTE_SUBMIT_SUCCESS } from '../actions/account-notes';
import {
  ACCOUNT_FOLLOW_SUCCESS,
  ACCOUNT_FOLLOW_REQUEST,
  ACCOUNT_FOLLOW_FAIL,
  ACCOUNT_UNFOLLOW_SUCCESS,
  ACCOUNT_UNFOLLOW_REQUEST,
  ACCOUNT_UNFOLLOW_FAIL,
  ACCOUNT_BLOCK_SUCCESS,
  ACCOUNT_UNBLOCK_SUCCESS,
  ACCOUNT_MUTE_SUCCESS,
  ACCOUNT_UNMUTE_SUCCESS,
  ACCOUNT_SUBSCRIBE_SUCCESS,
  ACCOUNT_UNSUBSCRIBE_SUCCESS,
  ACCOUNT_PIN_SUCCESS,
  ACCOUNT_UNPIN_SUCCESS,
  ACCOUNT_REMOVE_FROM_FOLLOWERS_SUCCESS,
  RELATIONSHIPS_FETCH_SUCCESS,
} from '../actions/accounts';
import {
  DOMAIN_BLOCK_SUCCESS,
  DOMAIN_UNBLOCK_SUCCESS,
} from '../actions/domain_blocks';
import {
  ACCOUNT_IMPORT,
  ACCOUNTS_IMPORT,
} from '../actions/importer';

import type { AnyAction } from 'redux';

type Relationship = ReturnType<typeof normalizeRelationship>;
type State = ImmutableMap<string, Relationship>;
type APIEntity = Record<string, any>;
type APIEntities = Array<APIEntity>;

const normalizeRelationships = (state: State, relationships: APIEntities) => {
  relationships.forEach(relationship => {
    state = state.set(relationship.id, normalizeRelationship(relationship));
  });

  return state;
};

const setDomainBlocking = (state: State, accounts: ImmutableList<string>, blocking: boolean) => {
  return state.withMutations(map => {
    accounts.forEach(id => {
      map.setIn([id, 'domain_blocking'], blocking);
    });
  });
};

const importPleromaAccount = (state: State, account: APIEntity) => {
  const relationship = get(account, ['pleroma', 'relationship'], {});
  if (relationship.id && relationship !== {})
    return normalizeRelationships(state, [relationship]);
  return state;
};

const importPleromaAccounts = (state: State, accounts: APIEntities) => {
  accounts.forEach(account => {
    state = importPleromaAccount(state, account);
  });

  return state;
};

const followStateToRelationship = (followState: string) => {
  switch (followState) {
    case 'follow_pending':
      return { following: false, requested: true };
    case 'follow_accept':
      return { following: true, requested: false };
    case 'follow_reject':
      return { following: false, requested: false };
    default:
      return {};
  }
};

const updateFollowRelationship = (state: State, id: string, followState: string) => {
  const map = followStateToRelationship(followState);
  return state.update(id, normalizeRelationship({}), relationship => relationship.merge(map));
};

export default function relationships(state: State = ImmutableMap<string, Relationship>(), action: AnyAction) {
  switch (action.type) {
    case ACCOUNT_IMPORT:
      return importPleromaAccount(state, action.account);
    case ACCOUNTS_IMPORT:
      return importPleromaAccounts(state, action.accounts);
    case ACCOUNT_FOLLOW_REQUEST:
      return state.setIn([action.id, 'following'], true);
    case ACCOUNT_FOLLOW_FAIL:
      return state.setIn([action.id, 'following'], false);
    case ACCOUNT_UNFOLLOW_REQUEST:
      return state.setIn([action.id, 'following'], false);
    case ACCOUNT_UNFOLLOW_FAIL:
      return state.setIn([action.id, 'following'], true);
    case ACCOUNT_FOLLOW_SUCCESS:
    case ACCOUNT_UNFOLLOW_SUCCESS:
    case ACCOUNT_BLOCK_SUCCESS:
    case ACCOUNT_UNBLOCK_SUCCESS:
    case ACCOUNT_MUTE_SUCCESS:
    case ACCOUNT_UNMUTE_SUCCESS:
    case ACCOUNT_SUBSCRIBE_SUCCESS:
    case ACCOUNT_UNSUBSCRIBE_SUCCESS:
    case ACCOUNT_PIN_SUCCESS:
    case ACCOUNT_UNPIN_SUCCESS:
    case ACCOUNT_NOTE_SUBMIT_SUCCESS:
    case ACCOUNT_REMOVE_FROM_FOLLOWERS_SUCCESS:
      return normalizeRelationships(state, [action.relationship]);
    case RELATIONSHIPS_FETCH_SUCCESS:
      return normalizeRelationships(state, action.relationships);
    case DOMAIN_BLOCK_SUCCESS:
      return setDomainBlocking(state, action.accounts, true);
    case DOMAIN_UNBLOCK_SUCCESS:
      return setDomainBlocking(state, action.accounts, false);
    case STREAMING_FOLLOW_RELATIONSHIPS_UPDATE:
      if (action.follower.id === action.me) {
        return updateFollowRelationship(state, action.following.id, action.state);
      } else {
        return state;
      }
    default:
      return state;
  }
}

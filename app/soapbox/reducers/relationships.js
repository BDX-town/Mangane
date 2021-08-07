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
  RELATIONSHIPS_FETCH_SUCCESS,
} from '../actions/accounts';
import {
  ACCOUNT_IMPORT,
  ACCOUNTS_IMPORT,
} from '../actions/importer';
import {
  DOMAIN_BLOCK_SUCCESS,
  DOMAIN_UNBLOCK_SUCCESS,
} from '../actions/domain_blocks';
import { STREAMING_FOLLOW_RELATIONSHIPS_UPDATE } from 'soapbox/actions/streaming';
import { Map as ImmutableMap, fromJS } from 'immutable';
import { get } from 'lodash';

const normalizeRelationship = (state, relationship) => state.set(relationship.id, fromJS(relationship));

const normalizeRelationships = (state, relationships) => {
  relationships.forEach(relationship => {
    state = normalizeRelationship(state, relationship);
  });

  return state;
};

const setDomainBlocking = (state, accounts, blocking) => {
  return state.withMutations(map => {
    accounts.forEach(id => {
      map.setIn([id, 'domain_blocking'], blocking);
    });
  });
};

const importPleromaAccount = (state, account) => {
  const relationship = get(account, ['pleroma', 'relationship'], {});
  if (relationship.id && relationship !== {})
    return normalizeRelationship(state, relationship);
  return state;
};

const importPleromaAccounts = (state, accounts) => {
  accounts.forEach(account => {
    state = importPleromaAccount(state, account);
  });

  return state;
};

const followStateToRelationship = followState => {
  switch(followState) {
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

const updateFollowRelationship = (state, id, followState) => {
  const map = followStateToRelationship(followState);
  return state.update(id, ImmutableMap(), relationship => relationship.merge(map));
};

const initialState = ImmutableMap();

export default function relationships(state = initialState, action) {
  switch(action.type) {
  case ACCOUNT_IMPORT:
    return importPleromaAccount(state, action.account);
  case ACCOUNTS_IMPORT:
    return importPleromaAccounts(state, action.accounts);
  case ACCOUNT_FOLLOW_REQUEST:
    return state.setIn([action.id, 'requested'], true);
  case ACCOUNT_FOLLOW_FAIL:
    return state.setIn([action.id, 'requested'], false);
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
    return normalizeRelationship(state, action.relationship);
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

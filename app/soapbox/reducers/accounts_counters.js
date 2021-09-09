import {
  ACCOUNT_FOLLOW_SUCCESS,
  ACCOUNT_UNFOLLOW_SUCCESS,
} from '../actions/accounts';
import { ACCOUNT_IMPORT, ACCOUNTS_IMPORT } from '../actions/importer';
import { STREAMING_FOLLOW_RELATIONSHIPS_UPDATE } from 'soapbox/actions/streaming';
import { Map as ImmutableMap, fromJS } from 'immutable';

const normalizeAccount = (state, account) => state.set(account.id, fromJS({
  followers_count: account.followers_count,
  following_count: account.following_count,
  statuses_count: account.statuses_count,
}));

const normalizeAccounts = (state, accounts) => {
  accounts.forEach(account => {
    state = normalizeAccount(state, account);
  });

  return state;
};

const updateFollowCounters = (state, counterUpdates) => {
  return state.withMutations(state => {
    counterUpdates.forEach(counterUpdate => {
      state.update(counterUpdate.id, ImmutableMap(), counters => counters.merge({
        followers_count: counterUpdate.follower_count,
        following_count: counterUpdate.following_count,
      }));
    });
  });
};

const initialState = ImmutableMap();

export default function accountsCounters(state = initialState, action) {
  switch(action.type) {
  case ACCOUNT_IMPORT:
    return normalizeAccount(state, action.account);
  case ACCOUNTS_IMPORT:
    return normalizeAccounts(state, action.accounts);
  case ACCOUNT_FOLLOW_SUCCESS:
    return action.alreadyFollowing ? state :
      state.updateIn([action.relationship.id, 'followers_count'], num => num + 1);
  case ACCOUNT_UNFOLLOW_SUCCESS:
    return state.updateIn([action.relationship.id, 'followers_count'], num => Math.max(0, num - 1));
  case STREAMING_FOLLOW_RELATIONSHIPS_UPDATE:
    return updateFollowCounters(state, [action.follower, action.following]);
  default:
    return state;
  }
}

import { List as ImmutableList, Map as ImmutableMap, Record as ImmutableRecord } from 'immutable';

import {
  ACCOUNT_FOLLOW_SUCCESS,
  ACCOUNT_UNFOLLOW_SUCCESS,
} from 'soapbox/actions/accounts';
import { ACCOUNT_IMPORT, ACCOUNTS_IMPORT } from 'soapbox/actions/importer';
import { STREAMING_FOLLOW_RELATIONSHIPS_UPDATE } from 'soapbox/actions/streaming';

import type { AnyAction } from 'redux';

const CounterRecord = ImmutableRecord({
  followers_count: 0,
  following_count: 0,
  statuses_count: 0,
});

type Counter = ReturnType<typeof CounterRecord>;
type State = ImmutableMap<string, Counter>;
type APIEntity = Record<string, any>;
type APIEntities = Array<APIEntity>;

const normalizeAccount = (state: State, account: APIEntity) => state.set(account.id, CounterRecord({
  followers_count: account.followers_count,
  following_count: account.following_count,
  statuses_count: account.statuses_count,
}));

const normalizeAccounts = (state: State, accounts: ImmutableList<APIEntities>) => {
  accounts.forEach(account => {
    state = normalizeAccount(state, account);
  });

  return state;
};

const updateFollowCounters = (state: State, counterUpdates: APIEntities) => {
  return state.withMutations(state => {
    counterUpdates.forEach((counterUpdate) => {
      state.update(counterUpdate.id, CounterRecord(), counters => counters.merge({
        followers_count: counterUpdate.follower_count,
        following_count: counterUpdate.following_count,
      }));
    });
  });
};

export default function accountsCounters(state: State = ImmutableMap<string, Counter>(), action: AnyAction) {
  switch (action.type) {
    case ACCOUNT_IMPORT:
      return normalizeAccount(state, action.account);
    case ACCOUNTS_IMPORT:
      return normalizeAccounts(state, action.accounts);
    case ACCOUNT_FOLLOW_SUCCESS:
      return action.alreadyFollowing ? state :
        state.updateIn([action.relationship.id, 'followers_count'], 0, (count) => typeof count === 'number' ? count + 1 : 0);
    case ACCOUNT_UNFOLLOW_SUCCESS:
      return state.updateIn([action.relationship.id, 'followers_count'], 0, (count) => typeof count === 'number' ? Math.max(0, count - 1) : 0);
    case STREAMING_FOLLOW_RELATIONSHIPS_UPDATE:
      return updateFollowCounters(state, [action.follower, action.following]);
    default:
      return state;
  }
}

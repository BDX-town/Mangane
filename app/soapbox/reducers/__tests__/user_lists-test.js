import reducer from '../user_lists';
import { Map as ImmutableMap } from 'immutable';

describe('user_lists reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      followers: ImmutableMap(),
      following: ImmutableMap(),
      reblogged_by: ImmutableMap(),
      favourited_by: ImmutableMap(),
      follow_requests: ImmutableMap(),
      blocks: ImmutableMap(),
      reactions: ImmutableMap(),
      mutes: ImmutableMap(),
      groups: ImmutableMap(),
      groups_removed_accounts: ImmutableMap(),
    }));
  });
});

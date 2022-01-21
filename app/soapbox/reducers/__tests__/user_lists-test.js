import { Map as ImmutableMap } from 'immutable';

import reducer from '../user_lists';

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
      pinned: ImmutableMap(),
      birthday_reminders: ImmutableMap(),
    }));
  });
});

import { Map as ImmutableMap } from 'immutable';

import reducer from '../accounts_counters';
// import { ACCOUNT_FOLLOW_SUCCESS, ACCOUNT_UNFOLLOW_SUCCESS } from 'soapbox/actions/accounts';
// import relationship from 'soapbox/__fixtures__/relationship.json';
// import accounts_counter_initial from 'soapbox/__fixtures__/accounts_counter_initial.json';
// import accounts_counter_unfollow from 'soapbox/__fixtures__/accounts_counter_unfollow.json';
// import accounts_counter_follow from 'soapbox/__fixtures__/accounts_counter_follow.json';


describe('accounts_counters reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });

  // it('should handle ACCOUNT_FOLLOW_SUCCESS', () => {
  //   const state = ImmutableList([accounts_counter_initial]);
  //   const action = {
  //     type: ACCOUNT_FOLLOW_SUCCESS,
  //     relationship: relationship,
  //     alreadyFollowing: false,
  //   };
  //   expect(reducer(state, action)).toEqual(
  //     ImmutableList([ accounts_counter_follow ]));
  // });
  //
  // it('should handle ACCOUNT_UNFOLLOW_SUCCESS', () => {
  //   const state = ImmutableList([accounts_counter_initial]);
  //   const action = {
  //     type: ACCOUNT_UNFOLLOW_SUCCESS,
  //     relationship: relationship,
  //     alreadyFollowing: true,
  //   };
  //   expect(reducer(state, action)).toEqual(
  //     ImmutableList([accounts_counter_unfollow]));
  // });

});

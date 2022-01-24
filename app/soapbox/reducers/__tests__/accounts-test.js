import { Map as ImmutableMap } from 'immutable';

import reducer from '../accounts';
// import * as actions from 'soapbox/actions/importer';
// import { take } from 'lodash';
// import accounts from 'soapbox/__fixtures__/accounts.json';

describe('accounts reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });

  // fails to add normalized accounts to state
  // it('should handle ACCOUNT_IMPORT', () => {
  //   const state = ImmutableMap({ });
  //   const account = take(accounts, 1);
  //   const action = {
  //     type: actions.ACCOUNT_IMPORT,
  //     account: account,
  //   };
  //   debugger;
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //   });
  // });

  // fails to add normalized accounts to state
  // it('should handle ACCOUNTS_IMPORT', () => {
  //   const state = ImmutableMap({ });
  //   const accounts = take(accounts, 2);
  //   const action = {
  //     type: actions.ACCOUNTS_IMPORT,
  //     accounts: accounts,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //   });
  // });
  //
  // it('should handle ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP', () => {
  //   const state = ImmutableMap({ username: 'curtis' });
  //   const action = {
  //     type: actions.ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP,
  //     username: 'curtis',
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     username: 'curtis',
  //   });
  // });

});

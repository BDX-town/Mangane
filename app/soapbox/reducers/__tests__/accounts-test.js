import { Map as ImmutableMap, Record } from 'immutable';

import { ACCOUNT_IMPORT } from 'soapbox/actions/importer';

import reducer from '../accounts';
// import * as actions from 'soapbox/actions/importer';
// import { take } from 'lodash';
// import accounts from 'soapbox/__fixtures__/accounts.json';

describe('accounts reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap());
  });

  describe('ACCOUNT_IMPORT', () => {
    it('parses the account as a Record', () => {
      const account = require('soapbox/__fixtures__/pleroma-account.json');
      const action = { type: ACCOUNT_IMPORT, account };
      const result = reducer(undefined, action).get('9v5bmRalQvjOy0ECcC');

      expect(Record.isRecord(result)).toBe(true);
    });
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

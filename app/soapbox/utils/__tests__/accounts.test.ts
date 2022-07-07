import { AccountRecord } from 'soapbox/normalizers';

import {
  getDomain,
} from '../accounts';

import type { ReducerAccount } from 'soapbox/reducers/accounts';

describe('getDomain', () => {
  const account = AccountRecord({
    acct: 'alice',
    url: 'https://party.com/users/alice',
  }) as ReducerAccount;
  it('returns the domain', () => {
    expect(getDomain(account)).toEqual('party.com');
  });
});

import { AccountRecord } from 'soapbox/normalizers';

import {
  getDomain,
} from '../accounts';

describe('getDomain', () => {
  const account = AccountRecord({
    acct: 'alice',
    url: 'https://party.com/users/alice',
  });
  it('returns the domain', () => {
    expect(getDomain(account)).toEqual('party.com');
  });
});

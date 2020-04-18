import { getDomain, acctFull, isStaff } from '../accounts';
import { fromJS } from 'immutable';

describe('getDomain', () => {
  const account = fromJS({
    acct: 'alice',
    url: 'https://party.com/users/alice',
  });
  it('returns the domain', () => {
    expect(getDomain(account)).toEqual('party.com');
  });
});

describe('acctFull', () => {
  describe('with a local user', () => {
    const account = fromJS({
      acct: 'alice',
      url: 'https://party.com/users/alice',
    });
    it('returns the full acct', () => {
      expect(acctFull(account)).toEqual('alice@party.com');
    });
  });

  describe('with a remote user', () => {
    const account = fromJS({
      acct: 'bob@pool.com',
      url: 'https://pool.com/users/bob',
    });
    it('returns the full acct', () => {
      expect(acctFull(account)).toEqual('bob@pool.com');
    });
  });
});

describe('isStaff', () => {
  describe('with empty user', () => {
    const account = fromJS({});
    it('returns false', () => {
      expect(isStaff(account)).toBe(false);
    });
  });

  describe('with Pleroma admin', () => {
    const admin = fromJS({ pleroma: { is_admin: true } });
    it('returns true', () => {
      expect(isStaff(admin)).toBe(true);
    });
  });

  describe('with Pleroma moderator', () => {
    const mod = fromJS({ pleroma: { is_moderator: true } });
    it('returns true', () => {
      expect(isStaff(mod)).toBe(true);
    });
  });
});

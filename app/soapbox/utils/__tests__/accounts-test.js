import { fromJS } from 'immutable';

import {
  getDomain,
  acctFull,
  isStaff,
  isAdmin,
  isModerator,
} from '../accounts';

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

  describe('with undefined', () => {
    const account = undefined;
    it('returns false', () => {
      expect(isStaff(account)).toBe(false);
    });
  });
});

describe('isAdmin', () => {
  describe('with empty user', () => {
    const account = fromJS({});
    it('returns false', () => {
      expect(isAdmin(account)).toBe(false);
    });
  });

  describe('with Pleroma admin', () => {
    const admin = fromJS({ pleroma: { is_admin: true } });
    it('returns true', () => {
      expect(isAdmin(admin)).toBe(true);
    });
  });

  describe('with Pleroma moderator', () => {
    const mod = fromJS({ pleroma: { is_moderator: true } });
    it('returns false', () => {
      expect(isAdmin(mod)).toBe(false);
    });
  });
});

describe('isModerator', () => {
  describe('with empty user', () => {
    const account = fromJS({});
    it('returns false', () => {
      expect(isModerator(account)).toBe(false);
    });
  });

  describe('with Pleroma admin', () => {
    const admin = fromJS({ pleroma: { is_admin: true } });
    it('returns false', () => {
      expect(isModerator(admin)).toBe(false);
    });
  });

  describe('with Pleroma moderator', () => {
    const mod = fromJS({ pleroma: { is_moderator: true } });
    it('returns true', () => {
      expect(isModerator(mod)).toBe(true);
    });
  });
});

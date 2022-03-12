import { fromJS } from 'immutable';

import { normalizeAccount } from '../account';

describe('normalizeAccount()', () => {
  it('normalizes a mention', () => {
    const mention = fromJS({
      acct: 'NEETzsche@iddqd.social',
      id: '9v5bw7hEGBPc9nrpzc',
      url: 'https://iddqd.social/users/NEETzsche',
      username: 'NEETzsche',
    });

    const result = normalizeAccount(mention);
    expect(result.emojis).toEqual(fromJS([]));
    expect(result.display_name).toEqual('NEETzsche');
    expect(result.verified).toBe(false);
  });

  it('normalizes Fedibird birthday', () => {
    const account = fromJS(require('soapbox/__fixtures__/fedibird-account.json'));
    const result = normalizeAccount(account);

    expect(result.get('birthday')).toEqual('1993-07-03');
  });

  it('normalizes Pleroma birthday', () => {
    const account = fromJS(require('soapbox/__fixtures__/pleroma-account.json'));
    const result = normalizeAccount(account);

    expect(result.get('birthday')).toEqual('1993-07-03');
  });

  it('normalizes Pleroma legacy fields', () => {
    const account = fromJS(require('soapbox/__fixtures__/pleroma-2.2.2-account.json'));
    const result = normalizeAccount(account);

    expect(result.getIn(['pleroma', 'is_active'])).toBe(true);
    expect(result.getIn(['pleroma', 'is_confirmed'])).toBe(true);
    expect(result.getIn(['pleroma', 'is_approved'])).toBe(true);

    expect(result.hasIn(['pleroma', 'confirmation_pending'])).toBe(false);
  });

  it('prefers new Pleroma fields', () => {
    const account = fromJS(require('soapbox/__fixtures__/pleroma-account.json'));
    const result = normalizeAccount(account);

    expect(result.getIn(['pleroma', 'is_active'])).toBe(true);
    expect(result.getIn(['pleroma', 'is_confirmed'])).toBe(true);
    expect(result.getIn(['pleroma', 'is_approved'])).toBe(true);
  });

  it('normalizes a verified Pleroma user', () => {
    const account = fromJS(require('soapbox/__fixtures__/mk.json'));
    const result = normalizeAccount(account);
    expect(result.get('verified')).toBe(true);
  });

  it('normalizes an unverified Pleroma user', () => {
    const account = fromJS(require('soapbox/__fixtures__/pleroma-account.json'));
    const result = normalizeAccount(account);
    expect(result.get('verified')).toBe(false);
  });

  it('normalizes a verified Truth Social user', () => {
    const account = fromJS(require('soapbox/__fixtures__/realDonaldTrump.json'));
    const result = normalizeAccount(account);
    expect(result.get('verified')).toBe(true);
  });

  it('normalizes Fedibird location', () => {
    const account = fromJS(require('soapbox/__fixtures__/fedibird-account.json'));
    const result = normalizeAccount(account);
    expect(result.get('location')).toBe('Texas, USA');
  });

  it('normalizes Truth Social location', () => {
    const account = fromJS(require('soapbox/__fixtures__/truthsocial-account.json'));
    const result = normalizeAccount(account);
    expect(result.get('location')).toBe('Texas');
  });
});

import { fromJS } from 'immutable';

import { normalizeAccount } from '../account';

describe('normalizeAccount()', () => {
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
});

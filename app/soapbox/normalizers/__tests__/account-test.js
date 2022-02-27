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
});

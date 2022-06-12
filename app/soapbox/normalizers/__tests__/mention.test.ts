import { Record as ImmutableRecord } from 'immutable';

import { normalizeMention } from '../mention';

describe('normalizeMention()', () => {
  it('adds base fields', () => {
    const account = {};
    const result = normalizeMention(account);

    expect(ImmutableRecord.isRecord(result)).toBe(true);
    expect(result.id).toEqual('');
    expect(result.acct).toEqual('');
    expect(result.username).toEqual('');
    expect(result.url).toEqual('');
  });

  it('infers username from acct', () => {
    const account = { acct: 'alex@gleasonator.com' };
    const result = normalizeMention(account);

    expect(result.username).toEqual('alex');
  });
});

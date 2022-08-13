import { Record as ImmutableRecord } from 'immutable';

import { normalizeCard } from '../card';

describe('normalizeCard()', () => {
  it('adds base fields', () => {
    const card = {};
    const result = normalizeCard(card);

    expect(ImmutableRecord.isRecord(result)).toBe(true);
    expect(result.type).toEqual('link');
    expect(result.url).toEqual('');
  });
});

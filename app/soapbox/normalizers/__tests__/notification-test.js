import { Record as ImmutableRecord } from 'immutable';

import { normalizeNotification } from '../notification';

describe('normalizeNotification()', () => {
  it('normalizes an empty map', () => {
    const notification = {};
    const result = normalizeNotification(notification);

    expect(ImmutableRecord.isRecord(result)).toBe(true);
    expect(result.type).toEqual('');
    expect(result.account).toBe(null);
    expect(result.target).toBe(null);
    expect(result.status).toBe(null);
    expect(result.id).toEqual('');
  });
});

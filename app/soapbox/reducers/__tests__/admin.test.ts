import { Record as ImmutableRecord } from 'immutable';

import reducer from '../admin';

describe('admin reducer', () => {
  it('should return the initial state', () => {
    const result = reducer(undefined, {} as any);
    expect(ImmutableRecord.isRecord(result)).toBe(true);
    expect(result.needsReboot).toBe(false);
  });
});

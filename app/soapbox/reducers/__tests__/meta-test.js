import { Record as ImmutableRecord } from 'immutable';

import reducer from '../meta';

describe('meta reducer', () => {
  it('should return the initial state', () => {
    const result = reducer(undefined, {});
    expect(ImmutableRecord.isRecord(result)).toBe(true);
    expect(result.instance_fetch_failed).toBe(false);
  });
});

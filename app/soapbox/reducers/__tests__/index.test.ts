import { Record as ImmutableRecord } from 'immutable';

import reducer from '..';

describe('root reducer', () => {
  it('should return the initial state', () => {
    const result = reducer(undefined, {});
    expect(ImmutableRecord.isRecord(result)).toBe(true);
    expect(result.accounts.get('')).toBe(undefined);
    expect(result.instance.version).toEqual('0.0.0');
  });
});

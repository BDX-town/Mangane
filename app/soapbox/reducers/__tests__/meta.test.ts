import { Record as ImmutableRecord } from 'immutable';

import { SW_UPDATING, setSwUpdating } from 'soapbox/actions/sw';

import reducer from '../meta';

describe('meta reducer', () => {
  it('should return the initial state', () => {
    const result = reducer(undefined, {} as any);
    expect(ImmutableRecord.isRecord(result)).toBe(true);
    expect(result.instance_fetch_failed).toBe(false);
    expect(result.swUpdating).toBe(false);
  });

  describe(SW_UPDATING, () => {
    it('sets swUpdating to the provided value', () => {
      const result = reducer(undefined, setSwUpdating(true));
      expect(result.swUpdating).toBe(true);
    });
  });
});

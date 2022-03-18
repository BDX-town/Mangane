import { fromJS } from 'immutable';

import { normalizeStatus } from 'soapbox/normalizers/status';

import { hasIntegerMediaIds } from '../status';

describe('hasIntegerMediaIds()', () => {
  it('returns true for a Pleroma deleted status', () => {
    const status = normalizeStatus(fromJS(require('soapbox/__fixtures__/pleroma-status-deleted.json')));
    expect(hasIntegerMediaIds(status)).toBe(true);
  });
});

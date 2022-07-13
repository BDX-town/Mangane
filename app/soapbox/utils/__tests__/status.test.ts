
import { normalizeStatus } from 'soapbox/normalizers/status';

import {
  hasIntegerMediaIds,
  defaultMediaVisibility,
} from '../status';

import type { ReducerStatus } from 'soapbox/reducers/statuses';

describe('hasIntegerMediaIds()', () => {
  it('returns true for a Pleroma deleted status', () => {
    const status = normalizeStatus(require('soapbox/__fixtures__/pleroma-status-deleted.json')) as ReducerStatus;
    expect(hasIntegerMediaIds(status)).toBe(true);
  });
});

describe('defaultMediaVisibility()', () => {
  it('returns false with no status', () => {
    expect(defaultMediaVisibility(undefined, 'default')).toBe(false);
  });

  it('hides sensitive media by default', () => {
    const status = normalizeStatus({ sensitive: true }) as ReducerStatus;
    expect(defaultMediaVisibility(status, 'default')).toBe(false);
  });

  it('hides media when displayMedia is hide_all', () => {
    const status = normalizeStatus({}) as ReducerStatus;
    expect(defaultMediaVisibility(status, 'hide_all')).toBe(false);
  });

  it('shows sensitive media when displayMedia is show_all', () => {
    const status = normalizeStatus({ sensitive: true }) as ReducerStatus;
    expect(defaultMediaVisibility(status, 'show_all')).toBe(true);
  });
});

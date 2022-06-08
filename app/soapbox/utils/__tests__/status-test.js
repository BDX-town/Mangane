import { fromJS } from 'immutable';

import { normalizeStatus } from 'soapbox/normalizers/status';

import {
  hasIntegerMediaIds,
  defaultMediaVisibility,
} from '../status';

describe('hasIntegerMediaIds()', () => {
  it('returns true for a Pleroma deleted status', () => {
    const status = normalizeStatus(fromJS(require('soapbox/__fixtures__/pleroma-status-deleted.json')));
    expect(hasIntegerMediaIds(status)).toBe(true);
  });
});

describe('defaultMediaVisibility()', () => {
  it('returns false with no status', () => {
    expect(defaultMediaVisibility(undefined, 'default')).toBe(false);
  });

  it('hides sensitive media by default', () => {
    const status = normalizeStatus({ sensitive: true });
    expect(defaultMediaVisibility(status, 'default')).toBe(false);
  });

  it('hides media when displayMedia is hide_all', () => {
    const status = normalizeStatus({});
    expect(defaultMediaVisibility(status, 'hide_all')).toBe(false);
  });

  it('shows sensitive media when displayMedia is show_all', () => {
    const status = normalizeStatus({ sensitive: true });
    expect(defaultMediaVisibility(status, 'show_all')).toBe(true);
  });
});

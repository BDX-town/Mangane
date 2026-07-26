import { createAccountScope } from 'soapbox/domain/account-scope';
import { normalizeInstance } from 'soapbox/normalizers/instance';
import {
  AKKOMA,
  getFeatures,
  MASTODON,
  parseVersion,
  PLEROMA,
} from 'soapbox/utils/features';

import { LegacyCapabilityAdapter } from '../legacy-capability-adapter';

describe('legacy protocol capability adapter', () => {
  const scope = createAccountScope({ instanceOrigin: 'https://social.example' });

  it.each([
    ['4.2.0', MASTODON, false, true],
    ['2.7.2 (compatible; Pleroma 2.4.51)', PLEROMA, true, true],
    ['4.2.0 (compatible; Akkoma 3.13.2)', AKKOMA, true, true],
  ])('maps representative %s metadata without leaking backend checks to callers', (
    version,
    software,
    fetchByUsername,
    lookup,
  ) => {
    expect(parseVersion(version).software).toBe(software);
    const adapter = new LegacyCapabilityAdapter(getFeatures(normalizeInstance({ version })));
    expect(adapter.resolve('account.fetch-by-username', scope).state)
      .toBe(fetchByUsername ? 'supported' : 'unsupported');
    expect(adapter.resolve('account.lookup', scope).state)
      .toBe(lookup ? 'supported' : 'unsupported');
  });

  it('fails closed to unsupported for unknown server metadata', () => {
    const adapter = new LegacyCapabilityAdapter(getFeatures(normalizeInstance({ version: 'unknown' })));
    expect(adapter.resolve('account.fetch-by-username', scope).state).toBe('unsupported');
    expect(adapter.resolve('account.lookup', scope).state).toBe('unsupported');
  });
});

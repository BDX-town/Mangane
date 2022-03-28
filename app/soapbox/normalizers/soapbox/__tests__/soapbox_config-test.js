import { Record as ImmutableRecord } from 'immutable';

import { normalizeSoapboxConfig } from '../soapbox_config';

describe('normalizeSoapboxConfig()', () => {
  it('adds base fields', () => {
    const result = normalizeSoapboxConfig({});
    expect(result.brandColor).toBe('');
    expect(ImmutableRecord.isRecord(result)).toBe(true);
  });
});

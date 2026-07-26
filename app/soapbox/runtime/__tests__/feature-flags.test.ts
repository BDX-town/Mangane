import {
  FEATURE_FLAGS,
  parseFeatureFlagOverrides,
  readFeatureFlag,
} from '../feature-flags';

describe('owned feature flag registry', () => {
  it('records ownership, rollback, and removal metadata', () => {
    expect(FEATURE_FLAGS['architecture.accountLookupAdapter']).toEqual(expect.objectContaining({
      defaultValue: true,
      owner: 'protocol-maintainers',
      removeAfterPhase: 'Phase 7',
      rollbackValue: false,
    }));
  });

  it('accepts only registered boolean overrides', () => {
    const overrides = parseFeatureFlagOverrides({
      'architecture.accountLookupAdapter': false,
      'unknown.flag': true,
      __proto__: true,
    });
    expect(overrides).toEqual({ 'architecture.accountLookupAdapter': false });
    expect(readFeatureFlag('architecture.accountLookupAdapter', overrides)).toBe(false);
    expect(readFeatureFlag('architecture.accountLookupAdapter')).toBe(true);
  });
});

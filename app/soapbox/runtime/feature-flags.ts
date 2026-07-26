type FeatureFlagKey = 'architecture.accountLookupAdapter';

type FeatureFlagMetadata = Readonly<{
  defaultValue: boolean;
  description: string;
  owner: string;
  removeAfterPhase: string;
  rollbackValue: boolean;
}>;

type FeatureFlagOverrides = Partial<Record<FeatureFlagKey, boolean>>;

const FEATURE_FLAGS: Readonly<Record<FeatureFlagKey, FeatureFlagMetadata>> = Object.freeze({
  'architecture.accountLookupAdapter': Object.freeze({
    defaultValue: true,
    description: 'Routes account lookup through Phase 1 application and protocol boundaries.',
    owner: 'protocol-maintainers',
    removeAfterPhase: 'Phase 7',
    rollbackValue: false,
  }),
});

const readFeatureFlag = (key: FeatureFlagKey, overrides: FeatureFlagOverrides = {}): boolean => {
  const override = overrides[key];
  return typeof override === 'boolean' ? override : FEATURE_FLAGS[key].defaultValue;
};

const parseFeatureFlagOverrides = (value: unknown): FeatureFlagOverrides => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key, enabled]) => key in FEATURE_FLAGS && typeof enabled === 'boolean'),
  ) as FeatureFlagOverrides;
};

export {
  FEATURE_FLAGS,
  parseFeatureFlagOverrides,
  readFeatureFlag,
};

export type {
  FeatureFlagKey,
  FeatureFlagMetadata,
  FeatureFlagOverrides,
};

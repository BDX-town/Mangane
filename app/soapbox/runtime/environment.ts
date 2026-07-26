import * as BuildConfig from 'soapbox/build_config';
import { parseFeatureFlagOverrides } from 'soapbox/runtime/feature-flags';

import type { FeatureFlagOverrides } from 'soapbox/runtime/feature-flags';

interface RuntimeEnvironment {
  currentOrigin(): string;
  featureFlags(): FeatureFlagOverrides;
  isOnline(): boolean;
  mode(): 'development' | 'production' | 'test';
  now(): number;
}

const runtimeEnvironment: RuntimeEnvironment = Object.freeze({
  currentOrigin: () => window.location.origin,
  featureFlags: () => parseFeatureFlagOverrides(BuildConfig.FEATURE_FLAGS),
  isOnline: () => typeof navigator.onLine === 'boolean' ? navigator.onLine : true,
  mode: () => BuildConfig.NODE_ENV,
  now: () => Date.now(),
});

export { runtimeEnvironment };
export type { RuntimeEnvironment };

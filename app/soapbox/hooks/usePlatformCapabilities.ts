/**
 * Phase 4 — React hook for platform capability detection.
 *
 * Provides components with knowledge of what PWA features are available
 * on the current platform, enabling graceful degradation and conditional UI.
 */
import { useMemo } from 'react';

import { detectCapabilities } from 'soapbox/utils/pwa';

import type { PlatformCapabilities } from 'soapbox/utils/pwa';

/**
 * Returns the current platform's PWA capabilities.
 * Stable across re-renders (capabilities don't change during a session).
 */
export const usePlatformCapabilities = (): PlatformCapabilities => {
  return useMemo(() => detectCapabilities(), []);
};

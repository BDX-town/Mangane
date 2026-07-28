/**
 * Phase 4 — PWA utilities index.
 *
 * Public API for PWA platform detection, capabilities, and compatibility.
 */
export {
  isIOS,
  isIOSStandalone,
  isInstalledPWA,
  detectCapabilities,
  requestPersistentStorage,
  getStorageEstimate,
  applyIOSPWAFixes,
} from './safari-compat';

export type { PlatformCapabilities } from './safari-compat';

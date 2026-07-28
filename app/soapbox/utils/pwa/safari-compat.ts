/**
 * Phase 4 — Safari/WebKit PWA compatibility layer.
 *
 * Addresses known gaps in iOS Safari's PWA implementation to maximize
 * native-like behavior. This module:
 *
 * - Detects iOS standalone mode (navigator.standalone)
 * - Requests persistent storage to prevent iOS eviction
 * - Detects push notification availability (iOS 16.4+)
 * - Provides display-mode detection for conditional UI
 * - Handles iOS-specific viewport quirks (safe areas, rubber banding)
 *
 * None of these capabilities require Capacitor. For native API access
 * beyond what the web platform provides, see Phase 26 (Native Bridge).
 */

/** Detect if running on iOS (iPhone/iPad/iPod) */
export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

/** Detect if running in iOS standalone (PWA) mode */
export function isIOSStandalone(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (navigator as any).standalone === true;
}

/** Detect if running as an installed PWA (any platform) */
export function isInstalledPWA(): boolean {
  if (typeof window === 'undefined') return false;
  // Check display-mode media query (Chrome, Firefox, Edge)
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  // Check iOS standalone property
  if (isIOSStandalone()) return true;
  return false;
}

/**
 * Platform capability detection for PWA features.
 * Returns what's available on the current browser/platform.
 */
export interface PlatformCapabilities {
  /** Push notifications supported (requires iOS 16.4+ for Safari) */
  pushNotifications: boolean;
  /** Background sync supported (Chromium only) */
  backgroundSync: boolean;
  /** Persistent storage API available */
  persistentStorage: boolean;
  /** Badge API for app icon badges */
  badgeAPI: boolean;
  /** Share API for native sharing */
  shareAPI: boolean;
  /** Share Target API (receiving shares) */
  shareTarget: boolean;
  /** Notification API available */
  notifications: boolean;
  /** Service Worker available */
  serviceWorker: boolean;
  /** Is running as installed PWA */
  installed: boolean;
  /** Platform identifier */
  platform: 'ios' | 'android' | 'desktop' | 'unknown';
}

export function detectCapabilities(): PlatformCapabilities {
  const hasServiceWorker = 'serviceWorker' in navigator;
  const hasNotifications = 'Notification' in window;
  const hasPush = 'PushManager' in window;

  let platform: PlatformCapabilities['platform'] = 'unknown';
  if (isIOS()) platform = 'ios';
  else if (/Android/.test(navigator.userAgent)) platform = 'android';
  else if (!/Mobi|Android/.test(navigator.userAgent)) platform = 'desktop';

  return {
    pushNotifications: hasServiceWorker && hasPush && hasNotifications,
    backgroundSync: hasServiceWorker && 'SyncManager' in window,
    persistentStorage: 'storage' in navigator && 'persist' in navigator.storage,
    badgeAPI: 'setAppBadge' in navigator,
    shareAPI: 'share' in navigator,
    shareTarget: hasServiceWorker, // Share target requires SW
    notifications: hasNotifications,
    serviceWorker: hasServiceWorker,
    installed: isInstalledPWA(),
    platform,
  };
}

/**
 * Request persistent storage to prevent iOS from evicting PWA data.
 *
 * On iOS, PWA storage can be evicted after 7 days of inactivity.
 * Requesting persistence signals to the browser that data should be kept.
 * On Chrome, this suppresses the "Clear site data" suggestion.
 *
 * Returns true if persistence was granted, false otherwise.
 * Does not throw — fails silently on unsupported browsers.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (!navigator.storage?.persist) return false;
    const persisted = await navigator.storage.persisted();
    if (persisted) return true;
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

/**
 * Get current storage usage and quota.
 * Useful for displaying storage indicators or making eviction decisions.
 */
export async function getStorageEstimate(): Promise<{ usage: number; quota: number } | null> {
  try {
    if (!navigator.storage?.estimate) return null;
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage ?? 0,
      quota: estimate.quota ?? 0,
    };
  } catch {
    return null;
  }
}

/**
 * Apply iOS-specific PWA fixes on startup.
 * Call this once during application bootstrap.
 */
export function applyIOSPWAFixes(): void {
  if (!isIOS()) return;

  // Prevent iOS rubber-band scrolling on the body (causes visual glitches in standalone mode)
  if (isIOSStandalone()) {
    document.body.style.overscrollBehavior = 'none';
  }

  // Request persistent storage to reduce eviction risk
  requestPersistentStorage();
}

import { detectCapabilities, isInstalledPWA, requestPersistentStorage, getStorageEstimate } from '../safari-compat';

describe('Safari PWA Compatibility', () => {
  describe('detectCapabilities', () => {
    it('returns a complete capabilities object', () => {
      const caps = detectCapabilities();
      expect(caps).toHaveProperty('pushNotifications');
      expect(caps).toHaveProperty('backgroundSync');
      expect(caps).toHaveProperty('persistentStorage');
      expect(caps).toHaveProperty('badgeAPI');
      expect(caps).toHaveProperty('shareAPI');
      expect(caps).toHaveProperty('shareTarget');
      expect(caps).toHaveProperty('notifications');
      expect(caps).toHaveProperty('serviceWorker');
      expect(caps).toHaveProperty('installed');
      expect(caps).toHaveProperty('platform');
    });

    it('platform is one of ios, android, desktop, or unknown', () => {
      const caps = detectCapabilities();
      expect(['ios', 'android', 'desktop', 'unknown']).toContain(caps.platform);
    });
  });

  describe('isInstalledPWA', () => {
    it('returns false in normal browser context', () => {
      expect(isInstalledPWA()).toBe(false);
    });
  });

  describe('requestPersistentStorage', () => {
    it('returns false when storage.persist is unavailable', async() => {
      const original = navigator.storage;
      Object.defineProperty(navigator, 'storage', {
        configurable: true,
        value: {},
      });
      const result = await requestPersistentStorage();
      expect(result).toBe(false);
      Object.defineProperty(navigator, 'storage', {
        configurable: true,
        value: original,
      });
    });
  });

  describe('getStorageEstimate', () => {
    it('returns null when estimate is unavailable', async() => {
      const original = navigator.storage;
      Object.defineProperty(navigator, 'storage', {
        configurable: true,
        value: {},
      });
      const result = await getStorageEstimate();
      expect(result).toBeNull();
      Object.defineProperty(navigator, 'storage', {
        configurable: true,
        value: original,
      });
    });
  });
});

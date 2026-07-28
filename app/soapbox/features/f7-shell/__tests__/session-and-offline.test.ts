import { getLastRoute, clearRouteState } from '../hooks/use-route-state';

describe('F7 Shell Session State', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe('getLastRoute', () => {
    it('returns null when no saved state exists', () => {
      expect(getLastRoute()).toBeNull();
    });

    it('returns saved route when valid', () => {
      const state = { path: '/notifications', search: '?tab=all', hash: '', timestamp: Date.now() };
      sessionStorage.setItem('mangane:f7-shell:last-route', JSON.stringify(state));
      const result = getLastRoute();
      expect(result).toEqual({ path: '/notifications', search: '?tab=all', hash: '' });
    });

    it('returns null and clears when saved state is too old', () => {
      const oldTimestamp = Date.now() - (25 * 60 * 60 * 1000); // 25 hours ago
      const state = { path: '/settings', search: '', hash: '', timestamp: oldTimestamp };
      sessionStorage.setItem('mangane:f7-shell:last-route', JSON.stringify(state));
      expect(getLastRoute()).toBeNull();
      expect(sessionStorage.getItem('mangane:f7-shell:last-route')).toBeNull();
    });

    it('returns null for malformed JSON', () => {
      sessionStorage.setItem('mangane:f7-shell:last-route', 'not json');
      expect(getLastRoute()).toBeNull();
    });
  });

  describe('clearRouteState', () => {
    it('removes the saved route', () => {
      const state = { path: '/bookmarks', search: '', hash: '', timestamp: Date.now() };
      sessionStorage.setItem('mangane:f7-shell:last-route', JSON.stringify(state));
      clearRouteState();
      expect(sessionStorage.getItem('mangane:f7-shell:last-route')).toBeNull();
    });

    it('does not throw when no state exists', () => {
      expect(() => clearRouteState()).not.toThrow();
    });
  });
});

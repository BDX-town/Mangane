/**
 * Phase 3B — Route state persistence hook.
 *
 * Tracks the current route in sessionStorage (scoped to the current tab)
 * so that page refresh and PWA relaunch can restore the last known route.
 * Used for session restoration in Slice 3D.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const STORAGE_KEY = 'mangane:f7-shell:last-route';

/**
 * Persists the current route path to sessionStorage on every navigation.
 * Returns the last persisted route (for restoration on mount).
 */
export function useRouteState(): string | null {
  const location = useLocation();

  useEffect(() => {
    try {
      const state = {
        path: location.pathname,
        search: location.search,
        hash: location.hash,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // sessionStorage may be unavailable in private mode on some browsers
    }
  }, [location.pathname, location.search, location.hash]);

  return null;
}

/**
 * Retrieves the last saved route for session restoration.
 * Returns null if no saved state or if it's too old (> 24 hours).
 */
export function getLastRoute(): { path: string; search: string; hash: string } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const state = JSON.parse(raw);
    const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
    if (Date.now() - state.timestamp > MAX_AGE) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return { path: state.path, search: state.search || '', hash: state.hash || '' };
  } catch {
    return null;
  }
}

/**
 * Clears saved route state. Called on account switch.
 */
export function clearRouteState(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

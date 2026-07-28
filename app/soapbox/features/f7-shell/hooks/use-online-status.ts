/**
 * Phase 3D — Online/offline detection for the F7 shell.
 *
 * Provides reactive online status for displaying offline banners and
 * preventing navigation to network-dependent routes.
 */
import { useState, useEffect, useCallback } from 'react';

export interface OnlineState {
  /** Whether the browser reports network connectivity */
  isOnline: boolean;
  /** Timestamp of the last online→offline transition (or null if online) */
  offlineSince: number | null;
}

/**
 * Returns reactive online/offline state.
 * Uses the Navigator.onLine API with online/offline event listeners.
 */
export function useOnlineStatus(): OnlineState {
  const [state, setState] = useState<OnlineState>(() => ({
    isOnline: navigator.onLine,
    offlineSince: navigator.onLine ? null : Date.now(),
  }));

  const handleOnline = useCallback(() => {
    setState({ isOnline: true, offlineSince: null });
  }, []);

  const handleOffline = useCallback(() => {
    setState({ isOnline: false, offlineSince: Date.now() });
  }, []);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return state;
}

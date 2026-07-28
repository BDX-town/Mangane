/**
 * Phase 3D — Account switch handler for the F7 shell.
 *
 * Watches for account changes and clears navigation state when the user
 * switches accounts or logs out. This prevents cross-account route leakage
 * and ensures a clean navigation stack.
 */
import { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { useOwnAccount } from 'soapbox/hooks';

import { clearRouteState } from './use-route-state';

/**
 * Clears F7 shell navigation state and redirects to home when the
 * active account changes.
 */
export function useAccountSwitch(): void {
  const account = useOwnAccount();
  const history = useHistory();
  const previousAccountUrl = useRef<string | null>(null);

  useEffect(() => {
    const currentUrl = account?.url ?? null;

    // On first mount, just record the current account
    if (previousAccountUrl.current === null) {
      previousAccountUrl.current = currentUrl;
      return;
    }

    // Account changed — clear state and navigate home
    if (currentUrl !== previousAccountUrl.current) {
      clearRouteState();
      previousAccountUrl.current = currentUrl;

      // Only redirect if we're switching between accounts (not logging out)
      if (currentUrl !== null) {
        history.replace('/');
      }
    }
  }, [account?.url, history]);
}

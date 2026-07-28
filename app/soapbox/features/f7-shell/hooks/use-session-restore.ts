/**
 * Phase 3D — Session restoration for the F7 shell.
 *
 * On mount (page refresh or PWA relaunch), checks if there's a saved route
 * in sessionStorage and navigates to it. Only restores if the saved route
 * is still valid and the user is authenticated.
 */
import { useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { useOwnAccount } from 'soapbox/hooks';

import { findRoute } from '../route-manifest';

import { getLastRoute } from './use-route-state';

/**
 * Restores the last visited route on PWA relaunch or page refresh.
 * Only runs once on mount. Does not restore for unauthenticated users
 * or if the saved route requires authentication.
 */
export function useSessionRestore(): void {
  const history = useHistory();
  const location = useLocation();
  const account = useOwnAccount();
  const restored = useRef(false);

  useEffect(() => {
    // Only attempt restoration once, on the root path
    if (restored.current) return;
    if (location.pathname !== '/') return;
    restored.current = true;

    const saved = getLastRoute();
    if (!saved || saved.path === '/') return;

    // Validate the route exists in the manifest
    const route = findRoute(saved.path);
    if (!route) return;

    // Don't restore routes that require auth if user isn't logged in
    if (!route.publicRoute && !account) return;

    // Don't restore admin/staff routes unless user has access
    if (route.staffOnly && !account?.staff) return;
    if (route.adminOnly && !account?.admin) return;

    // Restore
    history.replace(saved.path + saved.search + saved.hash);
  }, [account, history, location.pathname]);
}

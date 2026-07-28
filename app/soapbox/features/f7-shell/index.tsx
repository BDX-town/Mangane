/**
 * Phase 3 — Framework7 adaptive application shell.
 *
 * This module provides the Framework7 React app root that replaces the legacy
 * Layout + React Router shell when the `framework7Shell` feature flag is enabled.
 *
 * Layout selection:
 * - Phone (< 768px): bottom toolbar with tab navigation
 * - Tablet (768–1024px): split view with sidebar + main panel
 * - Desktop (> 1024px): multi-column with sidebar, main, and aside
 *
 * Content components are rendered unchanged through a compatibility bridge.
 */
import classNames from 'classnames';
import { App, View, Panel } from 'framework7-react';
import React, { useMemo } from 'react';

import { useAppSelector, useOwnAccount, useSettings } from 'soapbox/hooks';
import { isStandalone } from 'soapbox/utils/state';

import F7BottomTabs from './components/bottom-tabs';
import F7DesktopLayout from './components/desktop-layout';
import OfflineBanner from './components/offline-banner';
import RouteErrorBoundary from './components/route-error-boundary';
import F7SidebarNavigation from './components/sidebar-navigation';
import { useAccountSwitch } from './hooks/use-account-switch';
import { useBreakpoint } from './hooks/use-breakpoint';
import { useOnlineStatus } from './hooks/use-online-status';
import { useRouteState } from './hooks/use-route-state';
import { useSessionRestore } from './hooks/use-session-restore';
import { useViewport } from './hooks/use-viewport';
import { getTransitionCssVars } from './transitions';

/** Framework7 app parameters — no router in Slice 3A. */
const f7params = {
  name: 'Mangane',
  theme: 'ios' as const,
  colors: {
    primary: '#4338ca',
  },
};

export type ShellBreakpoint = 'phone' | 'tablet' | 'desktop';

interface F7ShellProps {
  children: React.ReactNode;
}

/**
 * The Framework7 adaptive shell.
 * Wraps existing content in the appropriate phone/tablet/desktop layout.
 */
const F7Shell: React.FC<F7ShellProps> = ({ children }) => {
  const breakpoint = useBreakpoint();
  const account = useOwnAccount();
  const standalone = useAppSelector(isStandalone);
  const settings = useSettings();
  const reduceMotion = settings.get('reduceMotion') as boolean;
  const { keyboardVisible, isStandalone: isPwa, orientation } = useViewport();
  const { isOnline } = useOnlineStatus();

  // Persist current route for session restoration
  useRouteState();

  // Handle account switch — clears navigation state
  useAccountSwitch();

  // Restore last route on PWA relaunch / page refresh
  useSessionRestore();

  // Compute transition CSS variables based on reduced-motion preference
  const transitionVars = useMemo(
    () => getTransitionCssVars(reduceMotion),
    [reduceMotion],
  );

  const shellClasses = classNames('f7-shell', {
    'f7-shell--keyboard-visible': keyboardVisible,
    'f7-shell--standalone': isPwa,
    'f7-shell--landscape': orientation === 'landscape',
  });

  return (
    <App {...f7params} className={shellClasses} style={transitionVars as React.CSSProperties}>
      <OfflineBanner isOffline={!isOnline} />

      {breakpoint === 'desktop' && (
        <F7DesktopLayout standalone={standalone}>
          <RouteErrorBoundary>
            {children}
          </RouteErrorBoundary>
        </F7DesktopLayout>
      )}

      {breakpoint === 'tablet' && (
        <div className='f7-shell__tablet'>
          <Panel left cover visibleBreakpoint={768} className='f7-shell__sidebar-panel'>
            {!standalone && <F7SidebarNavigation />}
          </Panel>
          <View main className='f7-shell__main-view'>
            <RouteErrorBoundary>
              {children}
            </RouteErrorBoundary>
          </View>
        </div>
      )}

      {breakpoint === 'phone' && (
        <div className='f7-shell__phone'>
          <View main className='f7-shell__main-view'>
            <RouteErrorBoundary>
              {children}
            </RouteErrorBoundary>
          </View>
          {account && !keyboardVisible && <F7BottomTabs />}
        </div>
      )}
    </App>
  );
};

export default F7Shell;

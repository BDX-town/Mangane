/**
 * Phase 3A — Desktop multi-column layout for the F7 shell.
 *
 * Mirrors the existing Layout component structure (Sidebar | Main | Aside)
 * but within the Framework7 App context. Uses F7's View for the main content
 * area while keeping the sidebar and aside as static panels.
 */
import { View } from 'framework7-react';
import React from 'react';

import F7SidebarNavigation from './sidebar-navigation';

interface DesktopLayoutProps {
  standalone: boolean;
  children: React.ReactNode;
}

const F7DesktopLayout: React.FC<DesktopLayoutProps> = ({ standalone, children }) => {
  return (
    <div className='f7-shell__desktop'>
      {!standalone && (
        <div className='f7-shell__desktop-sidebar'>
          <F7SidebarNavigation />
        </div>
      )}
      <View main className='f7-shell__desktop-main'>
        {children}
      </View>
      <div className='f7-shell__desktop-aside'>
        {/* Aside content injected by page components in later slices */}
      </div>
    </div>
  );
};

export default F7DesktopLayout;

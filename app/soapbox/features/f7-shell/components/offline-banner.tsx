/**
 * Phase 3D — Offline banner for the F7 shell.
 *
 * Displays a non-intrusive banner when network connectivity is lost.
 * Auto-dismisses when connectivity returns.
 */
import React from 'react';

interface OfflineBannerProps {
  /** Whether the device is currently offline */
  isOffline: boolean;
}

const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOffline }) => {
  if (!isOffline) return null;

  return (
    <div
      className='f7-shell__offline-banner'
      role='status'
      aria-live='polite'
      aria-atomic='true'
    >
      <span className='f7-shell__offline-banner-text'>
        You are offline. Some features may be unavailable.
      </span>
    </div>
  );
};

export default OfflineBanner;

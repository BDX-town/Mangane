/**
 * Phase 5E — Scroll anchor stability under environmental changes.
 *
 * Handles the cases where the scroll anchor needs adjustment due to:
 * - Orientation changes (viewport height changes)
 * - Dynamic text size / accessibility zoom
 * - Media loading (images pushing content down)
 * - Application updates (DOM structure changes)
 *
 * Strategy: when an environmental change is detected, re-capture the
 * current position immediately (bypassing throttle) to ensure the
 * anchor stays accurate. The position-anchor module handles persistence.
 *
 * This hook is used alongside useScrollAnchor in timeline components.
 */
import { useEffect, useRef, useCallback } from 'react';

import { capturePosition } from 'soapbox/db';

interface StabilityOptions {
  /** Whether the anchor system is active */
  enabled: boolean;
  /** Current account URL */
  accountUrl: string | undefined;
  /** Current timeline ID */
  timelineId: string | undefined;
  /** Function to get the current anchor status ID and offset */
  getCurrentAnchor: () => { statusId: string; offset: number } | null;
}

/**
 * Monitors environmental changes that could invalidate the scroll position
 * and forces an immediate re-capture when they occur.
 */
export function useScrollAnchorStability({
  enabled,
  accountUrl,
  timelineId,
  getCurrentAnchor,
}: StabilityOptions): void {
  const anchorFn = useRef(getCurrentAnchor);
  anchorFn.current = getCurrentAnchor;

  const forceCapture = useCallback(() => {
    if (!enabled || !accountUrl || !timelineId) return;
    const anchor = anchorFn.current();
    if (!anchor) return;
    // Direct write bypassing throttle for critical stability events
    capturePosition(accountUrl, timelineId, anchor.statusId, anchor.offset);
  }, [enabled, accountUrl, timelineId]);

  useEffect(() => {
    if (!enabled) return;

    // 1. Orientation changes
    const orientationQuery = window.matchMedia('(orientation: portrait)');
    const handleOrientation = () => {
      // Delay slightly to let layout settle after orientation change
      setTimeout(forceCapture, 100);
    };
    orientationQuery.addEventListener('change', handleOrientation);

    // 2. Resize (text size changes, zoom, split-screen)
    let resizeRaf: number | null = null;
    const handleResize = () => {
      if (resizeRaf !== null) return;
      // eslint-disable-next-line compat/compat
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = null;
        forceCapture();
      });
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // 3. Visibility change (app coming back from background)
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        // Capture immediately before the tab goes to background
        forceCapture();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      orientationQuery.removeEventListener('change', handleOrientation);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (resizeRaf !== null) cancelAnimationFrame(resizeRaf);
    };
  }, [enabled, forceCapture]);
}

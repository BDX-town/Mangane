/**
 * Phase 3C — Viewport, keyboard, and orientation hooks.
 *
 * Handles:
 * - Virtual keyboard detection and content adjustment
 * - Orientation change scroll preservation
 * - Standalone PWA mode detection
 * - Safe-area inset awareness
 */
import { useState, useEffect, useCallback, useRef } from 'react';

export interface ViewportState {
  /** Whether the virtual keyboard is visible */
  keyboardVisible: boolean;
  /** Current viewport height (accounts for keyboard) */
  viewportHeight: number;
  /** Whether the app is running in standalone PWA mode */
  isStandalone: boolean;
  /** Current orientation: 'portrait' or 'landscape' */
  orientation: 'portrait' | 'landscape';
}

/**
 * Detects virtual keyboard visibility using the Visual Viewport API.
 * Falls back to window.innerHeight comparison when unavailable.
 */
export function useViewport(): ViewportState {
  const [state, setState] = useState<ViewportState>(() => ({
    keyboardVisible: false,
    viewportHeight: window.innerHeight,
    isStandalone: window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true,
    orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
  }));

  const initialHeight = useRef(window.innerHeight);

  const updateViewport = useCallback(() => {
    const visualViewport = window.visualViewport;
    const currentHeight = visualViewport?.height ?? window.innerHeight;
    // Keyboard is likely visible if viewport shrinks by more than 150px
    const keyboardVisible = initialHeight.current - currentHeight > 150;
    const orientation = currentHeight > (visualViewport?.width ?? window.innerWidth)
      ? 'portrait' as const
      : 'landscape' as const;

    setState(prev => {
      if (
        prev.keyboardVisible === keyboardVisible &&
        prev.viewportHeight === currentHeight &&
        prev.orientation === orientation
      ) {
        return prev;
      }
      return { ...prev, keyboardVisible, viewportHeight: currentHeight, orientation };
    });
  }, []);

  useEffect(() => {
    const visualViewport = window.visualViewport;

    if (visualViewport) {
      visualViewport.addEventListener('resize', updateViewport);
      visualViewport.addEventListener('scroll', updateViewport);
    } else {
      window.addEventListener('resize', updateViewport, { passive: true });
    }

    // Also listen for orientation changes
    const orientationMedia = window.matchMedia('(orientation: portrait)');
    const handleOrientation = () => updateViewport();
    orientationMedia.addEventListener('change', handleOrientation);

    return () => {
      if (visualViewport) {
        visualViewport.removeEventListener('resize', updateViewport);
        visualViewport.removeEventListener('scroll', updateViewport);
      } else {
        window.removeEventListener('resize', updateViewport);
      }
      orientationMedia.removeEventListener('change', handleOrientation);
    };
  }, [updateViewport]);

  return state;
}

/**
 * Preserves scroll position across orientation changes.
 * Restores the relative scroll position after the viewport dimensions change.
 */
export function useOrientationScrollPreserve(containerRef: React.RefObject<HTMLElement | null>): void {
  const scrollRatio = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const saveScroll = () => {
      const maxScroll = container.scrollHeight - container.clientHeight;
      scrollRatio.current = maxScroll > 0 ? container.scrollTop / maxScroll : 0;
    };

    const restoreScroll = () => {
      // Use rAF to wait for layout recalculation after orientation change
      // eslint-disable-next-line compat/compat
      requestAnimationFrame(() => {
        const maxScroll = container.scrollHeight - container.clientHeight;
        container.scrollTop = scrollRatio.current * maxScroll;
      });
    };

    const orientationMedia = window.matchMedia('(orientation: portrait)');
    const handleChange = () => {
      saveScroll();
      restoreScroll();
    };

    orientationMedia.addEventListener('change', handleChange);
    return () => orientationMedia.removeEventListener('change', handleChange);
  }, [containerRef]);
}

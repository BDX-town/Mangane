/**
 * Reactive breakpoint detection for the F7 shell.
 * Uses the same breakpoint values as the design token system.
 *
 * - phone: < 768px
 * - tablet: 768px – 1024px
 * - desktop: > 1024px
 */
import { useState, useEffect } from 'react';

import type { ShellBreakpoint } from '../index';

const TABLET_MIN = 768;
const DESKTOP_MIN = 1025;

function getBreakpoint(): ShellBreakpoint {
  const width = window.innerWidth;
  if (width >= DESKTOP_MIN) return 'desktop';
  if (width >= TABLET_MIN) return 'tablet';
  return 'phone';
}

/**
 * Returns the current shell breakpoint and updates reactively on resize.
 */
export function useBreakpoint(): ShellBreakpoint {
  const [breakpoint, setBreakpoint] = useState<ShellBreakpoint>(getBreakpoint);

  useEffect(() => {
    let raf: number | null = null;

    const handleResize = () => {
      if (raf !== null) return;
      // eslint-disable-next-line compat/compat
      raf = requestAnimationFrame(() => {
        raf = null;
        setBreakpoint(getBreakpoint());
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return breakpoint;
}

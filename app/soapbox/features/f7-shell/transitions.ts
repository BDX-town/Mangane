/**
 * Phase 3C — Page transition configuration.
 *
 * Defines transition behavior for the F7 shell based on user preferences
 * and system settings. Reduced-motion variants use opacity-only crossfade
 * with near-instant duration matching --ds-motion-duration-fast (0.01ms).
 *
 * Standard transitions use F7's built-in iOS-style push/pop animations.
 */

export interface TransitionConfig {
  /** Whether page transitions are animated */
  animate: boolean;
  /** Duration in milliseconds */
  duration: number;
  /** CSS transition timing function */
  easing: string;
}

/**
 * Returns transition configuration based on reduced-motion preference.
 */
export function getTransitionConfig(reduceMotion: boolean): TransitionConfig {
  if (reduceMotion) {
    return {
      animate: true,
      duration: 1, // Near-instant (0.01ms not supported, use 1ms)
      easing: 'linear',
    };
  }

  return {
    animate: true,
    duration: 300,
    easing: 'cubic-bezier(0.2, 0, 0, 1)', // --ds-motion-easing-standard
  };
}

/**
 * CSS custom properties for page transitions.
 * Applied to the F7 shell root to control animation behavior.
 */
export function getTransitionCssVars(reduceMotion: boolean): Record<string, string> {
  const config = getTransitionConfig(reduceMotion);

  return {
    '--f7-page-transition-duration': `${config.duration}ms`,
    '--f7-page-transition-easing': config.easing,
  };
}

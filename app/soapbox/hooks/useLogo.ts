import { useSettings } from './useSettings';
import { useSoapboxConfig } from './useSoapboxConfig';
import { useTheme } from './useTheme';

/**
 * Return the actual logo
 * @returns
 */
const useLogo = (): string => {
  const settings = useSettings();
  const { logo, logoDarkMode } = useSoapboxConfig();
  const darkMode = useTheme() === 'dark';

  /** Mangane logo. */
  const manganeLogo = require('images/mangane-logo.svg');

  // Use the right logo if provided, then use fallbacks.
  const getSrc = () => {
    // In demo mode, use the mangane logo.
    if (settings.get('demo')) return manganeLogo;

    return (darkMode && logoDarkMode)
      ? logoDarkMode
      : logo || logoDarkMode || manganeLogo;
  };

  return getSrc();
};

export { useLogo };
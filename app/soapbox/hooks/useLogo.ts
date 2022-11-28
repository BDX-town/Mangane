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

  /** Soapbox logo. */
  const soapboxLogo = darkMode
    ? require('images/soapbox-logo-white.svg')
    : require('images/soapbox-logo.svg');

  // Use the right logo if provided, then use fallbacks.
  const getSrc = () => {
    // In demo mode, use the Soapbox logo.
    if (settings.get('demo')) return soapboxLogo;

    return (darkMode && logoDarkMode)
      ? logoDarkMode
      : logo || logoDarkMode || soapboxLogo;
  };

  return getSrc();
};

export { useLogo };
import classNames from 'classnames';
import React from 'react';

import { useSoapboxConfig, useSettings, useSystemTheme } from 'soapbox/hooks';

interface ISiteLogo extends React.ComponentProps<'img'> {
  /** Extra class names for the <img> element. */
  className?: string,
  /** Override theme setting for <SitePreview /> */
  theme?: 'dark' | 'light',
}

/** Display the most appropriate site logo based on the theme and configuration. */
const SiteLogo: React.FC<ISiteLogo> = ({ className, theme, ...rest }) => {
  const { logo, logoDarkMode } = useSoapboxConfig();
  const settings = useSettings();

  const systemTheme = useSystemTheme();
  const userTheme = settings.get('themeMode');
  const darkMode = theme
    ? theme === 'dark'
    : (userTheme === 'dark' || (userTheme === 'system' && systemTheme === 'dark'));

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

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      className={classNames('object-contain', className)}
      src={getSrc()}
      {...rest}
    />
  );
};

export default SiteLogo;

import classNames from 'classnames';
import React from 'react';

import { useLogo } from 'soapbox/hooks';


import { Icon } from './ui';

interface ISiteLogo extends React.ComponentProps<'img'> {
  /** Extra class names for the <img> element. */
  className?: string,
  /** Override theme setting for <SitePreview /> */
  theme?: 'dark' | 'light',
}

/** Display the most appropriate site logo based on the theme and configuration. */
const SiteLogo: React.FC<ISiteLogo> = ({ className, theme, ...rest }) => {
  const logo = useLogo();
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Icon
      className={
        classNames(
          'text-primary-500',
          'object-contain',
          className,
        )
      }
      src={logo}
      {...rest}
    />
  );
};

export default SiteLogo;

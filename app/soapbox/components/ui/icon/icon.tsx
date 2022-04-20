import React from 'react';

import SvgIcon from './svg-icon';

interface IIcon extends Pick<React.SVGAttributes<SVGAElement>, 'strokeWidth'> {
  className?: string,
  count?: number,
  alt?: string,
  src: string,
  size?: number,
}

const Icon = ({ src, alt, count, size, ...filteredProps }: IIcon): JSX.Element => (
  <div className='relative' data-testid='icon'>
    {count ? (
      <span className='absolute -top-2 -right-3 block px-1.5 py-0.5 bg-accent-500 text-xs text-white rounded-full ring-2 ring-white'>
        {count}
      </span>
    ) : null}

    <SvgIcon src={src} size={size} alt={alt} {...filteredProps} />
  </div>
);

export default Icon;

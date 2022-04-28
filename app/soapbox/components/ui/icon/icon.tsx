import React from 'react';

import Counter from '../counter/counter';

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
      <span className='absolute -top-2 -right-3'>
        <Counter count={count} />
      </span>
    ) : null}

    <SvgIcon src={src} size={size} alt={alt} {...filteredProps} />
  </div>
);

export default Icon;

import React from 'react';

import Counter from '../counter/counter';

import SvgIcon from './svg-icon';

interface IIcon extends Pick<React.SVGAttributes<SVGAElement>, 'strokeWidth'> {
  /** Class name for the <svg> element. */
  className?: string,
  /** Number to display a counter over the icon. */
  count?: number,
  /** Tooltip text for the icon. */
  alt?: string,
  /** URL to the svg icon. */
  src: string,
  /** Width and height of the icon in pixels. */
  size?: number,
}

/** Renders and SVG icon with optional counter. */
const Icon: React.FC<IIcon> = ({ src, alt, count, size, ...filteredProps }): JSX.Element => (
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

import React from 'react';
import InlineSVG from 'react-inlinesvg';

interface IIcon {
  className?: string,
  count?: number,
  alt?: string,
  src: string,
}

const Icon = ({ src, alt, count, ...filteredProps }: IIcon): JSX.Element => {
  return (
    <div className='relative'>
      {count ? (
        <span className='absolute -top-2 -right-3 block px-1.5 py-0.5 bg-accent-500 text-xs text-white rounded-full ring-2 ring-white'>
          {count}
        </span>
      ) : null}

      <InlineSVG src={src} title={alt} {...filteredProps} />
    </div>
  );
};

export default Icon;

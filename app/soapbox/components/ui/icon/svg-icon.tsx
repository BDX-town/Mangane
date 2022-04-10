import React from 'react';
import InlineSVG from 'react-inlinesvg';

interface ISvgIcon {
  className?: string,
  alt?: string,
  src: string,
  size?: number,
}

/** Renders an inline SVG with an empty frame loading state */
const SvgIcon: React.FC<ISvgIcon> = ({ src, alt, size = 24, className }): JSX.Element => {
  const loader = (
    <svg
      className={className}
      width={size}
      height={size}
      data-src={src}
      data-testid='svg-icon-loader'
    />
  );

  return (
    <InlineSVG
      className={className}
      src={src}
      title={alt}
      width={size}
      height={size}
      loader={loader}
      data-testid='svg-icon'
    />
  );
};

export default SvgIcon;

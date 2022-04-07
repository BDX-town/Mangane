import React from 'react';
import InlineSVG from 'react-inlinesvg';

interface ISvgIcon {
  className?: string,
  alt?: string,
  src: string,
  size?: number,
}

/** Renders an inline SVG with an empty frame loading state */
const SvgIcon = ({ src, alt, size = 24, className }: ISvgIcon): JSX.Element => (
  <InlineSVG
    className={className}
    src={src}
    title={alt}
    width={size}
    height={size}
    loader={<div style={{ width: size, height: size }} />}
  />
);

export default SvgIcon;

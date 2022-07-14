/**
 * SvgIcon: abstact component to render SVG icons.
 * @module soapbox/components/svg_icon
 * @see soapbox/components/icon
 */

import classNames from 'classnames';
import React from 'react';
import InlineSVG from 'react-inlinesvg'; // eslint-disable-line no-restricted-imports

export interface ISvgIcon extends React.HTMLAttributes<HTMLDivElement> {
  src: string,
  id?: string,
  alt?: string,
  className?: string,
}

const SvgIcon: React.FC<ISvgIcon> = ({ src, alt, className, ...rest }) => {
  return (
    <div
      className={classNames('svg-icon', className)}
      {...rest}
    >
      <InlineSVG src={src} title={alt} loader={<></>} />
    </div>
  );
};

export default SvgIcon;

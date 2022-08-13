/**
 * Icon: abstract icon class that can render icons from multiple sets.
 * @module soapbox/components/icon
 * @see soapbox/components/fork_awesome_icon
 * @see soapbox/components/svg_icon
 */

import React from 'react';

import ForkAwesomeIcon, { IForkAwesomeIcon } from './fork_awesome_icon';
import SvgIcon, { ISvgIcon } from './svg_icon';

export type IIcon = IForkAwesomeIcon | ISvgIcon;

const Icon: React.FC<IIcon> = (props) => {
  if ((props as ISvgIcon).src) {
    const { src, ...rest } = (props as ISvgIcon);

    return <SvgIcon src={src} {...rest} />;
  } else {
    const { id, fixedWidth, ...rest } = (props as IForkAwesomeIcon);

    return <ForkAwesomeIcon id={id} fixedWidth={fixedWidth} {...rest} />;
  }
};

export default Icon;

import { default as ReachTooltip } from '@reach/tooltip';
import React from 'react';

import './tooltip.css';

interface ITooltip {
  /** Text to display in the tooltip. */
  text: string,
}

/** Hoverable tooltip element. */
const Tooltip: React.FC<ITooltip> = ({
  children,
  text,
}) => {
  return (
    <ReachTooltip label={text}>
      {children}
    </ReachTooltip>
  );
};

export default Tooltip;

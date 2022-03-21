import { default as ReachTooltip } from '@reach/tooltip';
import React from 'react';

import './tooltip.css';

interface ITooltip {
  text: string,
}

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

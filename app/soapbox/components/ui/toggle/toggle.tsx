import React from 'react';
import ReactToggle, { ToggleProps } from 'react-toggle';

/** A glorified checkbox. Wrapper around react-toggle. */
const Toggle: React.FC<ToggleProps> = ({ icons = false, ...rest }) => {
  return (
    <ReactToggle
      icons={icons}
      {...rest}
    />
  );
};

export default Toggle;

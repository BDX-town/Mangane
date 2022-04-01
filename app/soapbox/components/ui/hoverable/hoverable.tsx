import Portal from '@reach/portal';
import React, { useState, useRef } from 'react';

interface IHoverable {
  component: React.Component,
}

/** Wrapper to render a given component when hovered */
const Hoverable: React.FC<IHoverable> = ({
  component,
  children,
}): JSX.Element => {

  const [portalActive, setPortalActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setPortalActive(true);
  };

  const handleMouseLeave = () => {
    setPortalActive(false);
  };

  const setPortalPosition = (): React.CSSProperties => {
    if (!ref.current) return {};

    const { top, height, left, width } = ref.current.getBoundingClientRect();

    return {
      top: top + height,
      left,
      width,
    };
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={ref}
    >
      {children}
      {portalActive && <Portal><div className='fixed' style={setPortalPosition()}>{component}</div></Portal>}
    </div>
  );
};

export default Hoverable;

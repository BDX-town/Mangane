import classNames from 'classnames';
import React, { useState, useRef } from 'react';
import { usePopper } from 'react-popper';

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
  const popperRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setPortalActive(true);
  };

  const handleMouseLeave = () => {
    setPortalActive(false);
  };

  const { styles, attributes } = usePopper(ref.current, popperRef.current, {
    placement: 'top-start',
    strategy: 'fixed',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [-10, 0],
        },
      },
    ],
  });

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={ref}
    >
      {children}

      <div
        className={classNames('fixed z-50 transition-opacity duration-100', {
          'opacity-0 pointer-events-none': !portalActive,
        })}
        ref={popperRef}
        style={styles.popper}
        {...attributes.popper}
      >
        {component}
      </div>
    </div>
  );
};

export default Hoverable;

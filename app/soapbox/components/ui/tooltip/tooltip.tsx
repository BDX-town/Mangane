import Portal from '@reach/portal';
import { TooltipPopup, useTooltip } from '@reach/tooltip';
import React from 'react';

import './tooltip.css';

interface ITooltip {
  /** Text to display in the tooltip. */
  text: string,
}

const centered = (triggerRect: any, tooltipRect: any) => {
  const triggerCenter = triggerRect.left + triggerRect.width / 2;
  const left = triggerCenter - tooltipRect.width / 2;
  const maxLeft = window.innerWidth - tooltipRect.width - 2;
  return {
    left: Math.min(Math.max(2, left), maxLeft) + window.scrollX,
    top: triggerRect.bottom + 8 + window.scrollY,
  };
};

/** Hoverable tooltip element. */
const Tooltip: React.FC<ITooltip> = ({
  children,
  text,
}) => {
  // get the props from useTooltip
  const [trigger, tooltip] = useTooltip();

  // destructure off what we need to position the triangle
  const { isVisible, triggerRect } = tooltip;

  return (
    <React.Fragment>
      {React.cloneElement(children as any, trigger)}

      {isVisible && (
        // The Triangle. We position it relative to the trigger, not the popup
        // so that collisions don't have a triangle pointing off to nowhere.
        // Using a Portal may seem a little extreme, but we can keep the
        // positioning logic simpler here instead of needing to consider
        // the popup's position relative to the trigger and collisions
        <Portal>
          <div
            data-reach-tooltip-arrow='true'
            style={{
              left:
                triggerRect && triggerRect.left - 10 + triggerRect.width / 2 as any,
              top: triggerRect && triggerRect.bottom + window.scrollY as any,
            }}
          />
        </Portal>
      )}
      <TooltipPopup
        {...tooltip}
        label={text}
        aria-label={text}
        position={centered}
      />
    </React.Fragment>
  );
};

export default Tooltip;

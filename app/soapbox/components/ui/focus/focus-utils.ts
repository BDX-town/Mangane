import React from 'react';

/** Restores focus after a transient surface closes without trusting selectors. */
const useFocusReturn = (active: boolean): void => {
  const previous = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (active) {
      previous.current = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
      return;
    }

    const target = previous.current;
    if (target?.isConnected && typeof target.focus === 'function') target.focus();
    previous.current = null;
  }, [active]);
};

export { useFocusReturn };

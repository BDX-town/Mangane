import classNames from 'classnames';
import React from 'react';

interface IChip {
  children: React.ReactNode,
  className?: string,
  disabled?: boolean,
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
  selected?: boolean,
}

/** Compact label or native toggle button for filtering and selection. */
const Chip = React.forwardRef<HTMLButtonElement, IChip>(({
  children,
  className,
  disabled = false,
  onClick,
  selected = false,
}, ref): JSX.Element => {
  const classes = classNames('ds-chip', { 'ds-chip--selected': selected }, className);

  if (!onClick) return <span className={classes}>{children}</span>;

  return (
    <button
      ref={ref}
      type='button'
      className={classes}
      disabled={disabled}
      aria-pressed={selected}
      onClick={onClick}
    >
      {children}
    </button>
  );
});

Chip.displayName = 'Chip';

export default Chip;

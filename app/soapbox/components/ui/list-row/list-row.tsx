import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';

interface IListRow {
  children: React.ReactNode,
  className?: string,
  disabled?: boolean,
  leading?: React.ReactNode,
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
  selected?: boolean,
  to?: string,
  trailing?: React.ReactNode,
}

/** A content-led row with native static, button, or link semantics. */
const ListRow = React.forwardRef<HTMLButtonElement, IListRow>(({
  children,
  className,
  disabled = false,
  leading,
  onClick,
  selected = false,
  to,
  trailing,
}, ref): JSX.Element => {
  const content = (
    <>
      {leading ? <span className='ds-list-row__leading'>{leading}</span> : null}
      <span className='ds-list-row__content'>{children}</span>
      {trailing ? <span className='ds-list-row__trailing'>{trailing}</span> : null}
    </>
  );
  const classes = classNames('ds-list-row', { 'ds-list-row--selected': selected }, className);

  if (to) {
    return (
      <Link
        to={to}
        className={classes}
        aria-current={selected || undefined}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        onClick={disabled ? event => event.preventDefault() : undefined}
      >
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        ref={ref}
        type='button'
        className={classes}
        disabled={disabled}
        aria-pressed={selected}
        onClick={onClick}
      >
        {content}
      </button>
    );
  }

  return <div className={classes}>{content}</div>;
});

ListRow.displayName = 'ListRow';

export default ListRow;

import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';

interface IListRowBase {
  children: React.ReactNode,
  className?: string,
  disabled?: boolean,
  leading?: React.ReactNode,
  selected?: boolean,
  trailing?: React.ReactNode,
}

interface IListRowAction extends IListRowBase {
  onClick: React.MouseEventHandler<HTMLButtonElement>,
  to?: undefined,
}

interface IListRowLink extends IListRowBase {
  onClick?: React.MouseEventHandler<HTMLAnchorElement>,
  to: string,
}

interface IListRowStatic extends IListRowBase {
  onClick?: undefined,
  to?: undefined,
}

type IListRow = IListRowAction | IListRowLink | IListRowStatic;

interface ListRowComponent {
  (props: IListRowAction & React.RefAttributes<HTMLButtonElement>): JSX.Element,
  (props: IListRowLink & React.RefAttributes<HTMLAnchorElement>): JSX.Element,
  (props: IListRowStatic): JSX.Element,
  displayName?: string,
}

const isListRowLink = (props: IListRow): props is IListRowLink =>
  typeof props.to === 'string';

const isListRowAction = (props: IListRow): props is IListRowAction =>
  typeof props.onClick === 'function';

/** A content-led row with native static, button, or link semantics. */
const ListRow = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, IListRow>((props, ref): JSX.Element => {
  const {
    children,
    className,
    disabled = false,
    leading,
    selected = false,
    trailing,
  } = props;
  const content = (
    <>
      {leading ? <span className='ds-list-row__leading'>{leading}</span> : null}
      <span className='ds-list-row__content'>{children}</span>
      {trailing ? <span className='ds-list-row__trailing'>{trailing}</span> : null}
    </>
  );
  const classes = classNames('ds-list-row', { 'ds-list-row--selected': selected }, className);

  if (isListRowLink(props)) {
    const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      props.onClick?.(event);
    };

    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        to={props.to}
        className={classes}
        aria-current={selected || undefined}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        onClick={handleLinkClick}
      >
        {content}
      </Link>
    );
  }

  if (isListRowAction(props)) {
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type='button'
        className={classes}
        disabled={disabled}
        aria-pressed={selected}
        onClick={props.onClick}
      >
        {content}
      </button>
    );
  }

  return <div className={classes}>{content}</div>;
}) as ListRowComponent;

ListRow.displayName = 'ListRow';

export default ListRow;

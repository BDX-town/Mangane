import * as React from 'react';
import { Link } from 'react-router-dom';

import Icon from '../icon/icon';

import { useButtonStyles } from './useButtonStyles';

import type { ButtonSizes, ButtonThemes } from './useButtonStyles';

interface IButton {
  /** Accessible name when visible content is insufficient. */
  'aria-label'?: string,
  /** Whether this button expands the width of its container. */
  block?: boolean,
  /** Elements inside the <button> */
  children?: React.ReactNode,
  classNames?: string,
  /** Prevent the button from being clicked. */
  disabled?: boolean,
  /** URL to an SVG icon to render inside the button. */
  icon?: string,
  /** Action when the button is clicked. */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
  /** Exposes an in-progress operation and prevents duplicate activation. */
  loading?: boolean,
  /** Exposes toggle-button state. */
  pressed?: boolean,
  /** A predefined button size. */
  size?: ButtonSizes,
  style?: React.CSSProperties,
  /** Text inside the button. Takes precedence over `children`. */
  text?: React.ReactNode,
  /** Makes the button into a navlink, if provided. */
  to?: string,
  /** Styles the button visually with a predefined theme. */
  theme?: ButtonThemes,
  /** Whether this button should submit a form by default. */
  type?: 'button' | 'submit',
}

/** Customizable button element with various themes. */
const Button = React.forwardRef<HTMLButtonElement, IButton>((props, ref): JSX.Element => {
  const {
    classNames,
    block = false,
    children,
    disabled = false,
    icon,
    loading = false,
    onClick,
    pressed,
    size = 'md',
    text,
    theme = 'accent',
    to,
    type = 'button',
    style,
  } = props;
  const unavailable = disabled || loading;

  const themeClass = useButtonStyles({
    theme,
    block,
    disabled: unavailable,
    size,
  });

  const renderIcon = () => {
    if (!icon) {
      return null;
    }

    return <Icon src={icon} className='mr-2 w-4 h-4' />;
  };

  const handleClick = React.useCallback((event) => {
    if (onClick && !unavailable) {
      onClick(event);
    }
  }, [onClick, unavailable]);

  const content = (
    <>
      {renderIcon()}
      {text || children}
    </>
  );

  if (to) {
    const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (unavailable) {
        event.preventDefault();
        return;
      }
      if (onClick) onClick(event as unknown as React.MouseEvent<HTMLButtonElement>);
    };

    return (
      <Link
        to={to}
        className={`${themeClass} ${classNames || ''}`}
        aria-disabled={unavailable || undefined}
        aria-busy={loading || undefined}
        aria-label={props['aria-label']}
        onClick={handleLinkClick}
        tabIndex={unavailable ? -1 : undefined}
        data-testid='button'
        style={style}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={`${themeClass} ${classNames || ''}`}
      disabled={unavailable}
      onClick={handleClick}
      ref={ref}
      type={type}
      aria-busy={loading || undefined}
      aria-label={props['aria-label']}
      aria-pressed={pressed}
      data-testid='button'
      style={style}
    >
      {content}
    </button>
  );
});

export default Button;

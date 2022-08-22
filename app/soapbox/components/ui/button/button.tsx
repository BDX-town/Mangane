import * as React from 'react';
import { Link } from 'react-router-dom';

import Icon from '../icon/icon';

import { useButtonStyles } from './useButtonStyles';

import type { ButtonSizes, ButtonThemes } from './useButtonStyles';

interface IButton {
  /** Whether this button expands the width of its container. */
  block?: boolean,
  /** Elements inside the <button> */
  children?: React.ReactNode,
  /** @deprecated unused */
  classNames?: string,
  /** Prevent the button from being clicked. */
  disabled?: boolean,
  /** URL to an SVG icon to render inside the button. */
  icon?: string,
  /** Action when the button is clicked. */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
  /** A predefined button size. */
  size?: ButtonSizes,
  /** @deprecated unused */
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
    block = false,
    children,
    disabled = false,
    icon,
    onClick,
    size = 'md',
    text,
    theme = 'accent',
    to,
    type = 'button',
  } = props;

  const themeClass = useButtonStyles({
    theme,
    block,
    disabled,
    size,
  });

  const renderIcon = () => {
    if (!icon) {
      return null;
    }

    return <Icon src={icon} className='mr-2 w-4 h-4' />;
  };

  const handleClick = React.useCallback((event) => {
    if (onClick && !disabled) {
      onClick(event);
    }
  }, [onClick, disabled]);

  const renderButton = () => (
    <button
      className={themeClass}
      disabled={disabled}
      onClick={handleClick}
      ref={ref}
      type={type}
      data-testid='button'
    >
      {renderIcon()}
      {text || children}
    </button>
  );

  if (to) {
    return (
      <Link to={to} tabIndex={-1} className='inline-flex'>
        {renderButton()}
      </Link>
    );
  }

  return renderButton();
});

export default Button;

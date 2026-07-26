import * as React from 'react';
import { Link } from 'react-router-dom';

import Icon from '../icon/icon';

import { useButtonStyles } from './useButtonStyles';

import type { ButtonSizes, ButtonThemes } from './useButtonStyles';

interface IButtonBase {
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
  /** Exposes an in-progress operation and prevents duplicate activation. */
  loading?: boolean,
  /** Exposes toggle-button state. */
  pressed?: boolean,
  /** A predefined button size. */
  size?: ButtonSizes,
  style?: React.CSSProperties,
  /** Text inside the button. Takes precedence over `children`. */
  text?: React.ReactNode,
  /** Styles the button visually with a predefined theme. */
  theme?: ButtonThemes,
  /** Whether this button should submit a form by default. */
  type?: 'button' | 'submit',
}

interface IButtonAction extends IButtonBase {
  /** Action when the button is clicked. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  to?: undefined,
}

interface IButtonLink extends IButtonBase {
  /** Optional navigation callback receiving the rendered anchor event. */
  onClick?: React.MouseEventHandler<HTMLAnchorElement>,
  /** Makes the button a navigation link. */
  to: string,
  type?: never,
}

type IButton = IButtonAction | IButtonLink;

interface ButtonComponent {
  (props: IButtonAction & React.RefAttributes<HTMLButtonElement>): JSX.Element,
  (props: IButtonLink & React.RefAttributes<HTMLAnchorElement>): JSX.Element,
}

const isButtonLink = (props: IButton): props is IButtonLink =>
  typeof props.to === 'string';

/** Customizable button element with various themes. */
const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, IButton>((props, ref): JSX.Element => {
  const {
    classNames,
    block = false,
    children,
    disabled = false,
    icon,
    loading = false,
    pressed,
    size = 'md',
    text,
    theme = 'accent',
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

  const content = (
    <>
      {renderIcon()}
      {text || children}
    </>
  );

  if (isButtonLink(props)) {
    const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (unavailable) {
        event.preventDefault();
        return;
      }
      props.onClick?.(event);
    };

    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        to={props.to}
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
      onClick={props.onClick}
      ref={ref as React.Ref<HTMLButtonElement>}
      type={props.type || 'button'}
      aria-busy={loading || undefined}
      aria-label={props['aria-label']}
      aria-pressed={pressed}
      data-testid='button'
      style={style}
    >
      {content}
    </button>
  );
}) as ButtonComponent;

export default Button;

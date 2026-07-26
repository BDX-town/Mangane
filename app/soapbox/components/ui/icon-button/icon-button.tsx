import classNames from 'classnames';
import React from 'react';

import SemanticIcon from '../icon/semantic-icon';
import SvgIcon from '../icon/svg-icon';
import Text from '../text/text';

import type { SemanticIconName } from '../icon/semantic-icon';

interface IIconButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Semantic icon name for new product-language consumers. */
  icon?: SemanticIconName,
  /** Class name for the <svg> icon. */
  iconClassName?: string,
  /** URL to the svg icon. */
  src?: string,
  /** Required accessible name for icon-only use. */
  label?: string,
  /** Exposes an in-progress operation and prevents duplicate activation. */
  loading?: boolean,
  /** Exposes toggle-button state. */
  pressed?: boolean,
  /** Text to display next ot the button. */
  text?: React.ReactNode,
  /** Don't render a background behind the icon. */
  transparent?: boolean,
  /** Predefined styles to display for the button. */
  theme?: 'seamless' | 'outlined',
}

/** A clickable icon. */
const IconButton = React.forwardRef((props: IIconButton, ref: React.ForwardedRef<HTMLButtonElement>): JSX.Element => {
  const {
    'aria-busy': ariaBusy,
    'aria-label': ariaLabel,
    'aria-pressed': ariaPressed,
    src,
    icon,
    className,
    iconClassName,
    label,
    loading = false,
    pressed,
    text,
    transparent = false,
    theme = 'seamless',
    disabled = false,
    ...filteredProps
  } = props;
  const unavailable = disabled || loading;
  const accessibleLabel = label?.trim() || ariaLabel;

  return (
    <button
      ref={ref}
      type='button'
      className={classNames('ds-icon-button flex items-center gap-2 p-1 rounded-full', {
        'bg-white dark:bg-transparent': !transparent,
        'border border-solid bg-transparent border-gray-400 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 focus:border-primary-500 text-gray-900 dark:text-gray-100 focus:ring-primary-500': theme === 'outlined',
        'opacity-50': unavailable,
      }, className)}
      aria-label={accessibleLabel}
      aria-busy={loading || ariaBusy || undefined}
      aria-pressed={pressed ?? ariaPressed}
      disabled={unavailable}
      {...filteredProps}
      data-testid='icon-button'
    >
      {icon ? <SemanticIcon name={icon} className={iconClassName} /> : null}
      {!icon && src ? <SvgIcon src={src} className={iconClassName} /> : null}

      {text ? (
        <Text tag='span' theme='muted' size='sm'>
          {text}
        </Text>
      ) : null}
    </button>
  );
});

export default IconButton;

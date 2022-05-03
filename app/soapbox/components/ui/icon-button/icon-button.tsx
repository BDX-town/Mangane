import classNames from 'classnames';
import React from 'react';

import SvgIcon from '../icon/svg-icon';
import Text from '../text/text';

interface IIconButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Class name for the <svg> icon. */
  iconClassName?: string,
  /** URL to the svg icon. */
  src: string,
  /** Text to display next ot the button. */
  text?: string,
  /** Don't render a background behind the icon. */
  transparent?: boolean
}

/** A clickable icon. */
const IconButton = React.forwardRef((props: IIconButton, ref: React.ForwardedRef<HTMLButtonElement>): JSX.Element => {
  const { src, className, iconClassName, text, transparent = false, ...filteredProps } = props;

  return (
    <button
      ref={ref}
      type='button'
      className={classNames('flex items-center space-x-2 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-0 focus:ring-primary-500', {
        'bg-white dark:bg-transparent': !transparent,
      }, className)}
      {...filteredProps}
      data-testid='icon-button'
    >
      <SvgIcon src={src} className={iconClassName} />

      {text ? (
        <Text tag='span' theme='muted' size='sm'>
          {text}
        </Text>
      ) : null}
    </button>
  );
});

export default IconButton;

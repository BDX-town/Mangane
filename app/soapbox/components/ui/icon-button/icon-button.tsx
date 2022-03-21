import classNames from 'classnames';
import React from 'react';
import InlineSVG from 'react-inlinesvg';

import Text from '../text/text';

interface IIconButton {
  alt?: string,
  className?: string,
  iconClassName?: string,
  disabled?: boolean,
  src: string,
  onClick?: () => void,
  text?: string,
  title?: string,
  transparent?: boolean
}

const IconButton = React.forwardRef((props: IIconButton, ref: React.ForwardedRef<HTMLButtonElement>): JSX.Element => {
  const { src, className, iconClassName, text, transparent = false, ...filteredProps } = props;

  return (
    <button
      ref={ref}
      type='button'
      className={classNames('flex items-center space-x-2 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500', {
        'bg-white': !transparent,
        [className]: typeof className !== 'undefined',
      })}
      {...filteredProps}
    >
      <InlineSVG src={src} className={iconClassName} />

      {text ? (
        <Text tag='span' theme='muted' size='sm'>
          {text}
        </Text>
      ) : null}
    </button>
  );
});

export default IconButton;

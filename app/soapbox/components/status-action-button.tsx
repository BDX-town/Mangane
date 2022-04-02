import classNames from 'classnames';
import React from 'react';
import InlineSVG from 'react-inlinesvg';

import { Text } from 'soapbox/components/ui';
import { shortNumberFormat } from 'soapbox/utils/numbers';

const COLORS = {
  accent: 'text-accent-300 hover:text-accent-300 dark:hover:text-accent-300',
  success: 'text-success-600 hover:text-success-600 dark:hover:text-success-600',
  '': '',
};

const FILL_COLORS = {
  accent: 'fill-accent-300 hover:fill-accent-300',
  '': '',
};

type Color = keyof typeof COLORS;
type FillColor = keyof typeof FILL_COLORS;

interface IStatusActionCounter {
  count: number,
}

/** Action button numerical counter, eg "5" likes */
const StatusActionCounter: React.FC<IStatusActionCounter> = ({ count = 0 }): JSX.Element => {
  return (
    <Text size='xs' weight='semibold' theme='inherit'>
      {shortNumberFormat(count)}
    </Text>
  );
};

interface IStatusActionButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iconClassName?: string,
  icon: string,
  count?: number,
  active?: boolean,
  color?: Color,
  fill?: FillColor,
}

const StatusActionButton = React.forwardRef((props: IStatusActionButton, ref: React.ForwardedRef<HTMLButtonElement>): JSX.Element => {
  const { icon, className, iconClassName, active, color = '', fill = '', count = 0, ...filteredProps } = props;

  return (
    <button
      ref={ref}
      type='button'
      className={classNames(
        'group flex items-center p-1 space-x-0.5 rounded-full',
        'text-gray-400 hover:text-gray-600 dark:hover:text-white',
        'bg-white dark:bg-transparent',
        {
          [COLORS[color]]: active,
        },
        className,
      )}
      {...filteredProps}
    >
      <InlineSVG
        src={icon}
        className={classNames(
          'p-1 rounded-full box-content',
          'group-focus:outline-none group-focus:ring-2 group-focus:ring-offset-2 dark:ring-offset-0 group-focus:ring-primary-500',
          {
            [FILL_COLORS[fill]]: active,
          },
          iconClassName,
        )}
      />

      {(count || null) && (
        <StatusActionCounter count={count} />
      )}
    </button>
  );
});

export default StatusActionButton;

import classNames from 'classnames';
import React from 'react';
import InlineSVG from 'react-inlinesvg';
import { defineMessages, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { Text } from 'soapbox/components/ui';

const sizes = {
  md: 'p-4 sm:rounded-xl',
  lg: 'p-4 sm:p-6 sm:rounded-xl',
  xl: 'p-4 sm:p-10 sm:rounded-3xl',
};

const messages = defineMessages({
  back: { id: 'card.back.label', defaultMessage: 'Back' },
});

interface ICard {
  variant?: 'rounded',
  size?: 'md' | 'lg' | 'xl',
  className?: string,
}

const Card: React.FC<ICard> = React.forwardRef(({ children, variant, size = 'md', className, ...filteredProps }, ref: React.ForwardedRef<HTMLDivElement>): JSX.Element => (
  <div
    ref={ref}
    {...filteredProps}
    className={classNames({
      'space-y-4': true,
      'bg-white dark:bg-slate-800 text-black dark:text-white sm:shadow-lg dark:sm:shadow-inset overflow-hidden': variant === 'rounded',
      [sizes[size]]: true,
    }, className)}
  >
    {children}
  </div>
));

interface ICardHeader {
  backHref?: string,
  onBackClick?: (event: React.MouseEvent) => void
}

const CardHeader: React.FC<ICardHeader> = ({ children, backHref, onBackClick }): JSX.Element => {
  const intl = useIntl();

  const renderBackButton = () => {
    if (!backHref && !onBackClick) {
      return null;
    }

    const Comp: React.ElementType = backHref ? Link : 'button';
    const backAttributes = backHref ? { to: backHref } : { onClick: onBackClick };

    return (
      <Comp {...backAttributes} className='mr-2 text-gray-900 dark:text-gray-100' aria-label={intl.formatMessage(messages.back)}>
        <InlineSVG src={require('@tabler/icons/icons/arrow-left.svg')} className='h-6 w-6' />
        <span className='sr-only' data-testid='back-button'>Back</span>
      </Comp>
    );
  };

  return (
    <div className='mb-4 flex flex-row items-center'>
      {renderBackButton()}

      {children}
    </div>
  );
};

interface ICardTitle {
  title: string | React.ReactNode
}

const CardTitle = ({ title }: ICardTitle): JSX.Element => (
  <Text size='xl' weight='bold' tag='h1' data-testid='card-title'>{title}</Text>
);

const CardBody: React.FC = ({ children }): JSX.Element => (
  <div data-testid='card-body'>{children}</div>
);

export { Card, CardHeader, CardTitle, CardBody };

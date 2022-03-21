import classNames from 'classnames';
import React from 'react';
import InlineSVG from 'react-inlinesvg';
import { defineMessages, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

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
      'bg-white sm:shadow-lg overflow-hidden': variant === 'rounded',
      [sizes[size]]: true,
      [className]: typeof className !== 'undefined',
    })}
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
      <Comp {...backAttributes} className='mr-2' aria-label={intl.formatMessage(messages.back)}>
        <InlineSVG src={require('@tabler/icons/icons/arrow-left.svg')} className='h-6 w-6' />
        <span className='sr-only'>Back</span>
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
  <h1 className='text-xl font-bold'>{title}</h1>
);

const CardBody: React.FC = ({ children }): JSX.Element => (
  <div>{children}</div>
);

export { Card, CardHeader, CardTitle, CardBody };

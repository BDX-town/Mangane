import classNames from 'classnames';
import React from 'react';

import { IconButton } from 'soapbox/components/ui';
import { shortNumberFormat } from 'soapbox/utils/numbers';

interface IStatusActionCounter {
  count: number,
  className?: string,
}

/** Action button numerical counter, eg "5" likes */
const StatusActionCounter: React.FC<IStatusActionCounter> = ({ count = 0, className }): JSX.Element => {
  return (
    <span className={classNames('text-xs font-semibold text-gray-400 group-hover:text-gray-600 dark:group-hover:text-white', className)}>
      {shortNumberFormat(count)}
    </span>
  );
};

interface IStatusAction {
  title?: string,
}

/** Status action container element */
const StatusAction: React.FC<IStatusAction> = ({ title, children }) => {
  return (
    <div title={title} className='group flex items-center space-x-0.5 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
      {children}
    </div>
  );
};

interface IStatusActionButton {
  icon: string,
  onClick: () => void,
  count?: number,
  active?: boolean,
  title?: string,
}

/** Action button (eg "Like") for a Status */
const StatusActionButton: React.FC<IStatusActionButton> = ({ icon, title, active = false, onClick, count = 0 }): JSX.Element => {

  const handleClick: React.EventHandler<React.MouseEvent> = (e) => {
    onClick();
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <StatusAction title={title}>
      <IconButton
        title={title}
        src={icon}
        onClick={handleClick}
        className={classNames('text-gray-400 group-hover:text-gray-600 dark:group-hover:text-white', {
          'text-accent-300 group-hover:text-accent-300 dark:group-hover:text-accent-300': active,
          // TODO: repost button
          // 'text-success-600 hover:text-success-600': active,
        })}
        iconClassName={classNames({
          'fill-accent-300': active,
        })}
      />

      {(count || null) && (
        <StatusActionCounter
          className={classNames({ 'text-accent-300 group-hover:text-accent-300': active })}
          count={count}
        />
      )}
    </StatusAction>
  );
};

export { StatusAction, StatusActionButton, StatusActionCounter };

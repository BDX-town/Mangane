import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';

import { IconButton, Text } from 'soapbox/components/ui';

interface IStatusActionCounter {
  count: number,
  to?: string,
}

/** Action button numerical counter, eg "5" likes */
const StatusActionCounter: React.FC<IStatusActionCounter> = ({ to, count = 0 }): JSX.Element => {
  const text = <Text size='xs' theme='muted'>{count}</Text>;
  return to ? <Link to={to}>{text}</Link> : text;
};

interface IStatusActionButton {
  icon: string,
  onClick: () => void,
  count: number,
  active?: boolean,
  title?: string,
  to?: string,
}

/** Status action container element */
const StatusAction: React.FC = ({ children }) => {
  return (
    <div className='flex items-center space-x-0.5 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
      {children}
    </div>
  );
};

/** Action button (eg "Like") for a Status */
const StatusActionButton: React.FC<IStatusActionButton> = ({ icon, title, to, active = false, onClick, count = 0 }): JSX.Element => {

  const handleClick: React.EventHandler<React.MouseEvent> = (e) => {
    onClick();
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <StatusAction>
      <IconButton
        title={title}
        src={icon}
        onClick={handleClick}
        className={classNames('text-gray-400 hover:text-gray-600 dark:hover:text-white', {
          'text-success-600 hover:text-success-600': active,
        })}
      />

      {count ? (
        <StatusActionCounter to={to} count={count} />
      ) : null}
    </StatusAction>
  );
};

export { StatusAction, StatusActionButton, StatusActionCounter };
export default StatusActionButton;

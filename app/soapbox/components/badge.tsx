import classNames from 'classnames';
import React from 'react';

interface IBadge {
  title: string,
  slug: 'patron' | 'donor' | 'admin' | 'moderator' | 'bot' | 'opaque',
}

/** Badge to display on a user's profile. */
const Badge: React.FC<IBadge> = ({ title, slug }) => (
  <span
    data-testid='badge'
    className={classNames('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white', {
      'bg-fuchsia-700': slug === 'patron',
      'bg-yellow-500': slug === 'donor',
      'bg-black': slug === 'admin',
      'bg-cyan-600': slug === 'moderator',
      'bg-gray-100 text-gray-900': slug === 'bot',
      'bg-white bg-opacity-75 text-gray-900': slug === 'opaque',
    })}
  >
    {title}
  </span>
);

export default Badge;

import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Avatar, Text } from 'soapbox/components/ui';

import type { FediDBServer } from 'soapbox/api/fedidb';

const messages = defineMessages({
  title: { id: 'popular_instances.title', defaultMessage: 'Popular instances' },
  users: { id: 'popular_instances.users', defaultMessage: '{count} users' },
});

interface IPopularInstances {
  /** List of servers to display */
  servers: FediDBServer[];
  /** Called when user selects an instance */
  onSelect: (domain: string) => void;
  /** Max instances to display */
  limit?: number;
}

/** Formats a number for display */
const formatCount = (count: number): string => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
  return count.toString();
};

/**
 * Displays a grid of popular/recommended instances.
 * Shown below the autocomplete when the input is empty.
 */
const PopularInstances: React.FC<IPopularInstances> = ({
  servers,
  onSelect,
  limit = 6,
}) => {
  const intl = useIntl();

  const displayed = servers
    .filter(s => s.open_registration)
    .slice(0, limit);

  if (displayed.length === 0) return null;

  return (
    <div className='mt-4'>
      <Text size='sm' weight='medium' className='text-gray-500 dark:text-gray-400 mb-3'>
        {intl.formatMessage(messages.title)}
      </Text>

      <div className='grid grid-cols-2 gap-2'>
        {displayed.map(server => (
          <button
            key={server.domain}
            type='button'
            onClick={() => onSelect(server.domain)}
            className='flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all text-left'
          >
            {server.banner_url ? (
              <Avatar src={server.banner_url} size={24} />
            ) : (
              <div className='w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0'>
                <span className='text-[10px] font-bold text-primary-600 dark:text-primary-300'>
                  {server.domain.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div className='flex-1 min-w-0'>
              <div className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                {server.domain}
              </div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>
                {intl.formatMessage(messages.users, { count: formatCount(server.stats.user_count) })}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularInstances;

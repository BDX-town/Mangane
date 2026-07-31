import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Avatar, Text } from 'soapbox/components/ui';

import type { FediDBPopularAccount } from 'soapbox/api/fedidb';

const messages = defineMessages({
  title: { id: 'recommended_accounts.title', defaultMessage: 'Popular on the Fediverse' },
  followers: { id: 'recommended_accounts.followers', defaultMessage: '{count} followers' },
});

interface IRecommendedAccounts {
  /** List of popular accounts to display */
  accounts: FediDBPopularAccount[];
  /** Max accounts to display */
  limit?: number;
}

/** Formats a number for display */
const formatCount = (count: number): string => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
  return count.toString();
};

/** Strips HTML tags from a string */
const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').trim();
};

/**
 * Displays popular accounts across the Fediverse.
 * Shown on the login page to give users an idea of who they can follow.
 */
const RecommendedAccounts: React.FC<IRecommendedAccounts> = ({
  accounts,
  limit = 8,
}) => {
  const intl = useIntl();

  const displayed = accounts.slice(0, limit);

  if (displayed.length === 0) return null;

  return (
    <div className='mt-6'>
      <Text size='sm' weight='medium' className='text-gray-500 dark:text-gray-400 mb-3'>
        {intl.formatMessage(messages.title)}
      </Text>

      <div className='space-y-2'>
        {displayed.map(account => (
          <a
            key={account.id}
            href={account.account_url}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors'
          >
            <Avatar src={account.avatar_url} size={40} />

            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-1'>
                <span className='font-medium text-sm text-gray-900 dark:text-white truncate'>
                  {account.name.replace(/:[a-z_]+:/g, '').trim() || account.username}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                  {account.webfinger}
                </span>
                <span className='text-xs text-gray-400 dark:text-gray-500'>
                  ·
                </span>
                <span className='text-xs text-gray-500 dark:text-gray-400'>
                  {intl.formatMessage(messages.followers, { count: formatCount(account.followers_count) })}
                </span>
              </div>
              {account.bio && (
                <p className='text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5'>
                  {stripHtml(account.bio).slice(0, 80)}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default RecommendedAccounts;

'use strict';

import React from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';

import Badge from 'soapbox/components/badge';
import { Icon, HStack, Stack, Text } from 'soapbox/components/ui';
import VerificationBadge from 'soapbox/components/verification_badge';
import { useSoapboxConfig } from 'soapbox/hooks';
import { isLocal } from 'soapbox/utils/accounts';

import ProfileStats from './profile_stats';

import type { Account } from 'soapbox/types/entities';

/** Basically ensure the URL isn't `javascript:alert('hi')` or something like that */
const isSafeUrl = (text: string): boolean => {
  try {
    const url = new URL(text);
    return ['http:', 'https:'].includes(url.protocol);
  } catch (e) {
    return false;
  }
};

const messages = defineMessages({
  linkVerifiedOn: { id: 'account.link_verified_on', defaultMessage: 'Ownership of this link was checked on {date}' },
  account_locked: { id: 'account.locked_info', defaultMessage: 'This account privacy status is set to locked. The owner manually reviews who can follow them.' },
  deactivated: { id: 'account.deactivated', defaultMessage: 'Deactivated' },
  bot: { id: 'account.badges.bot', defaultMessage: 'Bot' },
});

interface IProfileInfoPanel {
  account: Account,
  /** Username from URL params, in case the account isn't found. */
  username: string,
}

/** User profile metadata, such as location, birthday, etc. */
const ProfileInfoPanel: React.FC<IProfileInfoPanel> = ({ account, username }) => {
  const intl = useIntl();
  const { displayFqn } = useSoapboxConfig();

  const getStaffBadge = (): React.ReactNode => {
    if (account?.admin) {
      return <Badge slug='admin' title='Admin' key='staff' />;
    } else if (account?.moderator) {
      return <Badge slug='moderator' title='Moderator' key='staff' />;
    } else {
      return null;
    }
  };

  const getBadges = (): React.ReactNode[] => {
    const staffBadge = getStaffBadge();
    const isPatron = account.getIn(['patron', 'is_patron']) === true;

    const badges = [];

    if (staffBadge) {
      badges.push(staffBadge);
    }

    if (isPatron) {
      badges.push(<Badge slug='patron' title='Patron' key='patron' />);
    }

    if (account.donor) {
      badges.push(<Badge slug='donor' title='Donor' key='donor' />);
    }

    return badges;
  };

  const renderBirthday = (): React.ReactNode => {
    const birthday = account.birthday;
    if (!birthday) return null;

    const formattedBirthday = intl.formatDate(birthday, { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' });

    const date  = new Date(birthday);
    const today = new Date();

    const hasBirthday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth();

    return (
      <HStack alignItems='center' space={0.5}>
        <Icon
          src={require('@tabler/icons/icons/ballon.svg')}
          className='w-4 h-4 text-gray-800 dark:text-gray-200'
        />

        <Text size='sm'>
          {hasBirthday ? (
            <FormattedMessage id='account.birthday_today' defaultMessage='Birthday is today!' />
          ) : (
            <FormattedMessage id='account.birthday' defaultMessage='Born {date}' values={{ date: formattedBirthday }} />
          )}
        </Text>
      </HStack>
    );
  };

  if (!account) {
    return (
      <div className='mt-6 min-w-0 flex-1 sm:px-2'>
        <Stack space={2}>
          <Stack>
            <HStack space={1} alignItems='center'>
              <Text size='sm' theme='muted'>
                @{username}
              </Text>
            </HStack>
          </Stack>
        </Stack>
      </div>
    );
  }

  const content = { __html: account.note_emojified };
  const deactivated = !account.pleroma.get('is_active', true) === true;
  const displayNameHtml = deactivated ? { __html: intl.formatMessage(messages.deactivated) } : { __html: account.display_name_html };
  const memberSinceDate = intl.formatDate(account.created_at, { month: 'long', year: 'numeric' });
  const verified = account.verified;
  const badges = getBadges();

  return (
    <div className='mt-6 min-w-0 flex-1 sm:px-2'>
      <Stack space={2}>
        {/* Not sure if this is actual used. */}
        {/* <div className='profile-info-panel-content__deactivated'>
          <FormattedMessage
            id='account.deactivated_description' defaultMessage='This account has been deactivated.'
          />
        </div> */}

        <Stack>
          <HStack space={1} alignItems='center'>
            <Text size='lg' weight='bold' dangerouslySetInnerHTML={displayNameHtml} />

            {verified && <VerificationBadge />}

            {account.bot && <Badge slug='bot' title={intl.formatMessage(messages.bot)} />}

            {badges.length > 0 && (
              <HStack space={1} alignItems='center'>
                {badges}
              </HStack>
            )}
          </HStack>

          <HStack alignItems='center' space={0.5}>
            <Text size='sm' theme='muted'>
              @{displayFqn ? account.fqn : account.acct}
            </Text>

            {account.locked && (
              <Icon
                src={require('@tabler/icons/icons/lock.svg')}
                alt={intl.formatMessage(messages.account_locked)}
                className='w-4 h-4 text-gray-600'
              />
            )}
          </HStack>
        </Stack>

        <ProfileStats account={account} />

        {account.note.length > 0 && account.note !== '<p></p>' && (
          <Text size='sm' dangerouslySetInnerHTML={content} />
        )}

        <div className='flex flex-col md:flex-row items-start md:flex-wrap md:items-center gap-2'>
          {isLocal(account as any) ? (
            <HStack alignItems='center' space={0.5}>
              <Icon
                src={require('@tabler/icons/icons/calendar.svg')}
                className='w-4 h-4 text-gray-800 dark:text-gray-200'
              />

              <Text size='sm'>
                <FormattedMessage
                  id='account.member_since' defaultMessage='Joined {date}' values={{
                    date: memberSinceDate,
                  }}
                />
              </Text>
            </HStack>
          ) : null}

          {account.location ? (
            <HStack alignItems='center' space={0.5}>
              <Icon
                src={require('@tabler/icons/icons/map-pin.svg')}
                className='w-4 h-4 text-gray-800 dark:text-gray-200'
              />

              <Text size='sm'>
                {account.location}
              </Text>
            </HStack>
          ) : null}

          {account.website ? (
            <HStack alignItems='center' space={0.5}>
              <Icon
                src={require('@tabler/icons/icons/link.svg')}
                className='w-4 h-4 text-gray-800 dark:text-gray-200'
              />

              <div className='max-w-[300px]'>
                <Text size='sm' truncate>
                  {isSafeUrl(account.website) ? (
                    <a className='text-primary-600 dark:text-primary-400 hover:underline' href={account.website} target='_blank'>{account.website}</a>
                  ) : (
                    account.website
                  )}
                </Text>
              </div>
            </HStack>
          ) : null}

          {renderBirthday()}
        </div>
      </Stack>
    </div>
  );
};

export default ProfileInfoPanel;

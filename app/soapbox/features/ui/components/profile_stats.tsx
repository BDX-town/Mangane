import React from 'react';
import { useIntl, defineMessages } from 'react-intl';
import { NavLink } from 'react-router-dom';

import { HStack, Text } from 'soapbox/components/ui';
import { shortNumberFormat } from 'soapbox/utils/numbers';

import type { Account } from 'soapbox/types/entities';

const messages = defineMessages({
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  follows: { id: 'account.follows', defaultMessage: 'Follows' },
});

interface IProfileStats {
  account: Account | undefined,
  onClickHandler?: React.MouseEventHandler,
}

/** Display follower and following counts for an account. */
const ProfileStats: React.FC<IProfileStats> = ({ account, onClickHandler }) => {
  const intl = useIntl();

  const FollowersWrapper = React.useMemo(() =>
    ({ children }) => account.pleroma?.get('hide_followers') ? <>{ children }</> : <NavLink to={`/@${account.acct}/followers`} onClick={onClickHandler} title={account.pleroma?.get('hide_followers_count') ? null : intl.formatNumber(account.followers_count)} className='hover:underline'>{ children }</NavLink>
  , [account, onClickHandler, intl]);

  const FollowingWrapper = React.useMemo(() =>
    ({ children }) => account.pleroma?.get('hide_follows') ? <>{ children }</> : <NavLink to={`/@${account.acct}/following`} onClick={onClickHandler} title={account.pleroma?.get('hide_follows_count') ? null : intl.formatNumber(account.following_count)} className='hover:underline'>{ children }</NavLink>
  , [account, onClickHandler, intl]);


  if (!account) {
    return null;
  }

  return (
    <HStack alignItems='center' space={3}>
      <FollowersWrapper>
        <HStack alignItems='center' space={1}>
          <Text theme='primary' weight='bold' size='sm'>
            {
              account.pleroma?.get('hide_followers_count') ? '-' : shortNumberFormat(account.followers_count)
            }
          </Text>
          <Text weight='bold' size='sm'>
            {intl.formatMessage(messages.followers)}
          </Text>
        </HStack>
      </FollowersWrapper>

      <FollowingWrapper>
        <HStack alignItems='center' space={1}>
          <Text theme='primary' weight='bold' size='sm'>
            {
              account.pleroma?.get('hide_follows_count') ? '-' : shortNumberFormat(account.following_count)
            }
          </Text>
          <Text weight='bold' size='sm'>
            {intl.formatMessage(messages.follows)}
          </Text>
        </HStack>
      </FollowingWrapper>
    </HStack>
  );
};

export default ProfileStats;

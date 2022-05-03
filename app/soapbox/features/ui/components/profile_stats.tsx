import React from 'react';
import { useIntl, defineMessages } from 'react-intl';
import { NavLink } from 'react-router-dom';

import { shortNumberFormat } from 'soapbox/utils/numbers';

import { HStack, Text } from '../../../components/ui';

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

  if (!account) {
    return null;
  }

  return (
    <HStack alignItems='center' space={3}>
      <NavLink to={`/@${account.acct}/followers`} onClick={onClickHandler} title={intl.formatNumber(account.followers_count)}>
        <HStack alignItems='center' space={1}>
          <Text theme='primary' weight='bold' size='sm'>
            {shortNumberFormat(account.followers_count)}
          </Text>
          <Text weight='bold' size='sm'>
            {intl.formatMessage(messages.followers)}
          </Text>
        </HStack>
      </NavLink>

      <NavLink to={`/@${account.acct}/following`} onClick={onClickHandler} title={intl.formatNumber(account.following_count)}>
        <HStack alignItems='center' space={1}>
          <Text theme='primary' weight='bold' size='sm'>
            {shortNumberFormat(account.following_count)}
          </Text>
          <Text weight='bold' size='sm'>
            {intl.formatMessage(messages.follows)}
          </Text>
        </HStack>
      </NavLink>
    </HStack>
  );
};

export default ProfileStats;

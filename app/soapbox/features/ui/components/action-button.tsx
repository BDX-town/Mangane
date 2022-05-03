import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import {
  followAccount,
  unfollowAccount,
  blockAccount,
  unblockAccount,
  muteAccount,
  unmuteAccount,
} from 'soapbox/actions/accounts';
import { openModal } from 'soapbox/actions/modals';
import { Button } from 'soapbox/components/ui';
import { useAppSelector, useFeatures } from 'soapbox/hooks';

import type { Account as AccountEntity } from 'soapbox/types/entities';

const messages = defineMessages({
  unfollow: { id: 'account.unfollow', defaultMessage: 'Unfollow' },
  follow: { id: 'account.follow', defaultMessage: 'Follow' },
  remote_follow: { id: 'account.remote_follow', defaultMessage: 'Remote follow' },
  requested: { id: 'account.requested', defaultMessage: 'Awaiting approval. Click to cancel follow request' },
  requested_small: { id: 'account.requested_small', defaultMessage: 'Awaiting approval' },
  unblock: { id: 'account.unblock', defaultMessage: 'Unblock @{name}' },
  unmute: { id: 'account.unmute', defaultMessage: 'Unmute @{name}' },
  edit_profile: { id: 'account.edit_profile', defaultMessage: 'Edit profile' },
  blocked: { id: 'account.blocked', defaultMessage: 'Blocked' },
});

interface IAccount {
  account: AccountEntity
  small?: boolean
}

const ActionButton = ({ account, small }: IAccount) => {
  const dispatch = useDispatch();
  const features = useFeatures();
  const intl = useIntl();

  const me = useAppSelector((state) => state.me);

  const handleFollow = () => {
    if (account.getIn(['relationship', 'following']) || account.getIn(['relationship', 'requested'])) {
      dispatch(unfollowAccount(account.get('id')));
    } else {
      dispatch(followAccount(account.get('id')));
    }
  };

  const handleBlock = () => {
    if (account.getIn(['relationship', 'blocking'])) {
      dispatch(unblockAccount(account.get('id')));
    } else {
      dispatch(blockAccount(account.get('id')));
    }
  };

  const handleMute = () => {
    if (account.getIn(['relationship', 'muting'])) {
      dispatch(unmuteAccount(account.get('id')));
    } else {
      dispatch(muteAccount(account.get('id')));
    }
  };

  const handleRemoteFollow = () => {
    dispatch(openModal('UNAUTHORIZED', {
      action: 'FOLLOW',
      account: account.get('id'),
      ap_id: account.get('url'),
    }));
  };

  const empty = <></>;

  if (!me) {
    // Remote follow
    if (features.remoteInteractionsAPI) {
      return (
        <Button
          onClick={handleRemoteFollow}
          icon={require('@tabler/icons/icons/plus.svg')}
          text={intl.formatMessage(messages.follow)}
        />
      );
    }

    return (
      <form method='POST' action='/main/ostatus'>
        <input type='hidden' name='nickname' value={account.get('acct')} />
        <input type='hidden' name='profile' value='' />
        <Button text={intl.formatMessage(messages.remote_follow)} type='submit' />
      </form>
    );
  }

  if (me !== account.get('id')) {
    const isFollowing = account.getIn(['relationship', 'following']);
    const blockedBy = account.getIn(['relationship', 'blocked_by']) as boolean;

    if (!account.get('relationship')) {
      // Wait until the relationship is loaded
      return empty;
    } else if (account.getIn(['relationship', 'requested'])) {
      // Awaiting acceptance
      return (
        <Button
          size='sm'
          theme='secondary'
          text={small ? intl.formatMessage(messages.requested_small) : intl.formatMessage(messages.requested)}
          onClick={handleFollow}
        />
      );
    } else if (!account.getIn(['relationship', 'blocking']) && !account.getIn(['relationship', 'muting'])) {
      // Follow & Unfollow
      return (
        <Button
          size='sm'
          disabled={blockedBy}
          theme={isFollowing ? 'secondary' : 'primary'}
          icon={blockedBy ? require('@tabler/icons/icons/ban.svg') : (!isFollowing && require('@tabler/icons/icons/plus.svg'))}
          onClick={handleFollow}
        >
          {isFollowing ? (
            intl.formatMessage(messages.unfollow)
          ) : (
            intl.formatMessage(blockedBy ? messages.blocked : messages.follow)
          )}
        </Button>
      );
    } else if (account.getIn(['relationship', 'blocking'])) {
      // Unblock
      return (
        <Button
          theme='danger'
          size='sm'
          text={intl.formatMessage(messages.unblock, { name: account.get('username') })}
          onClick={handleBlock}
        />
      );
    } else if (account.getIn(['relationship', 'muting'])) {
      // Unmute
      return (
        <Button
          theme='danger'
          size='sm'
          text={intl.formatMessage(messages.unmute, { name: account.get('username') })}
          onClick={handleMute}
        />
      );
    }
  } else {
    // Edit profile
    return (
      <Button
        theme='secondary'
        size='sm'
        text={intl.formatMessage(messages.edit_profile)}
        to='/settings/profile'
      />
    );
  }

  return empty;
};

export default ActionButton;

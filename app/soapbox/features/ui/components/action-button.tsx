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
  block: { id: 'account.block', defaultMessage: 'Block @{name}' },
  blocked: { id: 'account.blocked', defaultMessage: 'Blocked' },
  edit_profile: { id: 'account.edit_profile', defaultMessage: 'Edit profile' },
  follow: { id: 'account.follow', defaultMessage: 'Follow' },
  mute: { id: 'account.mute', defaultMessage: 'Mute @{name}' },
  remote_follow: { id: 'account.remote_follow', defaultMessage: 'Remote follow' },
  requested: { id: 'account.requested', defaultMessage: 'Awaiting approval. Click to cancel follow request' },
  requested_small: { id: 'account.requested_small', defaultMessage: 'Awaiting approval' },
  unblock: { id: 'account.unblock', defaultMessage: 'Unblock @{name}' },
  unfollow: { id: 'account.unfollow', defaultMessage: 'Unfollow' },
  unmute: { id: 'account.unmute', defaultMessage: 'Unmute @{name}' },
});

interface IActionButton {
  account: AccountEntity
  actionType?: 'muting' | 'blocking'
  small?: boolean
}

const ActionButton: React.FC<IActionButton> = ({ account, actionType, small }) => {
  const dispatch = useDispatch();
  const features = useFeatures();
  const intl = useIntl();

  const me = useAppSelector((state) => state.me);

  const handleFollow = () => {
    if (account.getIn(['relationship', 'following']) || account.getIn(['relationship', 'requested'])) {
      dispatch(unfollowAccount(account.id));
    } else {
      dispatch(followAccount(account.id));
    }
  };

  const handleBlock = () => {
    if (account.getIn(['relationship', 'blocking'])) {
      dispatch(unblockAccount(account.id));
    } else {
      dispatch(blockAccount(account.id));
    }
  };

  const handleMute = () => {
    if (account.getIn(['relationship', 'muting'])) {
      dispatch(unmuteAccount(account.id));
    } else {
      dispatch(muteAccount(account.id));
    }
  };

  const handleRemoteFollow = () => {
    dispatch(openModal('UNAUTHORIZED', {
      action: 'FOLLOW',
      account: account.id,
      ap_id: account.url,
    }));
  };

  const mutingAction = () => {
    const isMuted = account.getIn(['relationship', 'muting']);
    const messageKey = isMuted ? messages.unmute : messages.mute;
    const text = intl.formatMessage(messageKey, { name: account.username });

    return (
      <Button
        theme={isMuted ? 'danger' : 'secondary'}
        size='sm'
        text={text}
        onClick={handleMute}
      />
    );
  };

  const blockingAction = () => {
    const isBlocked = account.getIn(['relationship', 'blocking']);
    const messageKey = isBlocked ? messages.unblock : messages.block;
    const text = intl.formatMessage(messageKey, { name: account.username });

    return (
      <Button
        theme={isBlocked ? 'danger' : 'secondary'}
        size='sm'
        text={text}
        onClick={handleBlock}
      />
    );
  };

  /** Render a remote follow button, depending on features. */
  const renderRemoteFollow = (): JSX.Element | null => {
    // Remote follow through the API.
    if (features.remoteInteractionsAPI) {
      return (
        <Button
          onClick={handleRemoteFollow}
          icon={require('@tabler/icons/icons/plus.svg')}
          text={intl.formatMessage(messages.follow)}
        />
      );
    // Pleroma's classic remote follow form.
    } else if (features.pleromaRemoteFollow) {
      return (
        <form method='POST' action='/main/ostatus'>
          <input type='hidden' name='nickname' value={account.acct} />
          <input type='hidden' name='profile' value='' />
          <Button text={intl.formatMessage(messages.remote_follow)} type='submit' />
        </form>
      );
    }

    return null;
  };

  /** Render remote follow if federating, otherwise hide the button. */
  const renderLoggedOut = (): JSX.Element | null => {
    if (features.federating) {
      return renderRemoteFollow();
    }

    return null;
  };

  const empty = <></>;

  if (!me) {
    return renderLoggedOut();
  }

  if (me !== account.id) {
    const isFollowing = account.getIn(['relationship', 'following']);
    const blockedBy = account.getIn(['relationship', 'blocked_by']) as boolean;

    if (actionType) {
      if (actionType === 'muting') {
        return mutingAction();
      } else if (actionType === 'blocking') {
        return blockingAction();
      }
    }

    if (account.relationship.isEmpty()) {
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
          text={intl.formatMessage(messages.unblock, { name: account.username })}
          onClick={handleBlock}
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

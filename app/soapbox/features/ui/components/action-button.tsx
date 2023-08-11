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
  authorizeFollowRequest,
  rejectFollowRequest,
} from 'soapbox/actions/accounts';
import { openModal } from 'soapbox/actions/modals';
import { Button, HStack, Text } from 'soapbox/components/ui';
import { useAppSelector, useFeatures } from 'soapbox/hooks';

import type { Account as AccountEntity } from 'soapbox/types/entities';

const messages = defineMessages({
  block: { id: 'account.block', defaultMessage: 'Block @{name}' },
  blocked: { id: 'account.blocked', defaultMessage: 'Blocked' },
  edit_profile: { id: 'account.edit_profile', defaultMessage: 'Edit profile' },
  follow: { id: 'account.follow', defaultMessage: 'Follow' },
  mute: { id: 'account.mute', defaultMessage: 'Mute @{name}' },
  remote_follow: { id: 'account.remote_follow', defaultMessage: 'Remote follow' },
  requested: { id: 'account.requested', defaultMessage: 'Click to cancel' },
  awaiting_approval: { id: 'account.awaiting_approval', defaultMessage: 'Awaiting approval' },
  unblock: { id: 'account.unblock', defaultMessage: 'Unblock @{name}' },
  unfollow: { id: 'account.unfollow', defaultMessage: 'Unfollow' },
  unmute: { id: 'account.unmute', defaultMessage: 'Unmute @{name}' },
  authorize: { id: 'follow_request.authorize', defaultMessage: 'Authorize' },
  reject: { id: 'follow_request.reject', defaultMessage: 'Reject' },
});

interface IActionButton {
  /** Target account for the action. */
  account: AccountEntity
  /** Type of action to prioritize, eg on Blocks and Mutes pages. */
  actionType?: 'muting' | 'blocking' | 'follow_request'
  /** Displays shorter text on the "Awaiting approval" button. */
  small?: boolean
}

/**
 * Circumstantial action button (usually "Follow") to display on accounts.
 * May say "Unblock" or something else, depending on the relationship and
 * `actionType` prop.
 */
const ActionButton: React.FC<IActionButton> = ({ account, actionType, small }) => {
  const dispatch = useDispatch();
  const features = useFeatures();
  const intl = useIntl();

  const me = useAppSelector((state) => state.me);

  const handleFollow = () => {
    if (account.relationship?.following || account.relationship?.requested) {
      dispatch(unfollowAccount(account.id));
    } else {
      dispatch(followAccount(account.id));
    }
  };

  const handleBlock = () => {
    if (account.relationship?.blocking) {
      dispatch(unblockAccount(account.id));
    } else {
      dispatch(blockAccount(account.id));
    }
  };

  const handleMute = () => {
    if (account.relationship?.muting) {
      dispatch(unmuteAccount(account.id));
    } else {
      dispatch(muteAccount(account.id));
    }
  };

  const handleAuthorize = () => {
    dispatch(authorizeFollowRequest(account.id));
  };

  const handleReject = () => {
    dispatch(rejectFollowRequest(account.id));
  };

  const handleRemoteFollow = () => {
    dispatch(openModal('UNAUTHORIZED', {
      action: 'FOLLOW',
      account: account.id,
      ap_id: account.url,
    }));
  };
  /** Handles actionType='muting' */
  const mutingAction = () => {
    const isMuted = account.relationship?.muting;
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

  /** Handles actionType='blocking' */
  const blockingAction = () => {
    const isBlocked = account.relationship?.blocking;
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

  const followRequestAction = () => {
    if (account.relationship?.followed_by) return null;

    return (
      <HStack space={2}>
        <Button
          theme='secondary'
          size='sm'
          text={intl.formatMessage(messages.authorize)}
          onClick={handleAuthorize}
        />
        <Button
          theme='danger'
          size='sm'
          text={intl.formatMessage(messages.reject)}
          onClick={handleReject}
        />
      </HStack>
    );
  };

  /** Render a remote follow button, depending on features. */
  const renderRemoteFollow = () => {
    // Remote follow through the API.
    if (features.remoteInteractions) {
      return (
        <Button
          onClick={handleRemoteFollow}
          icon={require('@tabler/icons/plus.svg')}
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
  const renderLoggedOut = () => {
    if (features.federating) {
      return renderRemoteFollow();
    }

    return null;
  };

  if (!me) {
    return renderLoggedOut();
  }

  if (me !== account.id) {
    const isFollowing = account.relationship?.following;
    const blockedBy = account.relationship?.blocked_by as boolean;

    if (actionType) {
      if (actionType === 'muting') {
        return mutingAction();
      } else if (actionType === 'blocking') {
        return blockingAction();
      } else if (actionType === 'follow_request') {
        return followRequestAction();
      }
    }

    if (!account.relationship) {
      // Wait until the relationship is loaded
      return null;
    } else if (account.relationship?.requested) {
      // Awaiting acceptance
      return (
        <div className='flex flex-col gap-1'>
          <Text size='xs' theme='muted'>
            { intl.formatMessage(messages.awaiting_approval) }
          </Text>
          <Button
            size='sm'
            theme='secondary'
            text={intl.formatMessage(messages.requested)}
            onClick={handleFollow}
          />
        </div>
      );
    } else if (!account.relationship?.blocking && !account.relationship?.muting) {
      // Follow & Unfollow
      return (
        <Button
          size='sm'
          disabled={blockedBy}
          theme={isFollowing ? 'secondary' : 'primary'}
          icon={blockedBy ? require('@tabler/icons/ban.svg') : (!isFollowing && require('@tabler/icons/plus.svg'))}
          onClick={handleFollow}
        >
          {isFollowing ? (
            intl.formatMessage(messages.unfollow)
          ) : (
            intl.formatMessage(blockedBy ? messages.blocked : messages.follow)
          )}
        </Button>
      );
    } else if (account.relationship?.blocking) {
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

  return null;
};

export default ActionButton;

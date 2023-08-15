import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { HotKeys } from 'react-hotkeys';
import { useIntl, FormattedMessage, defineMessages } from 'react-intl';
import { NavLink, useHistory } from 'react-router-dom';

import { mentionCompose, replyComposeWithConfirmation } from 'soapbox/actions/compose';
import { toggleFavourite, toggleReblog } from 'soapbox/actions/interactions';
import { openModal } from 'soapbox/actions/modals';
import { toggleStatusHidden } from 'soapbox/actions/statuses';
import Icon from 'soapbox/components/icon';
import AccountContainer from 'soapbox/containers/account_container';
import QuotedStatus from 'soapbox/features/status/containers/quoted_status_container';
import { useAppDispatch, useSettings, useLogo } from 'soapbox/hooks';
import { defaultMediaVisibility, textForScreenReader, getActualStatus } from 'soapbox/utils/status';

import StatusActionBar from './status-action-bar';
import StatusMedia from './status-media';
import StatusReplyMentions from './status-reply-mentions';
import StatusContent from './status_content';
import { HStack, Text } from './ui';

import type { Map as ImmutableMap } from 'immutable';
import type {
  Account as AccountEntity,
  Status as StatusEntity,
} from 'soapbox/types/entities';

// Defined in components/scrollable_list
export type ScrollPosition = { height: number, top: number };

const messages = defineMessages({
  reblogged_by: { id: 'status.reblogged_by', defaultMessage: '{name} reposted' },
});

export interface IStatus {
  id?: string,
  status: StatusEntity,
  onClick?: () => void,
  muted?: boolean,
  hidden?: boolean,
  unread?: boolean,
  onMoveUp?: (statusId: string, featured?: boolean) => void,
  onMoveDown?: (statusId: string, featured?: boolean) => void,
  group?: ImmutableMap<string, any>,
  focusable?: boolean,
  featured?: boolean,
  hideActionBar?: boolean,
  hoverable?: boolean,
  withDismiss?: boolean,
}

const Status: React.FC<IStatus> = (props) => {
  const {
    status,
    focusable = true,
    hoverable = true,
    onClick,
    onMoveUp,
    onMoveDown,
    muted,
    hidden,
    featured,
    unread,
    group,
    hideActionBar,
    withDismiss,
  } = props;
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const settings = useSettings();
  const displayMedia = settings.get('displayMedia') as string;
  const didShowCard = useRef(false);
  const node = useRef<HTMLDivElement>(null);

  const [showMedia, setShowMedia] = useState<boolean>(defaultMediaVisibility(status, displayMedia));

  const actualStatus = getActualStatus(status);

  const logo = useLogo();

  // Track height changes we know about to compensate scrolling.
  useEffect(() => {
    didShowCard.current = Boolean(!muted && !hidden && status?.card);
  }, []);

  useEffect(() => {
    setShowMedia(defaultMediaVisibility(status, displayMedia));
  }, [status.id]);

  const handleToggleMediaVisibility = (): void => {
    setShowMedia(!showMedia);
  };

  const handleClick = (): void => {
    if (onClick) {
      onClick();
    } else {
      history.push(`/@${actualStatus.getIn(['account', 'acct'])}/posts/${actualStatus.id}`);
    }
  };

  const handleExpandedToggle = (): void => {
    dispatch(toggleStatusHidden(actualStatus));
  };

  const handleHotkeyOpenMedia = (e?: KeyboardEvent): void => {
    const status = actualStatus;
    const firstAttachment = status.media_attachments.first();

    e?.preventDefault();

    if (firstAttachment) {
      if (firstAttachment.type === 'video') {
        dispatch(openModal('VIDEO', { media: firstAttachment, time: 0 }));
      } else {
        dispatch(openModal('MEDIA', { media: status.media_attachments, index: 0 }));
      }
    }
  };

  const handleHotkeyReply = (e?: KeyboardEvent): void => {
    e?.preventDefault();
    dispatch(replyComposeWithConfirmation(actualStatus, intl));
  };

  const handleHotkeyFavourite = (): void => {
    toggleFavourite(actualStatus);
  };

  const handleHotkeyBoost = (e?: KeyboardEvent): void => {
    const modalReblog = () => dispatch(toggleReblog(actualStatus));
    const boostModal = settings.get('boostModal');
    if ((e && e.shiftKey) || !boostModal) {
      modalReblog();
    } else {
      dispatch(openModal('BOOST', { status: actualStatus, onReblog: modalReblog }));
    }
  };

  const handleHotkeyMention = (e?: KeyboardEvent): void => {
    e?.preventDefault();
    dispatch(mentionCompose(actualStatus.account as AccountEntity));
  };

  const handleHotkeyOpen = (): void => {
    history.push(`/@${actualStatus.getIn(['account', 'acct'])}/posts/${actualStatus.id}`);
  };

  const handleHotkeyOpenProfile = (): void => {
    history.push(`/@${actualStatus.getIn(['account', 'acct'])}`);
  };

  const handleHotkeyMoveUp = (e?: KeyboardEvent): void => {
    if (onMoveUp) {
      onMoveUp(status.id, featured);
    }
  };

  const handleHotkeyMoveDown = (e?: KeyboardEvent): void => {
    if (onMoveDown) {
      onMoveDown(status.id, featured);
    }
  };

  const handleHotkeyToggleHidden = (): void => {
    dispatch(toggleStatusHidden(actualStatus));
  };

  const handleHotkeyToggleSensitive = (): void => {
    handleToggleMediaVisibility();
  };

  const handleHotkeyReact = (): void => {
    _expandEmojiSelector();
  };

  const _expandEmojiSelector = (): void => {
    const firstEmoji: HTMLDivElement | null | undefined = node.current?.querySelector('.emoji-react-selector .emoji-react-selector__emoji');
    firstEmoji?.focus();
  };

  const privacyIcon = React.useMemo(() => {
    switch (actualStatus?.visibility) {
      default:
      case 'public': return require('@tabler/icons/world.svg');
      case 'unlisted': return require('@tabler/icons/eye-off.svg');
      case 'local': return logo;
      case 'private': return require('@tabler/icons/lock.svg');
      case 'direct': return require('@tabler/icons/mail.svg');
    }
  }, [actualStatus?.visibility]);

  if (!status) return null;

  if (hidden) {
    return (
      <div ref={node}>
        {actualStatus.getIn(['account', 'display_name']) || actualStatus.getIn(['account', 'username'])}
        {actualStatus.content}
      </div>
    );
  }

  let quote;

  if (actualStatus.quote) {
    if (actualStatus.pleroma.get('quote_visible', true) === false) {
      quote = (
        <div className='quoted-status-tombstone'>
          <p><FormattedMessage id='statuses.quote_tombstone' defaultMessage='Post is unavailable.' /></p>
        </div>
      );
    } else {
      quote = <QuotedStatus statusId={actualStatus.quote as string} />;
    }
  }

  const handlers = muted ? undefined : {
    reply: handleHotkeyReply,
    favourite: handleHotkeyFavourite,
    boost: handleHotkeyBoost,
    mention: handleHotkeyMention,
    open: handleHotkeyOpen,
    openProfile: handleHotkeyOpenProfile,
    moveUp: handleHotkeyMoveUp,
    moveDown: handleHotkeyMoveDown,
    toggleHidden: handleHotkeyToggleHidden,
    toggleSensitive: handleHotkeyToggleSensitive,
    openMedia: handleHotkeyOpenMedia,
    react: handleHotkeyReact,
  };



  const statusUrl = `/@${actualStatus.getIn(['account', 'acct'])}/posts/${actualStatus.id}`;

  return (
    <HotKeys handlers={handlers} data-testid='status'>
      <div
        className={classNames('status cursor-pointer', { focusable })}
        tabIndex={focusable && !muted ? 0 : undefined}
        data-featured={featured ? 'true' : null}
        aria-label={textForScreenReader(intl, actualStatus, intl.formatMessage(
          messages.reblogged_by,
          { name: String(status.getIn(['account', 'acct'])) },
        ))}
        ref={node}
        onClick={() => history.push(statusUrl)}
        role='link'
      >
        {featured && (
          <div className='pt-4 px-4'>
            <HStack alignItems='center' space={1}>
              <Icon src={require('@tabler/icons/pinned.svg')} className='text-gray-600 dark:text-gray-400' />

              <Text size='sm' theme='muted' weight='medium'>
                <FormattedMessage id='status.pinned' defaultMessage='Pinned post' />
              </Text>
            </HStack>
          </div>
        )}

        <div
          className={classNames('status__wrapper', `status-${actualStatus.visibility}`, {
            'status-reply': !!status.in_reply_to_id,
            muted,
            read: unread === false,
          })}
          data-id={status.id}
        >

          <div className={classNames('flex items-center', { 'mb-3': status.reblog && typeof status.reblog === 'object' })}>
            <div className='grow min-w-0'>
              {
                status.reblog && typeof status.reblog === 'object' && (
                  <NavLink
                    to={`/@${status.getIn(['account', 'acct'])}`}
                    onClick={(event) => event.stopPropagation()}
                    className='flex items-center text-gray-700 dark:text-gray-600 text-xs font-medium space-x-1 hover:underline'
                  >
                    <Icon src={require('@tabler/icons/repeat.svg')} className='text-green-600' />

                    <HStack alignItems='center'>
                      <FormattedMessage
                        id='status.reblogged_by'
                        defaultMessage='{name} reposted'
                        values={{
                          name: <bdi className='max-w-[100px] truncate pr-1'>
                            <strong className='text-gray-800 dark:text-gray-200' dangerouslySetInnerHTML={{ __html: String(status.getIn(['account', 'display_name_html'])) }} />
                          </bdi>,
                        }}
                      />
                    </HStack>
                  </NavLink>
                )
              }
            </div>
            <Icon aria-hidden src={privacyIcon} className='h-5 w-5 shrink-0 text-gray-400 dark:text-gray-600' />
          </div>
          <div className='mb-3'>
            <AccountContainer
              key={String(actualStatus.getIn(['account', 'id']))}
              id={String(actualStatus.getIn(['account', 'id']))}
              timestamp={actualStatus.created_at}
              timestampUrl={statusUrl}
              hideActions
              showEdit={!!actualStatus.edited_at}
              showProfileHoverCard={hoverable}
              withLinkToProfile={hoverable}
            />
          </div>

          <div className='status__content-wrapper'>
            {!group && actualStatus.group && (
              <div className='status__meta'>
                Posted in <NavLink to={`/groups/${actualStatus.getIn(['group', 'id'])}`}>{String(actualStatus.getIn(['group', 'title']))}</NavLink>
              </div>
            )}

            <StatusReplyMentions
              status={actualStatus}
              hoverable={hoverable}
            />

            <StatusContent
              status={actualStatus}
              onClick={handleClick}
              expanded={!actualStatus.hidden}
              onExpandedToggle={handleExpandedToggle}
              collapsable
            />

            {
              !actualStatus.hidden && (
                <>
                  <StatusMedia
                    status={actualStatus}
                    muted={muted}
                    onClick={handleClick}
                    showMedia={showMedia}
                    onToggleVisibility={handleToggleMediaVisibility}
                  />
                  { quote  }
                </>

              )
            }

            {!hideActionBar && (
              <div className='pt-4'>
                <StatusActionBar status={actualStatus} withDismiss={withDismiss} />
              </div>
            )}
          </div>
        </div>
      </div>
    </HotKeys>
  );
};

export default Status;

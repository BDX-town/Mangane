import classNames from 'classnames';
import { List as ImmutableList } from 'immutable';
import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { blockAccount } from 'soapbox/actions/accounts';
import { showAlertForError } from 'soapbox/actions/alerts';
import { launchChat } from 'soapbox/actions/chats';
import { directCompose, mentionCompose, quoteCompose, replyCompose } from 'soapbox/actions/compose';
import { toggleBookmark, toggleFavourite, togglePin, toggleReblog } from 'soapbox/actions/interactions';
import { openModal } from 'soapbox/actions/modals';
import { deactivateUserModal, deleteStatusModal, deleteUserModal, toggleStatusSensitivityModal } from 'soapbox/actions/moderation';
import { initMuteModal } from 'soapbox/actions/mutes';
import { initReport } from 'soapbox/actions/reports';
import { deleteStatus, editStatus, toggleMuteStatus } from 'soapbox/actions/statuses';
import EmojiButtonWrapper from 'soapbox/components/emoji-button-wrapper';
import StatusActionButton from 'soapbox/components/status-action-button';
import DropdownMenuContainer from 'soapbox/containers/dropdown_menu_container';
import { useAppDispatch, useAppSelector, useFeatures, useOwnAccount, useSettings, useSoapboxConfig } from 'soapbox/hooks';
import { getReactForStatus, reduceEmoji } from 'soapbox/utils/emoji_reacts';

import type { Menu } from 'soapbox/components/dropdown_menu';
import type { Account, Status } from 'soapbox/types/entities';

const messages = defineMessages({
  delete: { id: 'status.delete', defaultMessage: 'Delete' },
  redraft: { id: 'status.redraft', defaultMessage: 'Delete & re-draft' },
  edit: { id: 'status.edit', defaultMessage: 'Edit' },
  direct: { id: 'status.direct', defaultMessage: 'Direct message @{name}' },
  chat: { id: 'status.chat', defaultMessage: 'Chat with @{name}' },
  mention: { id: 'status.mention', defaultMessage: 'Mention @{name}' },
  mute: { id: 'account.mute', defaultMessage: 'Mute @{name}' },
  block: { id: 'account.block', defaultMessage: 'Block @{name}' },
  reply: { id: 'status.reply', defaultMessage: 'Reply' },
  share: { id: 'status.share', defaultMessage: 'Share' },
  more: { id: 'status.more', defaultMessage: 'More' },
  replyAll: { id: 'status.replyAll', defaultMessage: 'Reply to thread' },
  reblog: { id: 'status.reblog', defaultMessage: 'Repost' },
  reblog_private: { id: 'status.reblog_private', defaultMessage: 'Repost to original audience' },
  cancel_reblog_private: { id: 'status.cancel_reblog_private', defaultMessage: 'Un-repost' },
  cannot_reblog: { id: 'status.cannot_reblog', defaultMessage: 'This post cannot be reposted' },
  favourite: { id: 'status.favourite', defaultMessage: 'Like' },
  open: { id: 'status.open', defaultMessage: 'Expand this post' },
  bookmark: { id: 'status.bookmark', defaultMessage: 'Bookmark' },
  unbookmark: { id: 'status.unbookmark', defaultMessage: 'Remove bookmark' },
  report: { id: 'status.report', defaultMessage: 'Report @{name}' },
  muteConversation: { id: 'status.mute_conversation', defaultMessage: 'Mute conversation' },
  unmuteConversation: { id: 'status.unmute_conversation', defaultMessage: 'Unmute conversation' },
  pin: { id: 'status.pin', defaultMessage: 'Pin on profile' },
  unpin: { id: 'status.unpin', defaultMessage: 'Unpin from profile' },
  embed: { id: 'status.embed', defaultMessage: 'Embed' },
  admin_account: { id: 'status.admin_account', defaultMessage: 'Open moderation interface for @{name}' },
  admin_status: { id: 'status.admin_status', defaultMessage: 'Open this post in the moderation interface' },
  copy: { id: 'status.copy', defaultMessage: 'Copy link to post' },
  group_remove_account: { id: 'status.remove_account_from_group', defaultMessage: 'Remove account from group' },
  group_remove_post: { id: 'status.remove_post_from_group', defaultMessage: 'Remove post from group' },
  deactivateUser: { id: 'admin.users.actions.deactivate_user', defaultMessage: 'Deactivate @{name}' },
  deleteUser: { id: 'admin.users.actions.delete_user', defaultMessage: 'Delete @{name}' },
  deleteStatus: { id: 'admin.statuses.actions.delete_status', defaultMessage: 'Delete post' },
  markStatusSensitive: { id: 'admin.statuses.actions.mark_status_sensitive', defaultMessage: 'Mark post sensitive' },
  markStatusNotSensitive: { id: 'admin.statuses.actions.mark_status_not_sensitive', defaultMessage: 'Mark post not sensitive' },
  reactionLike: { id: 'status.reactions.like', defaultMessage: 'Like' },
  reactionHeart: { id: 'status.reactions.heart', defaultMessage: 'Love' },
  reactionLaughing: { id: 'status.reactions.laughing', defaultMessage: 'Haha' },
  reactionOpenMouth: { id: 'status.reactions.open_mouth', defaultMessage: 'Wow' },
  reactionCry: { id: 'status.reactions.cry', defaultMessage: 'Sad' },
  reactionWeary: { id: 'status.reactions.weary', defaultMessage: 'Weary' },
  quotePost: { id: 'status.quote', defaultMessage: 'Quote post' },
  deleteConfirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
  deleteHeading: { id: 'confirmations.delete.heading', defaultMessage: 'Delete post' },
  deleteMessage: { id: 'confirmations.delete.message', defaultMessage: 'Are you sure you want to delete this post?' },
  redraftConfirm: { id: 'confirmations.redraft.confirm', defaultMessage: 'Delete & redraft' },
  redraftMessage: { id: 'confirmations.redraft.message', defaultMessage: 'Are you sure you want to delete this post and re-draft it? Favorites and reposts will be lost, and replies to the original post will be orphaned.' },
  blockConfirm: { id: 'confirmations.block.confirm', defaultMessage: 'Block' },
  replyConfirm: { id: 'confirmations.reply.confirm', defaultMessage: 'Reply' },
  redraftHeading: { id: 'confirmations.redraft.heading', defaultMessage: 'Delete & redraft' },
  replyMessage: { id: 'confirmations.reply.message', defaultMessage: 'Replying now will overwrite the message you are currently composing. Are you sure you want to proceed?' },
  blockAndReport: { id: 'confirmations.block.block_and_report', defaultMessage: 'Block & Report' },
});

interface IStatusActionBar {
  status: Status,
  withDismiss?: boolean,
  withLabels?: boolean,
  expandable?: boolean,
  space?: 'expand' | 'compact',
}

const StatusActionBar: React.FC<IStatusActionBar> = ({
  status,
  withDismiss = false,
  withLabels = false,
  expandable = true,
  space = 'compact',
}) => {
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const me = useAppSelector(state => state.me);
  const features = useFeatures();
  const settings = useSettings();
  const soapboxConfig = useSoapboxConfig();

  const { allowedEmoji } = soapboxConfig;

  const account = useOwnAccount();
  const isStaff = account ? account.staff : false;
  const isAdmin = account ? account.admin : false;

  const quotePosts = useMemo(() => features.quotePosts && soapboxConfig.quotePosts, [features, soapboxConfig]);

  if (!status) {
    return null;
  }

  const onOpenUnauthorizedModal = (action?: string) => {
    dispatch(openModal('UNAUTHORIZED', {
      action,
      ap_id: status.url,
    }));
  };

  const handleReplyClick: React.MouseEventHandler = (e) => {
    if (me) {
      dispatch((_, getState) => {
        const state = getState();
        if (state.compose.text.trim().length !== 0) {
          dispatch(openModal('CONFIRM', {
            message: intl.formatMessage(messages.replyMessage),
            confirm: intl.formatMessage(messages.replyConfirm),
            onConfirm: () => dispatch(replyCompose(status)),
          }));
        } else {
          dispatch(replyCompose(status));
        }
      });
    } else {
      onOpenUnauthorizedModal('REPLY');
    }

    e.stopPropagation();
  };

  const handleShareClick = () => {
    navigator.share({
      text: status.search_index,
      url: status.uri,
    }).catch((e) => {
      if (e.name !== 'AbortError') console.error(e);
    });
  };

  const handleFavouriteClick: React.EventHandler<React.MouseEvent> = (e) => {
    if (me) {
      dispatch(toggleFavourite(status));
    } else {
      onOpenUnauthorizedModal('FAVOURITE');
    }

    e.stopPropagation();
  };

  const handleBookmarkClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    dispatch(toggleBookmark(status));
  };

  const handleReblogClick: React.EventHandler<React.MouseEvent> = e => {
    e.stopPropagation();

    if (me) {
      const modalReblog = () => dispatch(toggleReblog(status));
      const boostModal = settings.get('boostModal');
      if ((e && e.shiftKey) || !boostModal) {
        modalReblog();
      } else {
        dispatch(openModal('BOOST', { status, onReblog: modalReblog }));
      }
    } else {
      onOpenUnauthorizedModal('REBLOG');
    }
  };

  const handleQuoteClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();

    if (me) {
      dispatch((_, getState) => {
        const state = getState();
        if (state.compose.text.trim().length !== 0) {
          dispatch(openModal('CONFIRM', {
            message: intl.formatMessage(messages.replyMessage),
            confirm: intl.formatMessage(messages.replyConfirm),
            onConfirm: () => dispatch(quoteCompose(status)),
          }));
        } else {
          dispatch(quoteCompose(status));
        }
      });
    } else {
      onOpenUnauthorizedModal('REBLOG');
    }
  };

  const doDeleteStatus = (withRedraft = false) => {
    dispatch((_, getState) => {
      const deleteModal = settings.get('deleteModal');
      if (!deleteModal) {
        dispatch(deleteStatus(status.id, withRedraft));
      } else {
        dispatch(openModal('CONFIRM', {
          icon: withRedraft ? require('@tabler/icons/edit.svg') : require('@tabler/icons/trash.svg'),
          heading: intl.formatMessage(withRedraft ? messages.redraftHeading : messages.deleteHeading),
          message: intl.formatMessage(withRedraft ? messages.redraftMessage : messages.deleteMessage),
          confirm: intl.formatMessage(withRedraft ? messages.redraftConfirm : messages.deleteConfirm),
          onConfirm: () => dispatch(deleteStatus(status.id, withRedraft)),
        }));
      }
    });
  };

  const handleDeleteClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    doDeleteStatus();
  };

  const handleRedraftClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    doDeleteStatus(true);
  };

  const handleEditClick: React.EventHandler<React.MouseEvent> = () => {
    dispatch(editStatus(status.id));
  };

  const handlePinClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    dispatch(togglePin(status));
  };

  const handleMentionClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    dispatch(mentionCompose(status.account as Account));
  };

  const handleDirectClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    dispatch(directCompose(status.account as Account));
  };

  const handleChatClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    const account = status.account as Account;
    dispatch(launchChat(account.id, history));
  };

  const handleMuteClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    dispatch(initMuteModal(status.account as Account));
  };

  const handleBlockClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();

    const account = status.get('account') as Account;
    dispatch(openModal('CONFIRM', {
      icon: require('@tabler/icons/ban.svg'),
      heading: <FormattedMessage id='confirmations.block.heading' defaultMessage='Block @{name}' values={{ name: account.get('acct') }} />,
      message: <FormattedMessage id='confirmations.block.message' defaultMessage='Are you sure you want to block {name}?' values={{ name: <strong>@{account.get('acct')}</strong> }} />,
      confirm: intl.formatMessage(messages.blockConfirm),
      onConfirm: () => dispatch(blockAccount(account.id)),
      secondary: intl.formatMessage(messages.blockAndReport),
      onSecondary: () => {
        dispatch(blockAccount(account.id));
        dispatch(initReport(account, status));
      },
    }));
  };

  const handleOpen: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    history.push(`/@${status.getIn(['account', 'acct'])}/posts/${status.id}`);
  };

  const handleEmbed = () => {
    dispatch(openModal('EMBED', {
      url: status.get('url'),
      onError: (error: any) => dispatch(showAlertForError(error)),
    }));
  };

  const handleReport: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    dispatch(initReport(status.account as Account, status));
  };

  const handleConversationMuteClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    dispatch(toggleMuteStatus(status));
  };

  const handleCopy: React.EventHandler<React.MouseEvent> = (e) => {
    const { url }  = status;
    const textarea = document.createElement('textarea');

    e.stopPropagation();

    textarea.textContent    = url;
    textarea.style.position = 'fixed';

    document.body.appendChild(textarea);

    try {
      textarea.select();
      document.execCommand('copy');
    } catch {
      // Do nothing
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const handleDeactivateUser: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    dispatch(deactivateUserModal(intl, status.getIn(['account', 'id']) as string));
  };

  const handleDeleteUser: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    dispatch(deleteUserModal(intl, status.getIn(['account', 'id']) as string));
  };

  const handleDeleteStatus: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    dispatch(deleteStatusModal(intl, status.id));
  };

  const handleToggleStatusSensitivity: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    dispatch(toggleStatusSensitivityModal(intl, status.id, status.sensitive));
  };

  const _makeMenu = (publicStatus: boolean) => {
    const mutingConversation = status.muted;
    const ownAccount = status.getIn(['account', 'id']) === me;
    const username = String(status.getIn(['account', 'username']));

    const menu: Menu = [];

    if (expandable) {
      menu.push({
        text: intl.formatMessage(messages.open),
        action: handleOpen,
        icon: require('@tabler/icons/arrows-vertical.svg'),
      });
    }

    if (publicStatus) {
      menu.push({
        text: intl.formatMessage(messages.copy),
        action: handleCopy,
        icon: require('@tabler/icons/link.svg'),
      });

      if (features.embeds) {
        menu.push({
          text: intl.formatMessage(messages.embed),
          action: handleEmbed,
          icon: require('@tabler/icons/share.svg'),
        });
      }
    }

    if (!me) {
      return menu;
    }

    if (features.bookmarks) {
      menu.push({
        text: intl.formatMessage(status.bookmarked ? messages.unbookmark : messages.bookmark),
        action: handleBookmarkClick,
        icon: status.bookmarked ? require('@tabler/icons/bookmark-off.svg') : require('@tabler/icons/bookmark.svg'),
      });
    }

    menu.push(null);

    if (ownAccount || withDismiss) {
      menu.push({
        text: intl.formatMessage(mutingConversation ? messages.unmuteConversation : messages.muteConversation),
        action: handleConversationMuteClick,
        icon: mutingConversation ? require('@tabler/icons/bell.svg') : require('@tabler/icons/bell-off.svg'),
      });
      menu.push(null);
    }

    if (ownAccount) {
      if (publicStatus) {
        menu.push({
          text: intl.formatMessage(status.pinned ? messages.unpin : messages.pin),
          action: handlePinClick,
          icon: mutingConversation ? require('@tabler/icons/pinned-off.svg') : require('@tabler/icons/pin.svg'),
        });
      } else {
        if (status.visibility === 'private') {
          menu.push({
            text: intl.formatMessage(status.reblogged ? messages.cancel_reblog_private : messages.reblog_private),
            action: handleReblogClick,
            icon: require('@tabler/icons/repeat.svg'),
          });
        }
      }

      menu.push({
        text: intl.formatMessage(messages.delete),
        action: handleDeleteClick,
        icon: require('@tabler/icons/trash.svg'),
        destructive: true,
      });
      if (features.editStatuses) {
        menu.push({
          text: intl.formatMessage(messages.edit),
          action: handleEditClick,
          icon: require('@tabler/icons/edit.svg'),
        });
      } else {
        menu.push({
          text: intl.formatMessage(messages.redraft),
          action: handleRedraftClick,
          icon: require('@tabler/icons/edit.svg'),
          destructive: true,
        });
      }
    } else {
      menu.push({
        text: intl.formatMessage(messages.mention, { name: username }),
        action: handleMentionClick,
        icon: require('@tabler/icons/at.svg'),
      });

      if (status.getIn(['account', 'pleroma', 'accepts_chat_messages']) === true) {
        menu.push({
          text: intl.formatMessage(messages.chat, { name: username }),
          action: handleChatClick,
          icon: require('@tabler/icons/messages.svg'),
        });
      } else if (features.privacyScopes) {
        menu.push({
          text: intl.formatMessage(messages.direct, { name: username }),
          action: handleDirectClick,
          icon: require('@tabler/icons/mail.svg'),
        });
      }

      menu.push(null);
      menu.push({
        text: intl.formatMessage(messages.mute, { name: username }),
        action: handleMuteClick,
        icon: require('@tabler/icons/circle-x.svg'),
      });
      menu.push({
        text: intl.formatMessage(messages.block, { name: username }),
        action: handleBlockClick,
        icon: require('@tabler/icons/ban.svg'),
      });
      menu.push({
        text: intl.formatMessage(messages.report, { name: username }),
        action: handleReport,
        icon: require('@tabler/icons/flag.svg'),
      });
    }

    if (isStaff) {
      menu.push(null);

      if (isAdmin) {
        menu.push({
          text: intl.formatMessage(messages.admin_account, { name: username }),
          href: `/pleroma/admin/#/users/${status.getIn(['account', 'id'])}/`,
          icon: require('@tabler/icons/gavel.svg'),
          action: (event) => event.stopPropagation(),
        });
        menu.push({
          text: intl.formatMessage(messages.admin_status),
          href: `/pleroma/admin/#/statuses/${status.id}/`,
          icon: require('@tabler/icons/pencil.svg'),
          action: (event) => event.stopPropagation(),
        });
      }

      menu.push({
        text: intl.formatMessage(status.sensitive === false ? messages.markStatusSensitive : messages.markStatusNotSensitive),
        action: handleToggleStatusSensitivity,
        icon: require('@tabler/icons/alert-triangle.svg'),
      });

      if (!ownAccount) {
        menu.push({
          text: intl.formatMessage(messages.deactivateUser, { name: username }),
          action: handleDeactivateUser,
          icon: require('@tabler/icons/user-off.svg'),
        });
        menu.push({
          text: intl.formatMessage(messages.deleteUser, { name: username }),
          action: handleDeleteUser,
          icon: require('@tabler/icons/user-minus.svg'),
          destructive: true,
        });
        menu.push({
          text: intl.formatMessage(messages.deleteStatus),
          action: handleDeleteStatus,
          icon: require('@tabler/icons/trash.svg'),
          destructive: true,
        });
      }
    }

    return menu;
  };

  const publicStatus = ['public', 'unlisted', 'local'].includes(status.visibility);

  const replyCount = status.replies_count;
  const reblogCount = status.reblogs_count;
  const favouriteCount = status.favourites_count;

  const emojiReactCount = reduceEmoji(
    (status.pleroma.get('emoji_reactions') || ImmutableList()) as ImmutableList<any>,
    favouriteCount,
    status.favourited,
    allowedEmoji,
  ).reduce((acc, cur) => acc + cur.get('count'), 0);

  const meEmojiReact = getReactForStatus(status, allowedEmoji) as keyof typeof reactMessages | undefined;

  const reactMessages = {
    '👍': messages.reactionLike,
    '❤️': messages.reactionHeart,
    '😆': messages.reactionLaughing,
    '😮': messages.reactionOpenMouth,
    '😢': messages.reactionCry,
    '😩': messages.reactionWeary,
    '': messages.favourite,
  };

  const meEmojiTitle = intl.formatMessage(reactMessages[meEmojiReact || ''] || messages.favourite);

  const menu = _makeMenu(publicStatus);
  let reblogIcon = require('@tabler/icons/repeat.svg');
  let replyTitle;

  if (status.visibility === 'direct') {
    reblogIcon = require('@tabler/icons/mail.svg');
  } else if (status.visibility === 'private') {
    reblogIcon = require('@tabler/icons/lock.svg');
  }

  const reblogMenu = [{
    text: intl.formatMessage(status.reblogged ? messages.cancel_reblog_private : messages.reblog),
    action: handleReblogClick,
    icon: require('@tabler/icons/repeat.svg'),
  }, {
    text: intl.formatMessage(messages.quotePost),
    action: handleQuoteClick,
    icon: require('@tabler/icons/quote.svg'),
  }];

  const reblogButton = (
    <StatusActionButton
      icon={reblogIcon}
      color='success'
      disabled={!publicStatus}
      title={!publicStatus ? intl.formatMessage(messages.cannot_reblog) : intl.formatMessage(messages.reblog)}
      active={status.reblogged}
      onClick={handleReblogClick}
      count={reblogCount}
      text={withLabels ? intl.formatMessage(messages.reblog) : undefined}
    />
  );

  if (!status.in_reply_to_id) {
    replyTitle = intl.formatMessage(messages.reply);
  } else {
    replyTitle = intl.formatMessage(messages.replyAll);
  }

  const canShare = ('share' in navigator) && status.visibility === 'public';

  return (
    <div
      className={classNames('flex flex-row', {
        'justify-between': space === 'expand',
        'space-x-2': space === 'compact',
      })}
    >
      <StatusActionButton
        title={replyTitle}
        icon={require('@tabler/icons/message-circle-2.svg')}
        onClick={handleReplyClick}
        count={replyCount}
        text={withLabels ? intl.formatMessage(messages.reply) : undefined}
      />

      {(quotePosts && me) ? (
        <DropdownMenuContainer
          items={reblogMenu}
          disabled={!publicStatus}
          onShiftClick={handleReblogClick}
        >
          {reblogButton}
        </DropdownMenuContainer>
      ) : (
        reblogButton
      )}

      {features.emojiReacts ? (
        <EmojiButtonWrapper statusId={status.id}>
          <StatusActionButton
            title={meEmojiTitle}
            icon={require('@tabler/icons/heart.svg')}
            filled
            color='accent'
            active={Boolean(meEmojiReact)}
            count={emojiReactCount}
            emoji={meEmojiReact}
            text={withLabels ? meEmojiTitle : undefined}
          />
        </EmojiButtonWrapper>
      ) : (
        <StatusActionButton
          title={intl.formatMessage(messages.favourite)}
          icon={require('@tabler/icons/heart.svg')}
          color='accent'
          filled
          onClick={handleFavouriteClick}
          active={Boolean(meEmojiReact)}
          count={favouriteCount}
          text={withLabels ? meEmojiTitle : undefined}
        />
      )}

      {canShare && (
        <StatusActionButton
          title={intl.formatMessage(messages.share)}
          icon={require('@tabler/icons/upload.svg')}
          onClick={handleShareClick}
        />
      )}

      <DropdownMenuContainer items={menu} status={status}>
        <StatusActionButton
          title={intl.formatMessage(messages.more)}
          icon={require('@tabler/icons/dots.svg')}
        />
      </DropdownMenuContainer>
    </div>
  );
};

export default StatusActionBar;

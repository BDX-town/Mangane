import { List as ImmutableList } from 'immutable';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { openModal } from 'soapbox/actions/modals';
import EmojiButtonWrapper from 'soapbox/components/emoji-button-wrapper';
import StatusActionButton from 'soapbox/components/status-action-button';
import DropdownMenuContainer from 'soapbox/containers/dropdown_menu_container';
import { useAppSelector, useFeatures, useOwnAccount } from 'soapbox/hooks';
import { getReactForStatus, reduceEmoji } from 'soapbox/utils/emoji_reacts';

import type { History } from 'history';
import type { Menu } from 'soapbox/components/dropdown_menu';
import type { Status } from 'soapbox/types/entities';

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
});

interface IStatusActionBar {
  status: Status,
  onReply: (status: Status) => void,
  onFavourite: (status: Status) => void,
  onEmojiReact: (status: Status, emoji: string) => void,
  onBookmark: (status: Status) => void,
  onReblog: (status: Status, e: React.MouseEvent) => void,
  onQuote: (status: Status) => void,
  onDelete: (status: Status, redraft?: boolean) => void,
  onEdit: (status: Status) => void,
  onDirect: (account: any) => void,
  onChat: (account: any, history: History) => void,
  onMention: (account: any) => void,
  onMute: (account: any) => void,
  onBlock: (status: Status) => void,
  onReport: (status: Status) => void,
  onEmbed: (status: Status) => void,
  onDeactivateUser: (status: Status) => void,
  onDeleteUser: (status: Status) => void,
  onToggleStatusSensitivity: (status: Status) => void,
  onDeleteStatus: (status: Status) => void,
  onMuteConversation: (status: Status) => void,
  onPin: (status: Status) => void,
  withDismiss?: boolean,
  withGroupAdmin?: boolean,
  allowedEmoji: ImmutableList<string>,
  emojiSelectorFocused: boolean,
  handleEmojiSelectorUnfocus: () => void,
  handleEmojiSelectorExpand?: React.EventHandler<React.KeyboardEvent>,
}

const StatusActionBar: React.FC<IStatusActionBar> = ({
  status,
  onReply,
  onFavourite,
  allowedEmoji,
  onBookmark,
  onReblog,
  onQuote,
  onDelete,
  onEdit,
  onPin,
  onMention,
  onDirect,
  onChat,
  onMute,
  onBlock,
  onEmbed,
  onReport,
  onMuteConversation,
  onDeactivateUser,
  onDeleteUser,
  onDeleteStatus,
  onToggleStatusSensitivity,
  withDismiss,
}) => {
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useDispatch();

  const me = useAppSelector(state => state.me);
  const features = useFeatures();

  const account = useOwnAccount();
  const isStaff = account ? account.staff : false;
  const isAdmin = account ? account.admin : false;

  const onOpenUnauthorizedModal = (action?: string) => {
    dispatch(openModal('UNAUTHORIZED', {
      action,
      ap_id: status.url,
    }));
  };

  const handleReplyClick: React.MouseEventHandler = (e) => {
    if (me) {
      onReply(status);
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
      onFavourite(status);
    } else {
      onOpenUnauthorizedModal('FAVOURITE');
    }

    e.stopPropagation();
  };

  const handleBookmarkClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    onBookmark(status);
  };

  const handleReblogClick: React.EventHandler<React.MouseEvent> = e => {
    e.stopPropagation();

    if (me) {
      onReblog(status, e);
    } else {
      onOpenUnauthorizedModal('REBLOG');
    }
  };

  const handleQuoteClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();

    if (me) {
      onQuote(status);
    } else {
      onOpenUnauthorizedModal('REBLOG');
    }
  };

  const handleDeleteClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    onDelete(status);
  };

  const handleRedraftClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    onDelete(status, true);
  };

  const handleEditClick: React.EventHandler<React.MouseEvent> = () => {
    onEdit(status);
  };

  const handlePinClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    onPin(status);
  };

  const handleMentionClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    onMention(status.account);
  };

  const handleDirectClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    onDirect(status.account);
  };

  const handleChatClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    onChat(status.account, history);
  };

  const handleMuteClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    onMute(status.account);
  };

  const handleBlockClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    onBlock(status);
  };

  const handleOpen: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    history.push(`/@${status.getIn(['account', 'acct'])}/posts/${status.id}`);
  };

  const handleEmbed = () => {
    onEmbed(status);
  };

  const handleReport: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    onReport(status);
  };

  const handleConversationMuteClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    onMuteConversation(status);
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
    onDeactivateUser(status);
  };

  const handleDeleteUser: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    onDeleteUser(status);
  };

  const handleDeleteStatus: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    onDeleteStatus(status);
  };

  const handleToggleStatusSensitivity: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    onToggleStatusSensitivity(status);
  };

  const _makeMenu = (publicStatus: boolean) => {
    const mutingConversation = status.muted;
    const ownAccount = status.getIn(['account', 'id']) === me;
    const username = String(status.getIn(['account', 'username']));

    const menu: Menu = [];

    menu.push({
      text: intl.formatMessage(messages.open),
      action: handleOpen,
      icon: require('@tabler/icons/arrows-vertical.svg'),
    });

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
      } else {
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

  const publicStatus = ['public', 'unlisted'].includes(status.visibility);

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
    />
  );

  if (!status.in_reply_to_id) {
    replyTitle = intl.formatMessage(messages.reply);
  } else {
    replyTitle = intl.formatMessage(messages.replyAll);
  }

  const canShare = ('share' in navigator) && status.visibility === 'public';

  return (
    <div className='pt-4 flex flex-row space-x-2'>
      <StatusActionButton
        title={replyTitle}
        icon={require('@tabler/icons/message-circle-2.svg')}
        onClick={handleReplyClick}
        count={replyCount}
      />

      {(features.quotePosts && me) ? (
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

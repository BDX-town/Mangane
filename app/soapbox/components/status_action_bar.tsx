import { List as ImmutableList } from 'immutable';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, IntlShape } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { simpleEmojiReact } from 'soapbox/actions/emoji_reacts';
import EmojiButtonWrapper from 'soapbox/components/emoji-button-wrapper';
import StatusActionButton from 'soapbox/components/status-action-button';
import DropdownMenuContainer from 'soapbox/containers/dropdown_menu_container';
import { isUserTouching } from 'soapbox/is_mobile';
import { getReactForStatus, reduceEmoji } from 'soapbox/utils/emoji_reacts';
import { getFeatures } from 'soapbox/utils/features';

import { openModal } from '../actions/modals';

import type { History } from 'history';
import type { AnyAction, Dispatch } from 'redux';
import type { Menu } from 'soapbox/components/dropdown_menu';
import type { RootState } from 'soapbox/store';
import type { Status } from 'soapbox/types/entities';
import type { Features } from 'soapbox/utils/features';

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

interface IStatusActionBar extends RouteComponentProps {
  status: Status,
  onOpenUnauthorizedModal: (modalType?: string) => void,
  onOpenReblogsModal: (acct: string, statusId: string) => void,
  onReply: (status: Status, history: History) => void,
  onFavourite: (status: Status) => void,
  onBookmark: (status: Status) => void,
  onReblog: (status: Status, e: React.MouseEvent) => void,
  onQuote: (status: Status, history: History) => void,
  onDelete: (status: Status, history: History, redraft?: boolean) => void,
  onEdit: (status: Status) => void,
  onDirect: (account: any, history: History) => void,
  onChat: (account: any, history: History) => void,
  onMention: (account: any, history: History) => void,
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
  withDismiss: boolean,
  withGroupAdmin: boolean,
  intl: IntlShape,
  me: string | null | false | undefined,
  isStaff: boolean,
  isAdmin: boolean,
  allowedEmoji: ImmutableList<string>,
  emojiSelectorFocused: boolean,
  handleEmojiSelectorUnfocus: () => void,
  features: Features,
  history: History,
  dispatch: Dispatch,
}

interface IStatusActionBarState {
  emojiSelectorVisible: boolean,
}

class StatusActionBar extends ImmutablePureComponent<IStatusActionBar, IStatusActionBarState> {

  static defaultProps: Partial<IStatusActionBar> = {
    isStaff: false,
  }

  node?: HTMLDivElement = undefined;

  state = {
    emojiSelectorVisible: false,
  }

  // Avoid checking props that are functions (and whose equality will always
  // evaluate to false. See react-immutable-pure-component for usage.
  // @ts-ignore: the type checker is wrong.
  updateOnProps = [
    'status',
    'withDismiss',
    'emojiSelectorFocused',
  ]

  handleReplyClick: React.MouseEventHandler = (e) => {
    const { me, onReply, onOpenUnauthorizedModal, status } = this.props;

    if (me) {
      onReply(status, this.props.history);
    } else {
      onOpenUnauthorizedModal('REPLY');
    }

    e.stopPropagation();
  }

  handleShareClick = () => {
    navigator.share({
      text: this.props.status.search_index,
      url: this.props.status.uri,
    }).catch((e) => {
      if (e.name !== 'AbortError') console.error(e);
    });
  }

  handleLikeButtonHover: React.EventHandler<React.MouseEvent> = () => {
    const { features } = this.props;

    if (features.emojiReacts && !isUserTouching()) {
      this.setState({ emojiSelectorVisible: true });
    }
  }

  handleLikeButtonLeave: React.EventHandler<React.MouseEvent> = () => {
    const { features } = this.props;

    if (features.emojiReacts && !isUserTouching()) {
      this.setState({ emojiSelectorVisible: false });
    }
  }

  handleLikeButtonClick: React.EventHandler<React.MouseEvent> = (e) => {
    const { features } = this.props;

    const reactForStatus = getReactForStatus(this.props.status, this.props.allowedEmoji);
    const meEmojiReact = typeof reactForStatus === 'string' ? reactForStatus : '👍';

    if (features.emojiReacts && isUserTouching()) {
      if (this.state.emojiSelectorVisible) {
        this.handleReact(meEmojiReact);
      } else {
        this.setState({ emojiSelectorVisible: true });
      }
    } else {
      this.handleReact(meEmojiReact);
    }

    e.stopPropagation();
  }

  handleReact = (emoji: string): void => {
    const { me, dispatch, onOpenUnauthorizedModal, status } = this.props;
    if (me) {
      dispatch(simpleEmojiReact(status, emoji) as any);
    } else {
      onOpenUnauthorizedModal('FAVOURITE');
    }
    this.setState({ emojiSelectorVisible: false });
  }

  handleReactClick = (emoji: string): React.EventHandler<React.MouseEvent> => {
    return () => {
      this.handleReact(emoji);
    };
  }

  handleFavouriteClick: React.EventHandler<React.MouseEvent> = (e) => {
    const { me, onFavourite, onOpenUnauthorizedModal, status } = this.props;
    if (me) {
      onFavourite(status);
    } else {
      onOpenUnauthorizedModal('FAVOURITE');
    }

    e.stopPropagation();
  }

  handleBookmarkClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    this.props.onBookmark(this.props.status);
  }

  handleReblogClick: React.EventHandler<React.MouseEvent> = e => {
    const { me, onReblog, onOpenUnauthorizedModal, status } = this.props;
    e.stopPropagation();

    if (me) {
      onReblog(status, e);
    } else {
      onOpenUnauthorizedModal('REBLOG');
    }
  }

  handleQuoteClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    const { me, onQuote, onOpenUnauthorizedModal, status } = this.props;
    if (me) {
      onQuote(status, this.props.history);
    } else {
      onOpenUnauthorizedModal('REBLOG');
    }
  }

  handleDeleteClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    this.props.onDelete(this.props.status, this.props.history);
  }

  handleRedraftClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    this.props.onDelete(this.props.status, this.props.history, true);
  }

  handleEditClick: React.EventHandler<React.MouseEvent> = () => {
    this.props.onEdit(this.props.status);
  }

  handlePinClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    this.props.onPin(this.props.status);
  }

  handleMentionClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    this.props.onMention(this.props.status.account, this.props.history);
  }

  handleDirectClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    this.props.onDirect(this.props.status.account, this.props.history);
  }

  handleChatClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    this.props.onChat(this.props.status.account, this.props.history);
  }

  handleMuteClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    this.props.onMute(this.props.status.account);
  }

  handleBlockClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    this.props.onBlock(this.props.status);
  }

  handleOpen: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    this.props.history.push(`/@${this.props.status.getIn(['account', 'acct'])}/posts/${this.props.status.id}`);
  }

  handleEmbed = () => {
    this.props.onEmbed(this.props.status);
  }

  handleReport: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    this.props.onReport(this.props.status);
  }

  handleConversationMuteClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    this.props.onMuteConversation(this.props.status);
  }

  handleCopy: React.EventHandler<React.MouseEvent> = (e) => {
    const { url }  = this.props.status;
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
  }

  // handleGroupRemoveAccount: React.EventHandler<React.MouseEvent> = (e) => {
  //   const { status } = this.props;
  //
  //   e.stopPropagation();
  //
  //   this.props.onGroupRemoveAccount(status.getIn(['group', 'id']), status.getIn(['account', 'id']));
  // }
  //
  // handleGroupRemovePost: React.EventHandler<React.MouseEvent> = (e) => {
  //   const { status } = this.props;
  //
  //   e.stopPropagation();
  //
  //   this.props.onGroupRemoveStatus(status.getIn(['group', 'id']), status.id);
  // }

  handleDeactivateUser: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    this.props.onDeactivateUser(this.props.status);
  }

  handleDeleteUser: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    this.props.onDeleteUser(this.props.status);
  }

  handleDeleteStatus: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    this.props.onDeleteStatus(this.props.status);
  }

  handleToggleStatusSensitivity: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    this.props.onToggleStatusSensitivity(this.props.status);
  }

  handleOpenReblogsModal = () => {
    const { me, status, onOpenUnauthorizedModal, onOpenReblogsModal } = this.props;

    if (!me) onOpenUnauthorizedModal();
    else onOpenReblogsModal(String(status.getIn(['account', 'acct'])), status.id);
  }

  _makeMenu = (publicStatus: boolean) => {
    const { status, intl, withDismiss, me, features, isStaff, isAdmin } = this.props;
    const mutingConversation = status.muted;
    const ownAccount = status.getIn(['account', 'id']) === me;
    const username = String(status.getIn(['account', 'username']));

    const menu: Menu = [];

    menu.push({
      text: intl.formatMessage(messages.open),
      action: this.handleOpen,
      icon: require('@tabler/icons/icons/arrows-vertical.svg'),
    });

    if (publicStatus) {
      menu.push({
        text: intl.formatMessage(messages.copy),
        action: this.handleCopy,
        icon: require('@tabler/icons/icons/link.svg'),
      });

      if (features.embeds) {
        menu.push({
          text: intl.formatMessage(messages.embed),
          action: this.handleEmbed,
          icon: require('@tabler/icons/icons/share.svg'),
        });
      }
    }

    if (!me) {
      return menu;
    }

    if (features.bookmarks) {
      menu.push({
        text: intl.formatMessage(status.bookmarked ? messages.unbookmark : messages.bookmark),
        action: this.handleBookmarkClick,
        icon: require(status.bookmarked ? '@tabler/icons/icons/bookmark-off.svg' : '@tabler/icons/icons/bookmark.svg'),
      });
    }

    menu.push(null);

    if (ownAccount || withDismiss) {
      menu.push({
        text: intl.formatMessage(mutingConversation ? messages.unmuteConversation : messages.muteConversation),
        action: this.handleConversationMuteClick,
        icon: require(mutingConversation ? '@tabler/icons/icons/bell.svg' : '@tabler/icons/icons/bell-off.svg'),
      });
      menu.push(null);
    }

    if (ownAccount) {
      if (publicStatus) {
        menu.push({
          text: intl.formatMessage(status.pinned ? messages.unpin : messages.pin),
          action: this.handlePinClick,
          icon: require(mutingConversation ? '@tabler/icons/icons/pinned-off.svg' : '@tabler/icons/icons/pin.svg'),
        });
      } else {
        if (status.visibility === 'private') {
          menu.push({
            text: intl.formatMessage(status.reblogged ? messages.cancel_reblog_private : messages.reblog_private),
            action: this.handleReblogClick,
            icon: require('@tabler/icons/icons/repeat.svg'),
          });
        }
      }

      menu.push({
        text: intl.formatMessage(messages.delete),
        action: this.handleDeleteClick,
        icon: require('@tabler/icons/icons/trash.svg'),
        destructive: true,
      });
      if (features.editStatuses) {
        menu.push({
          text: intl.formatMessage(messages.edit),
          action: this.handleEditClick,
          icon: require('@tabler/icons/icons/edit.svg'),
        });
      } else {
        menu.push({
          text: intl.formatMessage(messages.redraft),
          action: this.handleRedraftClick,
          icon: require('@tabler/icons/icons/edit.svg'),
          destructive: true,
        });
      }
    } else {
      menu.push({
        text: intl.formatMessage(messages.mention, { name: username }),
        action: this.handleMentionClick,
        icon: require('@tabler/icons/icons/at.svg'),
      });

      // if (status.getIn(['account', 'pleroma', 'accepts_chat_messages'], false) === true) {
      //   menu.push({
      //     text: intl.formatMessage(messages.chat, { name: username }),
      //     action: this.handleChatClick,
      //     icon: require('@tabler/icons/icons/messages.svg'),
      //   });
      // } else {
      //   menu.push({
      //     text: intl.formatMessage(messages.direct, { name: username }),
      //     action: this.handleDirectClick,
      //     icon: require('@tabler/icons/icons/mail.svg'),
      //   });
      // }

      menu.push(null);
      menu.push({
        text: intl.formatMessage(messages.mute, { name: username }),
        action: this.handleMuteClick,
        icon: require('@tabler/icons/icons/circle-x.svg'),
      });
      menu.push({
        text: intl.formatMessage(messages.block, { name: username }),
        action: this.handleBlockClick,
        icon: require('@tabler/icons/icons/ban.svg'),
      });
      menu.push({
        text: intl.formatMessage(messages.report, { name: username }),
        action: this.handleReport,
        icon: require('@tabler/icons/icons/flag.svg'),
      });
    }

    if (isStaff) {
      menu.push(null);

      if (isAdmin) {
        menu.push({
          text: intl.formatMessage(messages.admin_account, { name: username }),
          href: `/pleroma/admin/#/users/${status.getIn(['account', 'id'])}/`,
          icon: require('@tabler/icons/icons/gavel.svg'),
          action: (event) => event.stopPropagation(),
        });
        menu.push({
          text: intl.formatMessage(messages.admin_status),
          href: `/pleroma/admin/#/statuses/${status.id}/`,
          icon: require('@tabler/icons/icons/pencil.svg'),
          action: (event) => event.stopPropagation(),
        });
      }

      menu.push({
        text: intl.formatMessage(status.sensitive === false ? messages.markStatusSensitive : messages.markStatusNotSensitive),
        action: this.handleToggleStatusSensitivity,
        icon: require('@tabler/icons/icons/alert-triangle.svg'),
      });

      if (!ownAccount) {
        menu.push({
          text: intl.formatMessage(messages.deactivateUser, { name: username }),
          action: this.handleDeactivateUser,
          icon: require('@tabler/icons/icons/user-off.svg'),
        });
        menu.push({
          text: intl.formatMessage(messages.deleteUser, { name: username }),
          action: this.handleDeleteUser,
          icon: require('@tabler/icons/icons/user-minus.svg'),
          destructive: true,
        });
        menu.push({
          text: intl.formatMessage(messages.deleteStatus),
          action: this.handleDeleteStatus,
          icon: require('@tabler/icons/icons/trash.svg'),
          destructive: true,
        });
      }
    }

    // if (!ownAccount && withGroupAdmin) {
    //   menu.push(null);
    //   menu.push({
    //     text: intl.formatMessage(messages.group_remove_account),
    //     action: this.handleGroupRemoveAccount,
    //     icon: require('@tabler/icons/icons/user-x.svg'),
    //     destructive: true,
    //   });
    //   menu.push({
    //     text: intl.formatMessage(messages.group_remove_post),
    //     action: this.handleGroupRemovePost,
    //     icon: require('@tabler/icons/icons/trash.svg'),
    //     destructive: true,
    //   });
    // }

    return menu;
  }

  setRef = (c: HTMLDivElement) => {
    this.node = c;
  }

  componentDidMount() {
    document.addEventListener('click', (e) => {
      if (this.node && !this.node.contains(e.target as Node))
        this.setState({ emojiSelectorVisible: false });
    });
  }

  render() {
    const { status, intl, allowedEmoji, features, me } = this.props;

    const publicStatus = ['public', 'unlisted'].includes(status.visibility);

    const replyCount = status.replies_count;
    const reblogCount = status.reblogs_count;
    const favouriteCount = status.favourites_count;

    const emojiReactCount = reduceEmoji(
      (status.getIn(['pleroma', 'emoji_reactions']) || ImmutableList()) as ImmutableList<any>,
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

    const menu = this._makeMenu(publicStatus);
    let reblogIcon = require('@tabler/icons/icons/repeat.svg');
    let replyTitle;

    if (status.visibility === 'direct') {
      reblogIcon = require('@tabler/icons/icons/mail.svg');
    } else if (status.visibility === 'private') {
      reblogIcon = require('@tabler/icons/icons/lock.svg');
    }

    const reblogMenu = [{
      text: intl.formatMessage(status.reblogged ? messages.cancel_reblog_private : messages.reblog),
      action: this.handleReblogClick,
      icon: require('@tabler/icons/icons/repeat.svg'),
    }, {
      text: intl.formatMessage(messages.quotePost),
      action: this.handleQuoteClick,
      icon: require('@tabler/icons/icons/quote.svg'),
    }];

    const reblogButton = (
      <StatusActionButton
        icon={reblogIcon}
        color='success'
        disabled={!publicStatus}
        title={!publicStatus ? intl.formatMessage(messages.cannot_reblog) : intl.formatMessage(messages.reblog)}
        active={status.reblogged}
        onClick={this.handleReblogClick}
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
          icon={require('@tabler/icons/icons/message-circle.svg')}
          onClick={this.handleReplyClick}
          count={replyCount}
        />

        {(features.quotePosts && me) ? (
          <DropdownMenuContainer
            items={reblogMenu}
            disabled={!publicStatus}
            onShiftClick={this.handleReblogClick}
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
              icon={require('@tabler/icons/icons/heart.svg')}
              filled
              color='accent'
              active={Boolean(meEmojiReact)}
              count={emojiReactCount}
            />
          </EmojiButtonWrapper>
        ) : (
          <StatusActionButton
            title={intl.formatMessage(messages.favourite)}
            icon={require('@tabler/icons/icons/heart.svg')}
            color='accent'
            filled
            onClick={this.handleFavouriteClick}
            active={Boolean(meEmojiReact)}
            count={favouriteCount}
          />
        )}

        {canShare && (
          <StatusActionButton
            title={intl.formatMessage(messages.share)}
            icon={require('@tabler/icons/icons/upload.svg')}
            onClick={this.handleShareClick}
          />
        )}

        <DropdownMenuContainer items={menu} status={status}>
          <StatusActionButton
            title={intl.formatMessage(messages.more)}
            icon={require('@tabler/icons/icons/dots.svg')}
          />
        </DropdownMenuContainer>
      </div>
    );
  }

}

const mapStateToProps = (state: RootState) => {
  const { me, instance } = state;
  const account = state.accounts.get(me);

  return {
    me,
    isStaff: account ? account.staff : false,
    isAdmin: account ? account.admin : false,
    features: getFeatures(instance),
  };
};

const mapDispatchToProps = (dispatch: Dispatch, { status }: { status: Status}) => ({
  dispatch,
  onOpenUnauthorizedModal(action: AnyAction) {
    dispatch(openModal('UNAUTHORIZED', {
      action,
      ap_id: status.url,
    }));
  },
  onOpenReblogsModal(username: string, statusId: string) {
    dispatch(openModal('REBLOGS', {
      username,
      statusId,
    }));
  },
});

const WrappedComponent = withRouter(injectIntl(StatusActionBar));
// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(WrappedComponent);

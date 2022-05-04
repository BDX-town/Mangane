import classNames from 'classnames';
import React from 'react';
import { defineMessages, injectIntl, WrappedComponentProps as IntlComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import EmojiButtonWrapper from 'soapbox/components/emoji-button-wrapper';
import { isUserTouching } from 'soapbox/is_mobile';
import { getReactForStatus } from 'soapbox/utils/emoji_reacts';
import { getFeatures } from 'soapbox/utils/features';

import { openModal } from '../../../actions/modals';
import { HStack, IconButton } from '../../../components/ui';
import DropdownMenuContainer from '../../../containers/dropdown_menu_container';

import type { History } from 'history';
import type { List as ImmutableList } from 'immutable';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { Menu } from 'soapbox/components/dropdown_menu';
import type { RootState } from 'soapbox/store';
import type { Account as AccountEntity, Status as StatusEntity } from 'soapbox/types/entities';

type Dispatch = ThunkDispatch<RootState, void, AnyAction>;

const messages = defineMessages({
  delete: { id: 'status.delete', defaultMessage: 'Delete' },
  redraft: { id: 'status.redraft', defaultMessage: 'Delete & re-draft' },
  edit: { id: 'status.edit', defaultMessage: 'Edit' },
  direct: { id: 'status.direct', defaultMessage: 'Direct message @{name}' },
  chat: { id: 'status.chat', defaultMessage: 'Chat with @{name}' },
  mention: { id: 'status.mention', defaultMessage: 'Mention @{name}' },
  reply: { id: 'status.reply', defaultMessage: 'Reply' },
  reblog: { id: 'status.reblog', defaultMessage: 'Repost' },
  reblog_private: { id: 'status.reblog_private', defaultMessage: 'Repost to original audience' },
  cancel_reblog_private: { id: 'status.cancel_reblog_private', defaultMessage: 'Un-repost' },
  cannot_reblog: { id: 'status.cannot_reblog', defaultMessage: 'This post cannot be reposted' },
  favourite: { id: 'status.favourite', defaultMessage: 'Like' },
  mute: { id: 'status.mute', defaultMessage: 'Mute @{name}' },
  muteConversation: { id: 'status.mute_conversation', defaultMessage: 'Mute conversation' },
  unmuteConversation: { id: 'status.unmute_conversation', defaultMessage: 'Unmute conversation' },
  block: { id: 'status.block', defaultMessage: 'Block @{name}' },
  report: { id: 'status.report', defaultMessage: 'Report @{name}' },
  share: { id: 'status.share', defaultMessage: 'Share' },
  pin: { id: 'status.pin', defaultMessage: 'Pin on profile' },
  unpin: { id: 'status.unpin', defaultMessage: 'Unpin from profile' },
  embed: { id: 'status.embed', defaultMessage: 'Embed' },
  admin_account: { id: 'status.admin_account', defaultMessage: 'Open moderation interface for @{name}' },
  admin_status: { id: 'status.admin_status', defaultMessage: 'Open this post in the moderation interface' },
  copy: { id: 'status.copy', defaultMessage: 'Copy link to post' },
  bookmark: { id: 'status.bookmark', defaultMessage: 'Bookmark' },
  unbookmark: { id: 'status.unbookmark', defaultMessage: 'Remove bookmark' },
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
  emojiPickerExpand: { id: 'status.reactions_expand', defaultMessage: 'Select emoji' },
  more: { id: 'status.actions.more', defaultMessage: 'More' },
  quotePost: { id: 'status.quote', defaultMessage: 'Quote post' },
});

const mapStateToProps = (state: RootState) => {
  const me = state.me;
  const account = state.accounts.get(me);
  const instance = state.instance;

  return {
    me,
    isStaff: account ? account.staff : false,
    isAdmin: account ? account.admin : false,
    features: getFeatures(instance),
  };
};

const mapDispatchToProps = (dispatch: Dispatch, { status }: OwnProps) => ({
  onOpenUnauthorizedModal(action: string) {
    dispatch(openModal('UNAUTHORIZED', {
      action,
      ap_id: status.url,
    }));
  },
});

interface OwnProps {
  status: StatusEntity,
  onReply: (status: StatusEntity) => void,
  onReblog: (status: StatusEntity, e: React.MouseEvent) => void,
  onQuote: (status: StatusEntity, history: History) => void,
  onFavourite: (status: StatusEntity) => void,
  onEmojiReact: (status: StatusEntity, emoji: string) => void,
  onDelete: (status: StatusEntity, history: History, redraft?: boolean) => void,
  onEdit: (status: StatusEntity) => void,
  onBookmark: (status: StatusEntity) => void,
  onDirect: (account: AccountEntity, history: History) => void,
  onChat: (account: AccountEntity, history: History) => void,
  onMention: (account: AccountEntity, history: History) => void,
  onMute: (account: AccountEntity) => void,
  onMuteConversation: (status: StatusEntity) => void,
  onBlock: (status: StatusEntity) => void,
  onReport: (status: StatusEntity) => void,
  onPin: (status: StatusEntity) => void,
  onEmbed: (status: StatusEntity) => void,
  onDeactivateUser: (status: StatusEntity) => void,
  onDeleteUser: (status: StatusEntity) => void,
  onDeleteStatus: (status: StatusEntity) => void,
  onToggleStatusSensitivity: (status: StatusEntity) => void,
  allowedEmoji: ImmutableList<string>,
  emojiSelectorFocused: boolean,
  handleEmojiSelectorExpand: React.EventHandler<React.KeyboardEvent>,
  handleEmojiSelectorUnfocus: React.EventHandler<React.KeyboardEvent>,
}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

type IActionBar = OwnProps & StateProps & DispatchProps & RouteComponentProps & IntlComponentProps;

interface IActionBarState {
  emojiSelectorVisible: boolean,
  emojiSelectorFocused: boolean,
}

class ActionBar extends React.PureComponent<IActionBar, IActionBarState> {

  static defaultProps: Partial<IActionBar> = {
    isStaff: false,
  }

  state = {
    emojiSelectorVisible: false,
    emojiSelectorFocused: false,
  }

  node: HTMLDivElement | null = null;

  handleReplyClick: React.EventHandler<React.MouseEvent> = (e) => {
    const { me, onReply, onOpenUnauthorizedModal } = this.props;
    e.preventDefault();

    if (me) {
      onReply(this.props.status);
    } else {
      onOpenUnauthorizedModal('REPLY');
    }
  }

  handleReblogClick: React.EventHandler<React.MouseEvent> = (e) => {
    const { me, onReblog, onOpenUnauthorizedModal, status } = this.props;
    e.preventDefault();

    if (me) {
      onReblog(status, e);
    } else {
      onOpenUnauthorizedModal('REBLOG');
    }
  }

  handleQuoteClick: React.EventHandler<React.MouseEvent> = () => {
    const { me, onQuote, onOpenUnauthorizedModal, status } = this.props;
    if (me) {
      onQuote(status, this.props.history);
    } else {
      onOpenUnauthorizedModal('REBLOG');
    }
  }

  handleBookmarkClick: React.EventHandler<React.MouseEvent> = () => {
    this.props.onBookmark(this.props.status);
  }

  handleFavouriteClick: React.EventHandler<React.MouseEvent> = (e) => {
    const { me, onFavourite, onOpenUnauthorizedModal, status } = this.props;

    e.preventDefault();

    if (me) {
      onFavourite(status);
    } else {
      onOpenUnauthorizedModal('FAVOURITE');
    }
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

  handleLikeButtonClick: React.EventHandler<React.MouseEvent> = e => {
    const { features } = this.props;
    const meEmojiReact = getReactForStatus(this.props.status, this.props.allowedEmoji) || '👍';

    if (features.emojiReacts && isUserTouching()) {
      if (this.state.emojiSelectorVisible) {
        this.handleReactClick(meEmojiReact)(e);
      } else {
        this.setState({ emojiSelectorVisible: true });
      }
    } else {
      this.handleReactClick(meEmojiReact)(e);
    }
  }

  handleReactClick = (emoji: string): React.EventHandler<React.MouseEvent> => {
    return () => {
      const { me, onEmojiReact, onOpenUnauthorizedModal, status } = this.props;
      if (me) {
        onEmojiReact(status, emoji);
      } else {
        onOpenUnauthorizedModal('FAVOURITE');
      }
      this.setState({ emojiSelectorVisible: false, emojiSelectorFocused: false });
    };
  }

  handleHotkeyEmoji = () => {
    const { emojiSelectorVisible } = this.state;

    this.setState({ emojiSelectorVisible: !emojiSelectorVisible });
  }

  handleDeleteClick: React.EventHandler<React.MouseEvent> = () => {
    this.props.onDelete(this.props.status, this.props.history);
  }

  handleRedraftClick: React.EventHandler<React.MouseEvent> = () => {
    this.props.onDelete(this.props.status, this.props.history, true);
  }

  handleEditClick: React.EventHandler<React.MouseEvent> = () => {
    this.props.onEdit(this.props.status);
  }

  handleDirectClick: React.EventHandler<React.MouseEvent> = () => {
    const { account } = this.props.status;
    if (!account || typeof account !== 'object') return;
    this.props.onDirect(account, this.props.history);
  }

  handleChatClick: React.EventHandler<React.MouseEvent> = () => {
    const { account } = this.props.status;
    if (!account || typeof account !== 'object') return;
    this.props.onChat(account, this.props.history);
  }

  handleMentionClick: React.EventHandler<React.MouseEvent> = () => {
    const { account } = this.props.status;
    if (!account || typeof account !== 'object') return;
    this.props.onMention(account, this.props.history);
  }

  handleMuteClick: React.EventHandler<React.MouseEvent> = () => {
    const { account } = this.props.status;
    if (!account || typeof account !== 'object') return;
    this.props.onMute(account);
  }

  handleConversationMuteClick: React.EventHandler<React.MouseEvent> = () => {
    this.props.onMuteConversation(this.props.status);
  }

  handleBlockClick: React.EventHandler<React.MouseEvent> = () => {
    this.props.onBlock(this.props.status);
  }

  handleReport = () => {
    this.props.onReport(this.props.status);
  }

  handlePinClick: React.EventHandler<React.MouseEvent> = () => {
    this.props.onPin(this.props.status);
  }

  handleShare = () => {
    navigator.share({
      text: this.props.status.search_index,
      url: this.props.status.uri,
    });
  }

  handleEmbed = () => {
    this.props.onEmbed(this.props.status);
  }

  handleCopy = () => {
    const url      = this.props.status.url;
    const textarea = document.createElement('textarea');

    textarea.textContent    = url;
    textarea.style.position = 'fixed';

    document.body.appendChild(textarea);

    try {
      textarea.select();
      document.execCommand('copy');
    } catch (e) {
      // Do nothing
    } finally {
      document.body.removeChild(textarea);
    }
  }

  handleDeactivateUser = () => {
    this.props.onDeactivateUser(this.props.status);
  }

  handleDeleteUser = () => {
    this.props.onDeleteUser(this.props.status);
  }

  handleToggleStatusSensitivity = () => {
    this.props.onToggleStatusSensitivity(this.props.status);
  }

  handleDeleteStatus = () => {
    this.props.onDeleteStatus(this.props.status);
  }

  setRef: React.RefCallback<HTMLDivElement> = c => {
    this.node = c;
  }

  componentDidMount() {
    document.addEventListener('click', e => {
      if (this.node && !this.node.contains(e.target as Element))
        this.setState({ emojiSelectorVisible: false, emojiSelectorFocused: false });
    });
  }

  render() {
    const { status, intl, me, isStaff, isAdmin, allowedEmoji, features } = this.props;
    const ownAccount = status.getIn(['account', 'id']) === me;
    const username = String(status.getIn(['account', 'acct']));

    const publicStatus = ['public', 'unlisted'].includes(status.visibility);
    const mutingConversation = status.muted;

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

    const menu: Menu = [];

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

    if (me) {
      if (features.bookmarks) {
        menu.push({
          text: intl.formatMessage(status.get('bookmarked') ? messages.unbookmark : messages.bookmark),
          action: this.handleBookmarkClick,
          icon: require(status.get('bookmarked') ? '@tabler/icons/icons/bookmark-off.svg' : '@tabler/icons/icons/bookmark.svg'),
        });
      }

      menu.push(null);

      if (ownAccount) {
        if (publicStatus) {
          menu.push({
            text: intl.formatMessage(status.pinned ? messages.unpin : messages.pin),
            action: this.handlePinClick,
            icon: require(mutingConversation ? '@tabler/icons/icons/pinned-off.svg' : '@tabler/icons/icons/pin.svg'),
          });

          menu.push(null);
        } else if (status.visibility === 'private') {
          menu.push({
            text: intl.formatMessage(status.get('reblogged') ? messages.cancel_reblog_private : messages.reblog_private),
            action: this.handleReblogClick,
            icon: require('@tabler/icons/icons/repeat.svg'),
          });

          menu.push(null);
        }

        menu.push({
          text: intl.formatMessage(mutingConversation ? messages.unmuteConversation : messages.muteConversation),
          action: this.handleConversationMuteClick,
          icon: require(mutingConversation ? '@tabler/icons/icons/bell.svg' : '@tabler/icons/icons/bell-off.svg'),
        });
        menu.push(null);
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
          });
          menu.push({
            text: intl.formatMessage(messages.admin_status),
            href: `/pleroma/admin/#/statuses/${status.id}/`,
            icon: require('@tabler/icons/icons/pencil.svg'),
          });
        }

        menu.push({
          text: intl.formatMessage(status.get('sensitive') === false ? messages.markStatusSensitive : messages.markStatusNotSensitive),
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
    }

    const canShare = ('share' in navigator) && status.get('visibility') === 'public';


    let reblogIcon = require('@tabler/icons/icons/repeat.svg');

    if (status.get('visibility') === 'direct') {
      reblogIcon = require('@tabler/icons/icons/mail.svg');
    } else if (status.get('visibility') === 'private') {
      reblogIcon = require('@tabler/icons/icons/lock.svg');
    }

    const reblog_disabled = (status.get('visibility') === 'direct' || status.get('visibility') === 'private');

    const reblogMenu: Menu = [{
      text: intl.formatMessage(status.reblogged ? messages.cancel_reblog_private : messages.reblog),
      action: this.handleReblogClick,
      icon: require('@tabler/icons/icons/repeat.svg'),
    }, {
      text: intl.formatMessage(messages.quotePost),
      action: this.handleQuoteClick,
      icon: require('@tabler/icons/icons/quote.svg'),
    }];

    const reblogButton = (
      <IconButton
        disabled={reblog_disabled}
        className={classNames({
          'text-gray-400 hover:text-gray-600': !status.reblogged,
          'text-success-600 hover:text-success-600': status.reblogged,
        })}
        title={reblog_disabled ? intl.formatMessage(messages.cannot_reblog) : intl.formatMessage(messages.reblog)}
        src={reblogIcon}
        onClick={this.handleReblogClick}
        text={intl.formatMessage(messages.reblog)}
      />
    );

    return (
      <HStack justifyContent='between'>
        <IconButton
          title={intl.formatMessage(messages.reply)}
          src={require('@tabler/icons/icons/message-circle.svg')}
          className='text-gray-400 hover:text-gray-600'
          onClick={this.handleReplyClick}
          text={intl.formatMessage(messages.reply)}
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
            <IconButton
              className={classNames({
                'text-gray-400 hover:text-gray-600': !meEmojiReact,
                'text-accent-300 hover:text-accent-300': Boolean(meEmojiReact),
              })}
              title={meEmojiTitle}
              src={require('@tabler/icons/icons/heart.svg')}
              iconClassName={classNames({
                'fill-accent-300': Boolean(meEmojiReact),
              })}
              text={meEmojiTitle}
            />
          </EmojiButtonWrapper>
        ) : (
          <IconButton
            className={classNames({
              'text-gray-400 hover:text-gray-600': !meEmojiReact,
              'text-accent-300 hover:text-accent-300': Boolean(meEmojiReact),
            })}
            title={meEmojiTitle}
            src={require('@tabler/icons/icons/heart.svg')}
            iconClassName={classNames({
              'fill-accent-300': Boolean(meEmojiReact),
            })}
            text={meEmojiTitle}
            onClick={this.handleLikeButtonClick}
          />
        )}

        {canShare && (
          <IconButton
            title={intl.formatMessage(messages.share)}
            src={require('@tabler/icons/icons/upload.svg')}
            className='text-gray-400 hover:text-gray-600'
            onClick={this.handleShare}
            text={intl.formatMessage(messages.share)}
          />
        )}

        <DropdownMenuContainer
          src={require('@tabler/icons/icons/dots.svg')}
          items={menu}
          title='More'
        />
      </HStack>
    );
  }

}

const WrappedComponent = withRouter(injectIntl(ActionBar));
export default connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);

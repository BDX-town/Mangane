import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { isUserTouching } from 'soapbox/is_mobile';
import { isStaff, isAdmin } from 'soapbox/utils/accounts';
import { getReactForStatus } from 'soapbox/utils/emoji_reacts';
import { getFeatures } from 'soapbox/utils/features';
import SoapboxPropTypes from 'soapbox/utils/soapbox_prop_types';

import { openModal } from '../../../actions/modals';
import { HStack, IconButton } from '../../../components/ui';
import DropdownMenuContainer from '../../../containers/dropdown_menu_container';

const messages = defineMessages({
  delete: { id: 'status.delete', defaultMessage: 'Delete' },
  redraft: { id: 'status.redraft', defaultMessage: 'Delete & re-draft' },
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

const mapStateToProps = state => {
  const me = state.get('me');
  const account = state.getIn(['accounts', me]);
  const instance = state.get('instance');

  return {
    me,
    isStaff: account ? isStaff(account) : false,
    isAdmin: account ? isAdmin(account) : false,
    features: getFeatures(instance),
  };
};

const mapDispatchToProps = (dispatch, { status }) => ({
  onOpenUnauthorizedModal(action) {
    dispatch(openModal('UNAUTHORIZED', {
      action,
      ap_id: status.get('url'),
    }));
  },
});

class ActionBar extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    onReply: PropTypes.func.isRequired,
    onReblog: PropTypes.func.isRequired,
    onQuote: PropTypes.func.isRequired,
    onFavourite: PropTypes.func.isRequired,
    onEmojiReact: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onBookmark: PropTypes.func,
    onDirect: PropTypes.func.isRequired,
    onChat: PropTypes.func,
    onMention: PropTypes.func.isRequired,
    onMute: PropTypes.func,
    onMuteConversation: PropTypes.func,
    onBlock: PropTypes.func,
    onReport: PropTypes.func,
    onPin: PropTypes.func,
    onEmbed: PropTypes.func,
    onDeactivateUser: PropTypes.func,
    onDeleteUser: PropTypes.func,
    onDeleteStatus: PropTypes.func,
    onToggleStatusSensitivity: PropTypes.func,
    intl: PropTypes.object.isRequired,
    onOpenUnauthorizedModal: PropTypes.func.isRequired,
    me: SoapboxPropTypes.me,
    isStaff: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    allowedEmoji: ImmutablePropTypes.list,
    emojiSelectorFocused: PropTypes.bool,
    handleEmojiSelectorExpand: PropTypes.func.isRequired,
    handleEmojiSelectorUnfocus: PropTypes.func.isRequired,
    features: PropTypes.object.isRequired,
  };

  static defaultProps = {
    isStaff: false,
  }

  state = {
    emojiSelectorVisible: false,
    emojiSelectorFocused: false,
  }

  handleReplyClick = (e) => {
    const { me, onReply, onOpenUnauthorizedModal } = this.props;
    e.preventDefault();

    if (me) {
      onReply(this.props.status);
    } else {
      onOpenUnauthorizedModal('REPLY');
    }
  }

  handleReblogClick = (e) => {
    const { me, onReblog, onOpenUnauthorizedModal, status } = this.props;
    e.preventDefault();

    if (me) {
      onReblog(status, e);
    } else {
      onOpenUnauthorizedModal('REBLOG');
    }
  }

  handleQuoteClick = () => {
    const { me, onQuote, onOpenUnauthorizedModal, status } = this.props;
    if (me) {
      onQuote(status, this.context.router.history);
    } else {
      onOpenUnauthorizedModal('REBLOG');
    }
  }

  handleBookmarkClick = () => {
    this.props.onBookmark(this.props.status);
  }

  handleFavouriteClick = (e) => {
    const { me, onFavourite, onOpenUnauthorizedModal } = this.props;

    e.preventDefault();

    if (me) {
      onFavourite(status);
    } else {
      onOpenUnauthorizedModal('FAVOURITE');
    }
  }

  handleLikeButtonHover = e => {
    const { features } = this.props;

    if (features.emojiReacts && !isUserTouching()) {
      this.setState({ emojiSelectorVisible: true });
    }
  }

  handleLikeButtonLeave = e => {
    const { features } = this.props;

    if (features.emojiReacts && !isUserTouching()) {
      this.setState({ emojiSelectorVisible: false });
    }
  }

  handleLikeButtonClick = e => {
    const { features } = this.props;
    const meEmojiReact = getReactForStatus(this.props.status, this.props.allowedEmoji) || '👍';

    if (features.emojiReacts && isUserTouching()) {
      if (this.state.emojiSelectorVisible) {
        this.handleReactClick(meEmojiReact)();
      } else {
        this.setState({ emojiSelectorVisible: true });
      }
    } else {
      this.handleReactClick(meEmojiReact)();
    }
  }

  handleReactClick = emoji => {
    return e => {
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

  handleDeleteClick = () => {
    this.props.onDelete(this.props.status, this.context.router.history);
  }

  handleRedraftClick = () => {
    this.props.onDelete(this.props.status, this.context.router.history, true);
  }

  handleDirectClick = () => {
    this.props.onDirect(this.props.status.get('account'), this.context.router.history);
  }

  handleChatClick = () => {
    this.props.onChat(this.props.status.get('account'), this.context.router.history);
  }

  handleMentionClick = () => {
    this.props.onMention(this.props.status.get('account'), this.context.router.history);
  }

  handleMuteClick = () => {
    this.props.onMute(this.props.status.get('account'));
  }

  handleConversationMuteClick = () => {
    this.props.onMuteConversation(this.props.status);
  }

  handleBlockClick = () => {
    this.props.onBlock(this.props.status);
  }

  handleReport = () => {
    this.props.onReport(this.props.status);
  }

  handlePinClick = () => {
    this.props.onPin(this.props.status);
  }

  handleShare = () => {
    navigator.share({
      text: this.props.status.get('search_index'),
      url: this.props.status.get('url'),
    });
  }

  handleEmbed = () => {
    this.props.onEmbed(this.props.status);
  }

  handleCopy = () => {
    const url      = this.props.status.get('url');
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

  setRef = c => {
    this.node = c;
  }

  componentDidMount() {
    document.addEventListener('click', e => {
      if (this.node && !this.node.contains(e.target))
        this.setState({ emojiSelectorVisible: false, emojiSelectorFocused: false });
    });
  }

  render() {
    const { status, intl, me, isStaff, isAdmin, allowedEmoji, features } = this.props;
    const ownAccount = status.getIn(['account', 'id']) === me;

    const publicStatus = ['public', 'unlisted'].includes(status.get('visibility'));
    const mutingConversation = status.get('muted');
    const meEmojiReact = getReactForStatus(status, allowedEmoji);
    const meEmojiTitle = intl.formatMessage({
      '👍': messages.reactionLike,
      '❤️': messages.reactionHeart,
      '😆': messages.reactionLaughing,
      '😮': messages.reactionOpenMouth,
      '😢': messages.reactionCry,
      '😩': messages.reactionWeary,
    }[meEmojiReact] || messages.favourite);

    const menu = [];

    if (publicStatus) {
      menu.push({
        text: intl.formatMessage(messages.copy),
        action: this.handleCopy,
        icon: require('@tabler/icons/icons/link.svg'),
      });
      // menu.push({
      //   text: intl.formatMessage(messages.embed),
      //   action: this.handleEmbed,
      //   icon: require('feather-icons/dist/icons/link-2.svg'),
      // });
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
            text: intl.formatMessage(status.get('pinned') ? messages.unpin : messages.pin),
            action: this.handlePinClick,
            icon: require(mutingConversation ? '@tabler/icons/icons/pinned-off.svg' : '@tabler/icons/icons/pin.svg'),
          });
        } else {
          if (status.get('visibility') === 'private') {
            menu.push({
              text: intl.formatMessage(status.get('reblogged') ? messages.cancel_reblog_private : messages.reblog_private),
              action: this.handleReblogClick,
              icon: require('@tabler/icons/icons/repeat.svg'),
            });
          }
        }

        menu.push(null);
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
        menu.push({
          text: intl.formatMessage(messages.redraft),
          action: this.handleRedraftClick,
          icon: require('@tabler/icons/icons/edit.svg'),
          destructive: true,
        });
      } else {
        menu.push({
          text: intl.formatMessage(messages.mention, { name: status.getIn(['account', 'username']) }),
          action: this.handleMentionClick,
          icon: require('@tabler/icons/icons/at.svg'),
        });

        // if (status.getIn(['account', 'pleroma', 'accepts_chat_messages'], false) === true) {
        //   menu.push({
        //     text: intl.formatMessage(messages.chat, { name: status.getIn(['account', 'username']) }),
        //     action: this.handleChatClick,
        //     icon: require('@tabler/icons/icons/messages.svg'),
        //   });
        // } else {
        //   menu.push({
        //     text: intl.formatMessage(messages.direct, { name: status.getIn(['account', 'username']) }),
        //     action: this.handleDirectClick,
        //     icon: require('@tabler/icons/icons/mail.svg'),
        //   });
        // }

        menu.push(null);
        menu.push({
          text: intl.formatMessage(messages.mute, { name: status.getIn(['account', 'username']) }),
          action: this.handleMuteClick,
          icon: require('@tabler/icons/icons/circle-x.svg'),
        });
        menu.push({
          text: intl.formatMessage(messages.block, { name: status.getIn(['account', 'username']) }),
          action: this.handleBlockClick,
          icon: require('@tabler/icons/icons/ban.svg'),
        });
        menu.push({
          text: intl.formatMessage(messages.report, { name: status.getIn(['account', 'username']) }),
          action: this.handleReport,
          icon: require('@tabler/icons/icons/flag.svg'),
        });
      }

      if (isStaff) {
        menu.push(null);

        if (isAdmin) {
          menu.push({
            text: intl.formatMessage(messages.admin_account, { name: status.getIn(['account', 'username']) }),
            href: `/pleroma/admin/#/users/${status.getIn(['account', 'id'])}/`,
            icon: require('@tabler/icons/icons/gavel.svg'),
          });
          menu.push({
            text: intl.formatMessage(messages.admin_status),
            href: `/pleroma/admin/#/statuses/${status.get('id')}/`,
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
            text: intl.formatMessage(messages.deactivateUser, { name: status.getIn(['account', 'username']) }),
            action: this.handleDeactivateUser,
            icon: require('@tabler/icons/icons/user-off.svg'),
          });
          menu.push({
            text: intl.formatMessage(messages.deleteUser, { name: status.getIn(['account', 'username']) }),
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

    let reblogButton;

    if (me && features.quotePosts) {
      const reblogMenu = [
        {
          text: intl.formatMessage(status.get('reblogged') ? messages.cancel_reblog_private : messages.reblog),
          action: this.handleReblogClick,
          icon: require('@tabler/icons/icons/repeat.svg'),
        },
        {
          text: intl.formatMessage(messages.quotePost),
          action: this.handleQuoteClick,
          icon: require('@tabler/icons/icons/quote.svg'),
        },
      ];

      reblogButton = (
        <DropdownMenuContainer
          items={reblogMenu}
          disabled={!publicStatus}
          active={status.get('reblogged')}
          pressed={status.get('reblogged')}
          title={!publicStatus ? intl.formatMessage(messages.cannot_reblog) : intl.formatMessage(messages.reblog)}
          src={reblogIcon}
          direction='right'
          text={intl.formatMessage(messages.reblog)}
          onShiftClick={this.handleReblogClick}
        />
      );
    } else {
      reblogButton = (
        <IconButton
          disabled={reblog_disabled}
          className={classNames({
            'text-gray-400 hover:text-gray-600': !status.get('reblogged'),
            'text-success-600 hover:text-success-600': status.get('reblogged'),
          })}
          title={reblog_disabled ? intl.formatMessage(messages.cannot_reblog) : intl.formatMessage(messages.reblog)}
          src={reblogIcon}
          onClick={this.handleReblogClick}
          text={intl.formatMessage(messages.reblog)}
        />
      );
    }

    return (
      <HStack justifyContent='between'>
        <IconButton
          title={intl.formatMessage(messages.reply)}
          src={require('@tabler/icons/icons/message-circle.svg')}
          className='text-gray-400 hover:text-gray-600'
          onClick={this.handleReplyClick}
          text={intl.formatMessage(messages.reply)}
        />

        {reblogButton}

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
          direction='left'
          title='More'
        />
      </HStack>
    );
  }

}

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(ActionBar));

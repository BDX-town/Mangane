import { List as ImmutableList } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import { simpleEmojiReact } from 'soapbox/actions/emoji_reacts';
import EmojiSelector from 'soapbox/components/emoji_selector';
import { isUserTouching } from 'soapbox/is_mobile';
import { isStaff, isAdmin } from 'soapbox/utils/accounts';
import { getReactForStatus, reduceEmoji } from 'soapbox/utils/emoji_reacts';
import { getFeatures } from 'soapbox/utils/features';
import SoapboxPropTypes from 'soapbox/utils/soapbox_prop_types';

import { openModal } from '../actions/modals';
import DropdownMenuContainer from '../containers/dropdown_menu_container';

import IconButton from './icon_button';

const messages = defineMessages({
  delete: { id: 'status.delete', defaultMessage: 'Delete' },
  redraft: { id: 'status.redraft', defaultMessage: 'Delete & re-draft' },
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

class StatusActionBar extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    onOpenUnauthorizedModal: PropTypes.func.isRequired,
    onOpenReblogsModal: PropTypes.func.isRequired,
    onReply: PropTypes.func,
    onFavourite: PropTypes.func,
    onBookmark: PropTypes.func,
    onReblog: PropTypes.func,
    onQuote: PropTypes.func,
    onDelete: PropTypes.func,
    onDirect: PropTypes.func,
    onChat: PropTypes.func,
    onMention: PropTypes.func,
    onMute: PropTypes.func,
    onBlock: PropTypes.func,
    onReport: PropTypes.func,
    onEmbed: PropTypes.func,
    onDeactivateUser: PropTypes.func,
    onDeleteUser: PropTypes.func,
    onToggleStatusSensitivity: PropTypes.func,
    onDeleteStatus: PropTypes.func,
    onMuteConversation: PropTypes.func,
    onPin: PropTypes.func,
    withDismiss: PropTypes.bool,
    withGroupAdmin: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    me: SoapboxPropTypes.me,
    isStaff: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    allowedEmoji: ImmutablePropTypes.list,
    emojiSelectorFocused: PropTypes.bool,
    handleEmojiSelectorUnfocus: PropTypes.func.isRequired,
    features: PropTypes.object.isRequired,
    history: PropTypes.object,
  };

  static defaultProps = {
    isStaff: false,
  }

  state = {
    emojiSelectorVisible: false,
  }

  // Avoid checking props that are functions (and whose equality will always
  // evaluate to false. See react-immutable-pure-component for usage.
  updateOnProps = [
    'status',
    'withDismiss',
    'emojiSelectorFocused',
  ]

  handleReplyClick = () => {
    const { me, onReply, onOpenUnauthorizedModal, status } = this.props;
    if (me) {
      onReply(status, this.props.history);
    } else {
      onOpenUnauthorizedModal('REPLY');
    }
  }

  handleShareClick = () => {
    navigator.share({
      text: this.props.status.get('search_index'),
      url: this.props.status.get('url'),
    }).catch((e) => {
      if (e.name !== 'AbortError') console.error(e);
    });
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
      const { me, dispatch, onOpenUnauthorizedModal, status } = this.props;
      if (me) {
        dispatch(simpleEmojiReact(status, emoji));
      } else {
        onOpenUnauthorizedModal('FAVOURITE');
      }
      this.setState({ emojiSelectorVisible: false });
    };
  }

  handleFavouriteClick = () => {
    const { me, onFavourite, onOpenUnauthorizedModal, status } = this.props;
    if (me) {
      onFavourite(status);
    } else {
      onOpenUnauthorizedModal('FAVOURITE');
    }
  }

  handleBookmarkClick = () => {
    this.props.onBookmark(this.props.status);
  }

  handleReblogClick = e => {
    const { me, onReblog, onOpenUnauthorizedModal, status } = this.props;
    if (me) {
      onReblog(status, e);
    } else {
      onOpenUnauthorizedModal('REBLOG');
    }
  }

  handleQuoteClick = () => {
    const { me, onQuote, onOpenUnauthorizedModal, status } = this.props;
    if (me) {
      onQuote(status, this.props.history);
    } else {
      onOpenUnauthorizedModal('REBLOG');
    }
  }

  handleDeleteClick = () => {
    this.props.onDelete(this.props.status, this.props.history);
  }

  handleRedraftClick = () => {
    this.props.onDelete(this.props.status, this.props.history, true);
  }

  handlePinClick = () => {
    this.props.onPin(this.props.status);
  }

  handleMentionClick = () => {
    this.props.onMention(this.props.status.get('account'), this.props.history);
  }

  handleDirectClick = () => {
    this.props.onDirect(this.props.status.get('account'), this.props.history);
  }

  handleChatClick = () => {
    this.props.onChat(this.props.status.get('account'), this.props.history);
  }

  handleMuteClick = () => {
    this.props.onMute(this.props.status.get('account'));
  }

  handleBlockClick = () => {
    this.props.onBlock(this.props.status);
  }

  handleOpen = () => {
    this.props.history.push(`/@${this.props.status.getIn(['account', 'acct'])}/posts/${this.props.status.get('id')}`);
  }

  handleEmbed = () => {
    this.props.onEmbed(this.props.status);
  }

  handleReport = () => {
    this.props.onReport(this.props.status);
  }

  handleConversationMuteClick = () => {
    this.props.onMuteConversation(this.props.status);
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

  handleGroupRemoveAccount = () => {
    const { status } = this.props;

    this.props.onGroupRemoveAccount(status.getIn(['group', 'id']), status.getIn(['account', 'id']));
  }

  handleGroupRemovePost = () => {
    const { status } = this.props;

    this.props.onGroupRemoveStatus(status.getIn(['group', 'id']), status.get('id'));
  }

  handleDeactivateUser = () => {
    this.props.onDeactivateUser(this.props.status);
  }

  handleDeleteUser = () => {
    this.props.onDeleteUser(this.props.status);
  }

  handleDeleteStatus = () => {
    this.props.onDeleteStatus(this.props.status);
  }

  handleToggleStatusSensitivity = () => {
    this.props.onToggleStatusSensitivity(this.props.status);
  }

  handleOpenReblogsModal = () => {
    const { me, status, onOpenUnauthorizedModal, onOpenReblogsModal } = this.props;

    if (!me) onOpenUnauthorizedModal();
    else onOpenReblogsModal(status.getIn(['account', 'acct']), status.get('id'));
  }

  _makeMenu = (publicStatus) => {
    const { status, intl, withDismiss, withGroupAdmin, me, features, isStaff, isAdmin } = this.props;
    const mutingConversation = status.get('muted');
    const ownAccount = status.getIn(['account', 'id']) === me;

    const menu = [];

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
      // menu.push({
      //   text: intl.formatMessage(messages.embed),
      //   action: this.handleEmbed,
      //   icon: require('feather-icons/dist/icons/link-2.svg'),
      // });
    }

    if (!me) {
      return menu;
    }

    if (features.bookmarks) {
      menu.push({
        text: intl.formatMessage(status.get('bookmarked') ? messages.unbookmark : messages.bookmark),
        action: this.handleBookmarkClick,
        icon: require(status.get('bookmarked') ? '@tabler/icons/icons/bookmark-off.svg' : '@tabler/icons/icons/bookmark.svg'),
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
        icon: require('feather-icons/dist/icons/at-sign.svg'),
      });

      if (status.getIn(['account', 'pleroma', 'accepts_chat_messages'], false) === true) {
        menu.push({
          text: intl.formatMessage(messages.chat, { name: status.getIn(['account', 'username']) }),
          action: this.handleChatClick,
          icon: require('@tabler/icons/icons/messages.svg'),
        });
      } else {
        menu.push({
          text: intl.formatMessage(messages.direct, { name: status.getIn(['account', 'username']) }),
          action: this.handleDirectClick,
          icon: require('@tabler/icons/icons/mail.svg'),
        });
      }

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

    if (!ownAccount && withGroupAdmin) {
      menu.push(null);
      menu.push({
        text: intl.formatMessage(messages.group_remove_account),
        action: this.handleGroupRemoveAccount,
        icon: require('@tabler/icons/icons/user-x.svg'),
        destructive: true,
      });
      menu.push({
        text: intl.formatMessage(messages.group_remove_post),
        action: this.handleGroupRemovePost,
        icon: require('@tabler/icons/icons/trash.svg'),
        destructive: true,
      });
    }

    return menu;
  }

  setRef = c => {
    this.node = c;
  }

  componentDidMount() {
    document.addEventListener('click', e => {
      if (this.node && !this.node.contains(e.target))
        this.setState({ emojiSelectorVisible: false });
    });
  }

  render() {
    const { status, intl, allowedEmoji, emojiSelectorFocused, handleEmojiSelectorUnfocus, features, me } = this.props;
    const { emojiSelectorVisible } = this.state;

    const publicStatus = ['public', 'unlisted'].includes(status.get('visibility'));

    const replyCount = status.get('replies_count');
    const reblogCount = status.get('reblogs_count');
    const favouriteCount = status.get('favourites_count');
    const emojiReactCount = reduceEmoji(
      status.getIn(['pleroma', 'emoji_reactions'], ImmutableList()),
      favouriteCount,
      status.get('favourited'),
      allowedEmoji,
    ).reduce((acc, cur) => acc + cur.get('count'), 0);
    const meEmojiReact = getReactForStatus(status, allowedEmoji);
    const meEmojiTitle = intl.formatMessage({
      '👍': messages.reactionLike,
      '❤️': messages.reactionHeart,
      '😆': messages.reactionLaughing,
      '😮': messages.reactionOpenMouth,
      '😢': messages.reactionCry,
      '😩': messages.reactionWeary,
    }[meEmojiReact] || messages.favourite);

    const menu = this._makeMenu(publicStatus);
    let reblogIcon = require('feather-icons/dist/icons/repeat.svg');
    let replyTitle;

    if (status.get('visibility') === 'direct') {
      reblogIcon = require('@tabler/icons/icons/mail.svg');
    } else if (status.get('visibility') === 'private') {
      reblogIcon = require('@tabler/icons/icons/lock.svg');
    }

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
          onShiftClick={this.handleReblogClick}
        />
      );
    } else {
      reblogButton = (
        <IconButton
          className='status__action-bar-button'
          disabled={!publicStatus}
          active={status.get('reblogged')}
          pressed={status.get('reblogged')}
          title={!publicStatus ? intl.formatMessage(messages.cannot_reblog) : intl.formatMessage(messages.reblog)}
          src={reblogIcon}
          onClick={this.handleReblogClick}
        />
      );
    }

    if (status.get('in_reply_to_id', null) === null) {
      replyTitle = intl.formatMessage(messages.reply);
    } else {
      replyTitle = intl.formatMessage(messages.replyAll);
    }

    const canShare = ('share' in navigator) && status.get('visibility') === 'public';

    const shareButton = canShare && (
      <IconButton
        className='status__action-bar-button'
        title={intl.formatMessage(messages.share)}
        src={require('feather-icons/dist/icons/share.svg')}
        onClick={this.handleShareClick}
      />
    );

    return (
      <div className='status__action-bar'>
        <div className='status__action-bar__counter'>
          <IconButton className='status__action-bar-button' title={replyTitle} src={require('feather-icons/dist/icons/message-circle.svg')} onClick={this.handleReplyClick} />
          {replyCount !== 0 && <Link to={`/@${status.getIn(['account', 'acct'])}/posts/${status.get('id')}`} className='detailed-status__link'>{replyCount}</Link>}
        </div>
        <div className='status__action-bar__counter status__action-bar__counter--reblog'>
          {reblogButton}
          {reblogCount !== 0 && <span className='detailed-status__link' type='button' role='presentation' onClick={this.handleOpenReblogsModal}>{reblogCount}</span>}
        </div>
        <div
          className='status__action-bar__counter status__action-bar__counter--favourite'
          onMouseEnter={this.handleLikeButtonHover}
          onMouseLeave={this.handleLikeButtonLeave}
          ref={this.setRef}
        >
          <EmojiSelector
            onReact={this.handleReactClick}
            visible={features.emojiReacts && emojiSelectorVisible}
            focused={emojiSelectorFocused}
            onUnfocus={handleEmojiSelectorUnfocus}
          />
          <IconButton
            className='status__action-bar-button star-icon'
            animate
            active={Boolean(meEmojiReact)}
            title={meEmojiTitle}
            src={require('@tabler/icons/icons/thumb-up.svg')}
            emoji={meEmojiReact}
            onClick={this.handleLikeButtonClick}
          />
          {emojiReactCount !== 0 && (
            (features.exposableReactions && !features.emojiReacts) ? (
              <Link to={`/@${status.getIn(['account', 'acct'])}/posts/${status.get('id')}/likes`} className='detailed-status__link'>{emojiReactCount}</Link>
            ) : (
              <span className='detailed-status__link'>{emojiReactCount}</span>
            )
          )}
        </div>
        {shareButton}

        <div className='status__action-bar-dropdown'>
          <DropdownMenuContainer status={status} items={menu} src={require('@tabler/icons/icons/dots.svg')} direction='right' title={intl.formatMessage(messages.more)} />
        </div>
      </div>
    );
  }

}

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
  dispatch,
  onOpenUnauthorizedModal(action) {
    dispatch(openModal('UNAUTHORIZED', {
      action,
      ap_id: status.get('url'),
    }));
  },
  onOpenReblogsModal(username, statusId) {
    dispatch(openModal('REBLOGS', {
      username,
      statusId,
    }));
  },
});

export default withRouter(injectIntl(
  connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true },
  )(StatusActionBar)));

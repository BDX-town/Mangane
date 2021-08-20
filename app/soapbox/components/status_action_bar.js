import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import SoapboxPropTypes from 'soapbox/utils/soapbox_prop_types';
import IconButton from './icon_button';
import DropdownMenuContainer from '../containers/dropdown_menu_container';
import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { isStaff, isAdmin } from 'soapbox/utils/accounts';
import { openModal } from '../actions/modal';
import { Link } from 'react-router-dom';
import EmojiSelector from 'soapbox/components/emoji_selector';
import { getReactForStatus, reduceEmoji } from 'soapbox/utils/emoji_reacts';
import { simpleEmojiReact } from 'soapbox/actions/emoji_reacts';
import { List as ImmutableList } from 'immutable';
import { getFeatures } from 'soapbox/utils/features';

const messages = defineMessages({
  delete: { id: 'status.delete', defaultMessage: 'Delete' },
  redraft: { id: 'status.redraft', defaultMessage: 'Delete & re-draft' },
  direct: { id: 'status.direct', defaultMessage: 'Direct message @{name}' },
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
});

class StatusActionBar extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    onOpenUnauthorizedModal: PropTypes.func.isRequired,
    onReply: PropTypes.func,
    onFavourite: PropTypes.func,
    onBookmark: PropTypes.func,
    onReblog: PropTypes.func,
    onDelete: PropTypes.func,
    onDirect: PropTypes.func,
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
    const { me } = this.props;
    if (me) {
      this.props.onReply(this.props.status, this.context.router.history);
    } else {
      this.props.onOpenUnauthorizedModal();
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

  isMobile = () => window.matchMedia('only screen and (max-width: 895px)').matches;

  handleLikeButtonHover = e => {
    const { features } = this.props;

    if (features.emojiReacts && !this.isMobile()) {
      this.setState({ emojiSelectorVisible: true });
    }
  }

  handleLikeButtonLeave = e => {
    const { features } = this.props;

    if (features.emojiReacts && !this.isMobile()) {
      this.setState({ emojiSelectorVisible: false });
    }
  }

  handleLikeButtonClick = e => {
    const { features } = this.props;
    const meEmojiReact = getReactForStatus(this.props.status, this.props.allowedEmoji) || '👍';

    if (features.emojiReacts && this.isMobile()) {
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
      const { me, status } = this.props;
      if (me) {
        this.props.dispatch(simpleEmojiReact(status, emoji));
      } else {
        this.props.onOpenUnauthorizedModal();
      }
      this.setState({ emojiSelectorVisible: false });
    };
  }

  handleFavouriteClick = () => {
    const { me } = this.props;
    if (me) {
      this.props.onFavourite(this.props.status);
    } else {
      this.props.onOpenUnauthorizedModal();
    }
  }

  handleBookmarkClick = () => {
    this.props.onBookmark(this.props.status);
  }

  handleReblogClick = e => {
    const { me } = this.props;
    if (me) {
      this.props.onReblog(this.props.status, e);
    } else {
      this.props.onOpenUnauthorizedModal();
    }
  }

  handleDeleteClick = () => {
    this.props.onDelete(this.props.status, this.context.router.history);
  }

  handleRedraftClick = () => {
    this.props.onDelete(this.props.status, this.context.router.history, true);
  }

  handlePinClick = () => {
    this.props.onPin(this.props.status);
  }

  handleMentionClick = () => {
    this.props.onMention(this.props.status.get('account'), this.context.router.history);
  }

  handleDirectClick = () => {
    this.props.onDirect(this.props.status.get('account'), this.context.router.history);
  }

  handleMuteClick = () => {
    this.props.onMute(this.props.status.get('account'));
  }

  handleBlockClick = () => {
    this.props.onBlock(this.props.status);
  }

  handleOpen = () => {
    this.context.router.history.push(`/@${this.props.status.getIn(['account', 'acct'])}/posts/${this.props.status.get('id')}`);
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

  _makeMenu = (publicStatus) => {
    const { status, intl, withDismiss, withGroupAdmin, me, isStaff, isAdmin } = this.props;
    const mutingConversation = status.get('muted');
    const ownAccount = status.getIn(['account', 'id']) === me;

    const menu = [];

    menu.push({ text: intl.formatMessage(messages.open), action: this.handleOpen });

    if (publicStatus) {
      menu.push({ text: intl.formatMessage(messages.copy), action: this.handleCopy });
      // menu.push({ text: intl.formatMessage(messages.embed), action: this.handleEmbed });
    }

    menu.push({ text: intl.formatMessage(status.get('bookmarked') ? messages.unbookmark : messages.bookmark), action: this.handleBookmarkClick });

    if (!me) {
      return menu;
    }

    menu.push(null);

    if (ownAccount || withDismiss) {
      menu.push({ text: intl.formatMessage(mutingConversation ? messages.unmuteConversation : messages.muteConversation), action: this.handleConversationMuteClick });
      menu.push(null);
    }

    if (ownAccount) {
      if (publicStatus) {
        menu.push({ text: intl.formatMessage(status.get('pinned') ? messages.unpin : messages.pin), action: this.handlePinClick });
      } else {
        if (status.get('visibility') === 'private') {
          menu.push({ text: intl.formatMessage(status.get('reblogged') ? messages.cancel_reblog_private : messages.reblog_private), action: this.handleReblogClick });
        }
      }

      menu.push({ text: intl.formatMessage(messages.delete), action: this.handleDeleteClick });
      menu.push({ text: intl.formatMessage(messages.redraft), action: this.handleRedraftClick });
    } else {
      menu.push({ text: intl.formatMessage(messages.mention, { name: status.getIn(['account', 'username']) }), action: this.handleMentionClick });
      menu.push({ text: intl.formatMessage(messages.direct, { name: status.getIn(['account', 'username']) }), action: this.handleDirectClick });
      menu.push(null);
      menu.push({ text: intl.formatMessage(messages.mute, { name: status.getIn(['account', 'username']) }), action: this.handleMuteClick });
      menu.push({ text: intl.formatMessage(messages.block, { name: status.getIn(['account', 'username']) }), action: this.handleBlockClick });
      menu.push({ text: intl.formatMessage(messages.report, { name: status.getIn(['account', 'username']) }), action: this.handleReport });
    }

    if (isStaff) {
      menu.push(null);

      if (isAdmin) {
        menu.push({ text: intl.formatMessage(messages.admin_account, { name: status.getIn(['account', 'username']) }), href: `/pleroma/admin/#/users/${status.getIn(['account', 'id'])}/` });
        menu.push({ text: intl.formatMessage(messages.admin_status), href: `/pleroma/admin/#/statuses/${status.get('id')}/` });
      }

      menu.push({ text: intl.formatMessage(status.get('sensitive') === false ? messages.markStatusSensitive : messages.markStatusNotSensitive), action: this.handleToggleStatusSensitivity });

      if (!ownAccount) {
        menu.push({ text: intl.formatMessage(messages.deactivateUser, { name: status.getIn(['account', 'username']) }), action: this.handleDeactivateUser });
        menu.push({ text: intl.formatMessage(messages.deleteUser, { name: status.getIn(['account', 'username']) }), action: this.handleDeleteUser });
        menu.push({ text: intl.formatMessage(messages.deleteStatus), action: this.handleDeleteStatus });
      }
    }

    if (!ownAccount && withGroupAdmin) {
      menu.push(null);
      menu.push({ text: intl.formatMessage(messages.group_remove_account), action: this.handleGroupRemoveAccount });
      menu.push({ text: intl.formatMessage(messages.group_remove_post), action: this.handleGroupRemovePost });
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
    const { status, intl, allowedEmoji, emojiSelectorFocused, handleEmojiSelectorUnfocus, features } = this.props;
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
    let reblogIcon = 'retweet';
    let replyIcon;
    let replyTitle;

    if (status.get('visibility') === 'direct') {
      reblogIcon = 'envelope';
    } else if (status.get('visibility') === 'private') {
      reblogIcon = 'lock';
    }

    if (status.get('in_reply_to_id', null) === null) {
      replyIcon = 'reply';
      replyTitle = intl.formatMessage(messages.reply);
    } else {
      replyIcon = 'reply-all';
      replyTitle = intl.formatMessage(messages.replyAll);
    }

    const shareButton = ('share' in navigator) && status.get('visibility') === 'public' && (
      <IconButton className='status__action-bar-button' title={intl.formatMessage(messages.share)} icon='share-alt' onClick={this.handleShareClick} />
    );

    return (
      <div className='status__action-bar'>
        <div className='status__action-bar__counter'>
          <IconButton className='status__action-bar-button' title={replyTitle} icon={status.get('in_reply_to_account_id') === status.getIn(['account', 'id']) ? 'reply' : replyIcon} onClick={this.handleReplyClick} />
          {replyCount !== 0 && <Link to={`/@${status.getIn(['account', 'acct'])}/posts/${status.get('id')}`} className='detailed-status__link'>{replyCount}</Link>}
        </div>
        <div className='status__action-bar__counter'>
          <IconButton className='status__action-bar-button' disabled={!publicStatus} active={status.get('reblogged')} pressed={status.get('reblogged')} title={!publicStatus ? intl.formatMessage(messages.cannot_reblog) : intl.formatMessage(messages.reblog)} icon={reblogIcon} onClick={this.handleReblogClick} />
          {reblogCount !== 0 && <Link to={`/@${status.getIn(['account', 'acct'])}/posts/${status.get('id')}/reblogs`} className='detailed-status__link'>{reblogCount}</Link>}
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
            icon='thumbs-up'
            emoji={meEmojiReact}
            onClick={this.handleLikeButtonClick}
          />
          {emojiReactCount !== 0 && <span className='detailed-status__link'>{emojiReactCount}</span>}
        </div>
        {shareButton}

        <div className='status__action-bar-dropdown'>
          <DropdownMenuContainer status={status} items={menu} icon='ellipsis-h' size={18} direction='right' title={intl.formatMessage(messages.more)} />
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

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  onOpenUnauthorizedModal() {
    dispatch(openModal('UNAUTHORIZED'));
  },
});

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true },
  )(StatusActionBar));

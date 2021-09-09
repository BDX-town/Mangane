import React from 'react';
import { connect } from 'react-redux';
import { openModal } from '../../../actions/modal';
import PropTypes from 'prop-types';
import SoapboxPropTypes from 'soapbox/utils/soapbox_prop_types';
import IconButton from '../../../components/icon_button';
import ImmutablePropTypes from 'react-immutable-proptypes';
import DropdownMenuContainer from '../../../containers/dropdown_menu_container';
import { defineMessages, injectIntl } from 'react-intl';
import { isStaff, isAdmin } from 'soapbox/utils/accounts';
import { isUserTouching } from 'soapbox/is_mobile';
import EmojiSelector from 'soapbox/components/emoji_selector';
import { getReactForStatus } from 'soapbox/utils/emoji_reacts';
import { getFeatures } from 'soapbox/utils/features';

const messages = defineMessages({
  delete: { id: 'status.delete', defaultMessage: 'Delete' },
  redraft: { id: 'status.redraft', defaultMessage: 'Delete & re-draft' },
  direct: { id: 'status.direct', defaultMessage: 'Direct message @{name}' },
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

const mapDispatchToProps = (dispatch) => ({
  onOpenUnauthorizedModal() {
    dispatch(openModal('UNAUTHORIZED'));
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
    onFavourite: PropTypes.func.isRequired,
    onEmojiReact: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onBookmark: PropTypes.func,
    onDirect: PropTypes.func.isRequired,
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

  handleReplyClick = () => {
    const { me } = this.props;
    if (me) {
      this.props.onReply(this.props.status);
    } else {
      this.props.onOpenUnauthorizedModal();
    }
  }

  handleReblogClick = (e) => {
    const { me } = this.props;
    if (me) {
      this.props.onReblog(this.props.status, e);
    } else {
      this.props.onOpenUnauthorizedModal();
    }
  }

  handleBookmarkClick = () => {
    this.props.onBookmark(this.props.status);
  }

  handleFavouriteClick = () => {
    const { me } = this.props;
    if (me) {
      this.props.onFavourite(this.props.status);
    } else {
      this.props.onOpenUnauthorizedModal();
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
      const { me } = this.props;
      if (me) {
        this.props.onEmojiReact(this.props.status, emoji);
      } else {
        this.props.onOpenUnauthorizedModal();
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
    const { status, intl, me, isStaff, isAdmin, allowedEmoji, emojiSelectorFocused, handleEmojiSelectorExpand, handleEmojiSelectorUnfocus, features } = this.props;
    const { emojiSelectorVisible } = this.state;
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
      menu.push({ text: intl.formatMessage(messages.copy), action: this.handleCopy });
      // menu.push({ text: intl.formatMessage(messages.embed), action: this.handleEmbed });
    }

    menu.push({ text: intl.formatMessage(status.get('bookmarked') ? messages.unbookmark : messages.bookmark), action: this.handleBookmarkClick });

    menu.push(null);

    if (ownAccount) {
      if (publicStatus) {
        menu.push({ text: intl.formatMessage(status.get('pinned') ? messages.unpin : messages.pin), action: this.handlePinClick });
      } else {
        if (status.get('visibility') === 'private') {
          menu.push({ text: intl.formatMessage(status.get('reblogged') ? messages.cancel_reblog_private : messages.reblog_private), action: this.handleReblogClick });
        }
      }

      menu.push(null);
      menu.push({ text: intl.formatMessage(mutingConversation ? messages.unmuteConversation : messages.muteConversation), action: this.handleConversationMuteClick });
      menu.push(null);
      menu.push({ text: intl.formatMessage(messages.delete), action: this.handleDeleteClick });
      menu.push({ text: intl.formatMessage(messages.redraft), action: this.handleRedraftClick });
    } else {
      menu.push({ text: intl.formatMessage(messages.mention, { name: status.getIn(['account', 'username']) }), action: this.handleMentionClick });
      //menu.push({ text: intl.formatMessage(messages.direct, { name: status.getIn(['account', 'username']) }), action: this.handleDirectClick });
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

    const shareButton = ('share' in navigator) && status.get('visibility') === 'public' && (
      <div className='detailed-status__button'><IconButton title={intl.formatMessage(messages.share)} icon='share-alt' onClick={this.handleShare} /></div>
    );

    let replyIcon;
    if (status.get('in_reply_to_id', null) === null) {
      replyIcon = 'reply';
    } else {
      replyIcon = 'reply-all';
    }

    let reblogIcon = 'retweet';
    if (status.get('visibility') === 'direct') reblogIcon = 'envelope';
    else if (status.get('visibility') === 'private') reblogIcon = 'lock';

    const reblog_disabled = (status.get('visibility') === 'direct' || status.get('visibility') === 'private');


    return (
      <div className='detailed-status__action-bar'>
        <div className='detailed-status__button'>
          <IconButton
            title={intl.formatMessage(messages.reply)}
            icon={status.get('in_reply_to_account_id') === status.getIn(['account', 'id']) ? 'reply' : replyIcon}
            onClick={this.handleReplyClick}
            text={intl.formatMessage(messages.reply)}
          />
        </div>
        <div className='detailed-status__button'>
          <IconButton
            disabled={reblog_disabled}
            active={status.get('reblogged')}
            title={reblog_disabled ? intl.formatMessage(messages.cannot_reblog) : intl.formatMessage(messages.reblog)}
            icon={reblogIcon}
            onClick={this.handleReblogClick}
            text={intl.formatMessage(messages.reblog)}
          />
        </div>
        <div
          className='detailed-status__button detailed-status__button--favourite'
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
            className='star-icon'
            animate
            active={Boolean(meEmojiReact)}
            title={meEmojiTitle}
            icon='thumbs-up'
            emoji={meEmojiReact}
            text={meEmojiTitle}
            onClick={this.handleLikeButtonClick}
          />
          <IconButton
            className='emoji-picker-expand'
            animate
            title={intl.formatMessage(messages.emojiPickerExpand)}
            icon='caret-down'
            onKeyUp={handleEmojiSelectorExpand}
            onHover
          />
        </div>
        {shareButton}

        <div className='detailed-status__action-bar-dropdown'>
          <DropdownMenuContainer size={18} icon='ellipsis-h' items={menu} direction='left' title='More' />
        </div>
      </div>
    );
  }

}

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(ActionBar));

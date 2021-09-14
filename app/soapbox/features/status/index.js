import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { fetchStatus } from '../../actions/statuses';
import MissingIndicator from '../../components/missing_indicator';
import DetailedStatus from './components/detailed_status';
import ActionBar from './components/action_bar';
import Column from '../ui/components/column';
import {
  favourite,
  unfavourite,
  reblog,
  unreblog,
  bookmark,
  unbookmark,
  pin,
  unpin,
} from '../../actions/interactions';
import { simpleEmojiReact } from '../../actions/emoji_reacts';
import {
  replyCompose,
  mentionCompose,
  directCompose,
} from '../../actions/compose';
import { blockAccount } from '../../actions/accounts';
import {
  muteStatus,
  unmuteStatus,
  deleteStatus,
  hideStatus,
  revealStatus,
} from '../../actions/statuses';
import { initMuteModal } from '../../actions/mutes';
import { initReport } from '../../actions/reports';
import { makeGetStatus } from '../../selectors';
import ColumnHeader from '../../components/column_header';
import StatusContainer from '../../containers/status_container';
import { openModal } from '../../actions/modal';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { createSelector } from 'reselect';
import { HotKeys } from 'react-hotkeys';
import { attachFullscreenListener, detachFullscreenListener, isFullscreen } from '../ui/util/fullscreen';
import { textForScreenReader, defaultMediaVisibility } from '../../components/status';
import Icon from 'soapbox/components/icon';
import { getSettings } from 'soapbox/actions/settings';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { deactivateUserModal, deleteUserModal, deleteStatusModal, toggleStatusSensitivityModal } from 'soapbox/actions/moderation';

const messages = defineMessages({
  deleteConfirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
  deleteMessage: { id: 'confirmations.delete.message', defaultMessage: 'Are you sure you want to delete this post?' },
  redraftConfirm: { id: 'confirmations.redraft.confirm', defaultMessage: 'Delete & redraft' },
  redraftMessage: { id: 'confirmations.redraft.message', defaultMessage: 'Are you sure you want to delete this post and re-draft it? Favorites and reposts will be lost, and replies to the original post will be orphaned.' },
  blockConfirm: { id: 'confirmations.block.confirm', defaultMessage: 'Block' },
  revealAll: { id: 'status.show_more_all', defaultMessage: 'Show more for all' },
  hideAll: { id: 'status.show_less_all', defaultMessage: 'Show less for all' },
  detailedStatus: { id: 'status.detailed_status', defaultMessage: 'Detailed conversation view' },
  replyConfirm: { id: 'confirmations.reply.confirm', defaultMessage: 'Reply' },
  replyMessage: { id: 'confirmations.reply.message', defaultMessage: 'Replying now will overwrite the message you are currently composing. Are you sure you want to proceed?' },
  blockAndReport: { id: 'confirmations.block.block_and_report', defaultMessage: 'Block & Report' },
});

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus();

  const getAncestorsIds = createSelector([
    (_, { id }) => id,
    state => state.getIn(['contexts', 'inReplyTos']),
  ], (statusId, inReplyTos) => {
    let ancestorsIds = ImmutableOrderedSet();
    let id = statusId;

    while (id) {
      ancestorsIds = ImmutableOrderedSet([id]).union(ancestorsIds);
      id = inReplyTos.get(id);
    }

    return ancestorsIds;
  });

  const getDescendantsIds = createSelector([
    (_, { id }) => id,
    state => state.getIn(['contexts', 'replies']),
  ], (statusId, contextReplies) => {
    let descendantsIds = ImmutableOrderedSet();
    const ids = [statusId];

    while (ids.length > 0) {
      const id      = ids.shift();
      const replies = contextReplies.get(id);

      if (statusId !== id) {
        descendantsIds = descendantsIds.union([id]);
      }

      if (replies) {
        replies.reverse().forEach(reply => {
          ids.unshift(reply);
        });
      }
    }

    return descendantsIds;
  });

  const mapStateToProps = (state, props) => {
    const status = getStatus(state, { id: props.params.statusId });
    let ancestorsIds = ImmutableOrderedSet();
    let descendantsIds = ImmutableOrderedSet();

    if (status) {
      ancestorsIds = getAncestorsIds(state, { id: state.getIn(['contexts', 'inReplyTos', status.get('id')]) });
      descendantsIds = getDescendantsIds(state, { id: status.get('id') });
    }

    const soapbox = getSoapboxConfig(state);

    return {
      status,
      ancestorsIds,
      descendantsIds,
      askReplyConfirmation: state.getIn(['compose', 'text']).trim().length !== 0,
      domain: state.getIn(['meta', 'domain']),
      me: state.get('me'),
      displayMedia: getSettings(state).get('displayMedia'),
      allowedEmoji: soapbox.get('allowedEmoji'),
    };
  };

  return mapStateToProps;
};

export default @injectIntl
@connect(makeMapStateToProps)
class Status extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    status: ImmutablePropTypes.map,
    ancestorsIds: ImmutablePropTypes.orderedSet,
    descendantsIds: ImmutablePropTypes.orderedSet,
    intl: PropTypes.object.isRequired,
    askReplyConfirmation: PropTypes.bool,
    domain: PropTypes.string,
    displayMedia: PropTypes.string,
  };

  state = {
    fullscreen: false,
    showMedia: defaultMediaVisibility(this.props.status, this.props.displayMedia),
    loadedStatusId: undefined,
    emojiSelectorFocused: false,
  };

  componentDidMount() {
    this.props.dispatch(fetchStatus(this.props.params.statusId));
    attachFullscreenListener(this.onFullScreenChange);
  }

  handleToggleMediaVisibility = () => {
    this.setState({ showMedia: !this.state.showMedia });
  }

  handleEmojiReactClick = (status, emoji) => {
    this.props.dispatch(simpleEmojiReact(status, emoji));
  }

  handleFavouriteClick = (status) => {
    if (status.get('favourited')) {
      this.props.dispatch(unfavourite(status));
    } else {
      this.props.dispatch(favourite(status));
    }
  }

  handlePin = (status) => {
    if (status.get('pinned')) {
      this.props.dispatch(unpin(status));
    } else {
      this.props.dispatch(pin(status));
    }
  }

  handleBookmark = (status) => {
    if (status.get('bookmarked')) {
      this.props.dispatch(unbookmark(this.props.intl, status));
    } else {
      this.props.dispatch(bookmark(this.props.intl, status));
    }
  }

  handleReplyClick = (status) => {
    const { askReplyConfirmation, dispatch, intl } = this.props;
    if (askReplyConfirmation) {
      dispatch(openModal('CONFIRM', {
        message: intl.formatMessage(messages.replyMessage),
        confirm: intl.formatMessage(messages.replyConfirm),
        onConfirm: () => dispatch(replyCompose(status, this.context.router.history)),
      }));
    } else {
      dispatch(replyCompose(status, this.context.router.history));
    }
  }

  handleModalReblog = (status) => {
    this.props.dispatch(reblog(status));
  }

  handleReblogClick = (status, e) => {
    this.props.dispatch((_, getState) => {
      const boostModal = getSettings(getState()).get('boostModal');
      if (status.get('reblogged')) {
        this.props.dispatch(unreblog(status));
      } else {
        if ((e && e.shiftKey) || !boostModal) {
          this.handleModalReblog(status);
        } else {
          this.props.dispatch(openModal('BOOST', { status, onReblog: this.handleModalReblog }));
        }
      }
    });
  }

  handleDeleteClick = (status, history, withRedraft = false) => {
    const { dispatch, intl } = this.props;

    this.props.dispatch((_, getState) => {
      const deleteModal = getSettings(getState()).get('deleteModal');
      if (!deleteModal) {
        dispatch(deleteStatus(status.get('id'), history, withRedraft));
      } else {
        dispatch(openModal('CONFIRM', {
          message: intl.formatMessage(withRedraft ? messages.redraftMessage : messages.deleteMessage),
          confirm: intl.formatMessage(withRedraft ? messages.redraftConfirm : messages.deleteConfirm),
          onConfirm: () => dispatch(deleteStatus(status.get('id'), history, withRedraft)),
        }));
      }
    });
  }

  handleDirectClick = (account, router) => {
    this.props.dispatch(directCompose(account, router));
  }

  handleMentionClick = (account, router) => {
    this.props.dispatch(mentionCompose(account, router));
  }

  handleOpenMedia = (media, index) => {
    this.props.dispatch(openModal('MEDIA', { media, index }));
  }

  handleOpenVideo = (media, time) => {
    this.props.dispatch(openModal('VIDEO', { media, time }));
  }

  handleHotkeyOpenMedia = e => {
    const { onOpenMedia, onOpenVideo } = this.props;
    const status = this._properStatus();

    e.preventDefault();

    if (status.get('media_attachments').size > 0) {
      if (status.getIn(['media_attachments', 0, 'type']) === 'video') {
        onOpenVideo(status.getIn(['media_attachments', 0]), 0);
      } else {
        onOpenMedia(status.get('media_attachments'), 0);
      }
    }
  }

  handleMuteClick = (account) => {
    this.props.dispatch(initMuteModal(account));
  }

  handleConversationMuteClick = (status) => {
    if (status.get('muted')) {
      this.props.dispatch(unmuteStatus(status.get('id')));
    } else {
      this.props.dispatch(muteStatus(status.get('id')));
    }
  }

  handleToggleHidden = (status) => {
    if (status.get('hidden')) {
      this.props.dispatch(revealStatus(status.get('id')));
    } else {
      this.props.dispatch(hideStatus(status.get('id')));
    }
  }

  handleToggleAll = () => {
    const { status, ancestorsIds, descendantsIds } = this.props;
    const statusIds = [status.get('id')].concat(ancestorsIds.toJS(), descendantsIds.toJS());

    if (status.get('hidden')) {
      this.props.dispatch(revealStatus(statusIds));
    } else {
      this.props.dispatch(hideStatus(statusIds));
    }
  }

  handleBlockClick = (status) => {
    const { dispatch, intl } = this.props;
    const account = status.get('account');

    dispatch(openModal('CONFIRM', {
      message: <FormattedMessage id='confirmations.block.message' defaultMessage='Are you sure you want to block {name}?' values={{ name: <strong>@{account.get('acct')}</strong> }} />,
      confirm: intl.formatMessage(messages.blockConfirm),
      onConfirm: () => dispatch(blockAccount(account.get('id'))),
      secondary: intl.formatMessage(messages.blockAndReport),
      onSecondary: () => {
        dispatch(blockAccount(account.get('id')));
        dispatch(initReport(account, status));
      },
    }));
  }

  handleReport = (status) => {
    this.props.dispatch(initReport(status.get('account'), status));
  }

  handleEmbed = (status) => {
    this.props.dispatch(openModal('EMBED', { url: status.get('url') }));
  }

  handleDeactivateUser = (status) => {
    const { dispatch, intl } = this.props;
    dispatch(deactivateUserModal(intl, status.getIn(['account', 'id'])));
  }

  handleDeleteUser = (status) => {
    const { dispatch, intl } = this.props;
    dispatch(deleteUserModal(intl, status.getIn(['account', 'id'])));
  }

  handleToggleStatusSensitivity = (status) => {
    const { dispatch, intl } = this.props;
    dispatch(toggleStatusSensitivityModal(intl, status.get('id'), status.get('sensitive')));
  }

  handleDeleteStatus = (status) => {
    const { dispatch, intl } = this.props;
    dispatch(deleteStatusModal(intl, status.get('id')));
  }

  handleHotkeyMoveUp = () => {
    this.handleMoveUp(this.props.status.get('id'));
  }

  handleHotkeyMoveDown = () => {
    this.handleMoveDown(this.props.status.get('id'));
  }

  handleHotkeyReply = e => {
    e.preventDefault();
    this.handleReplyClick(this.props.status);
  }

  handleHotkeyFavourite = () => {
    this.handleFavouriteClick(this.props.status);
  }

  handleHotkeyBoost = () => {
    this.handleReblogClick(this.props.status);
  }

  handleHotkeyMention = e => {
    e.preventDefault();
    this.handleMentionClick(this.props.status.get('account'));
  }

  handleHotkeyOpenProfile = () => {
    this.context.router.history.push(`/@${this.props.status.getIn(['account', 'acct'])}`);
  }

  handleHotkeyToggleHidden = () => {
    this.handleToggleHidden(this.props.status);
  }

  handleHotkeyToggleSensitive = () => {
    this.handleToggleMediaVisibility();
  }

  handleHotkeyReact = () => {
    this._expandEmojiSelector();
  }

  handleMoveUp = id => {
    const { status, ancestorsIds, descendantsIds } = this.props;

    if (id === status.get('id')) {
      this._selectChild(ancestorsIds.size - 1, true);
    } else {
      let index = ancestorsIds.indexOf(id);

      if (index === -1) {
        index = descendantsIds.indexOf(id);
        this._selectChild(ancestorsIds.size + index, true);
      } else {
        this._selectChild(index - 1, true);
      }
    }
  }

  handleMoveDown = id => {
    const { status, ancestorsIds, descendantsIds } = this.props;

    if (id === status.get('id')) {
      this._selectChild(ancestorsIds.size + 1, false);
    } else {
      let index = ancestorsIds.indexOf(id);

      if (index === -1) {
        index = descendantsIds.indexOf(id);
        this._selectChild(ancestorsIds.size + index + 2, false);
      } else {
        this._selectChild(index + 1, false);
      }
    }
  }

  handleEmojiSelectorExpand = e => {
    if (e.key === 'Enter') {
      this._expandEmojiSelector();
    }
    e.preventDefault();
  }

  handleEmojiSelectorUnfocus = () => {
    this.setState({ emojiSelectorFocused: false });
  }

  _expandEmojiSelector = () => {
    this.setState({ emojiSelectorFocused: true });
    const firstEmoji = this.status.querySelector('.emoji-react-selector .emoji-react-selector__emoji');
    firstEmoji.focus();
  };

  _selectChild(index, align_top) {
    const container = this.node;
    const element = container.querySelectorAll('.focusable')[index];

    if (element) {
      if (align_top && container.scrollTop > element.offsetTop) {
        element.scrollIntoView(true);
      } else if (!align_top && container.scrollTop + container.clientHeight < element.offsetTop + element.offsetHeight) {
        element.scrollIntoView(false);
      }
      element.focus();
    }
  }

  renderTombstone(id) {
    return (
      <div className='tombstone' key={id}>
        <p><FormattedMessage id='statuses.tombstone' defaultMessage='One or more posts is unavailable.' /></p>
      </div>
    );
  }

  renderStatus(id) {
    return (
      <StatusContainer
        key={id}
        id={id}
        onMoveUp={this.handleMoveUp}
        onMoveDown={this.handleMoveDown}
        contextType='thread'
      />
    );
  }

  renderChildren(list) {
    return list.map(id => {
      if (id.endsWith('-tombstone')) {
        return this.renderTombstone(id);
      } else {
        return this.renderStatus(id);
      }
    });
  }

  setRef = c => {
    this.node = c;
  }

  setStatusRef = c => {
    this.status = c;
  }

  componentDidUpdate(prevProps, prevState) {
    const { params, status } = this.props;
    const { ancestorsIds } = prevProps;

    if (params.statusId !== prevProps.params.statusId && params.statusId) {
      this._scrolledIntoView = false;
      this.props.dispatch(fetchStatus(params.statusId));
    }

    if (status && status.get('id') !== prevState.loadedStatusId) {
      this.setState({ showMedia: defaultMediaVisibility(status), loadedStatusId: status.get('id') });
    }

    if (this._scrolledIntoView) {
      return;
    }

    if (prevProps.status && ancestorsIds && ancestorsIds.size > 0 && this.node) {
      const element = this.node.querySelector('.detailed-status');

      window.requestAnimationFrame(() => {
        element.scrollIntoView(true);
      });
      this._scrolledIntoView = true;
    }
  }

  componentWillUnmount() {
    detachFullscreenListener(this.onFullScreenChange);
  }

  onFullScreenChange = () => {
    this.setState({ fullscreen: isFullscreen() });
  }

  render() {
    let ancestors, descendants;
    const { status, ancestorsIds, descendantsIds, intl, domain, me } = this.props;

    if (status === null) {
      return (
        <Column>
          <MissingIndicator />
        </Column>
      );
    }

    if (ancestorsIds && ancestorsIds.size > 0) {
      ancestors = <div>{this.renderChildren(ancestorsIds)}</div>;
    }

    if (descendantsIds && descendantsIds.size > 0) {
      descendants = <div>{this.renderChildren(descendantsIds)}</div>;
    }

    const handlers = {
      moveUp: this.handleHotkeyMoveUp,
      moveDown: this.handleHotkeyMoveDown,
      reply: this.handleHotkeyReply,
      favourite: this.handleHotkeyFavourite,
      boost: this.handleHotkeyBoost,
      mention: this.handleHotkeyMention,
      openProfile: this.handleHotkeyOpenProfile,
      toggleHidden: this.handleHotkeyToggleHidden,
      toggleSensitive: this.handleHotkeyToggleSensitive,
      openMedia: this.handleHotkeyOpenMedia,
      react: this.handleHotkeyReact,
    };

    return (
      <Column label={intl.formatMessage(messages.detailedStatus)}>
        { me &&
          <ColumnHeader
            extraButton={(
              <button
                className='column-header__button'
                title={intl.formatMessage(status.get('hidden') ? messages.revealAll : messages.hideAll)}
                aria-label={intl.formatMessage(status.get('hidden') ? messages.revealAll : messages.hideAll)}
                onClick={this.handleToggleAll}
                aria-pressed={
                  status.get('hidden') ? 'false' : 'true'}
              >
                <Icon id={status.get('hidden') ? 'eye-slash' : 'eye'
                }
                />
              </button>
            )}
          />
        }

        <div ref={this.setRef}>
          {ancestors}

          <HotKeys handlers={handlers}>
            <div ref={this.setStatusRef} className={classNames('focusable', 'detailed-status__wrapper')} tabIndex='0' aria-label={textForScreenReader(intl, status, false)}>
              <DetailedStatus
                status={status}
                onOpenVideo={this.handleOpenVideo}
                onOpenMedia={this.handleOpenMedia}
                onToggleHidden={this.handleToggleHidden}
                domain={domain}
                showMedia={this.state.showMedia}
                onToggleMediaVisibility={this.handleToggleMediaVisibility}
              />

              <ActionBar
                status={status}
                onReply={this.handleReplyClick}
                onFavourite={this.handleFavouriteClick}
                onEmojiReact={this.handleEmojiReactClick}
                onReblog={this.handleReblogClick}
                onDelete={this.handleDeleteClick}
                onDirect={this.handleDirectClick}
                onMention={this.handleMentionClick}
                onMute={this.handleMuteClick}
                onMuteConversation={this.handleConversationMuteClick}
                onBlock={this.handleBlockClick}
                onReport={this.handleReport}
                onPin={this.handlePin}
                onBookmark={this.handleBookmark}
                onEmbed={this.handleEmbed}
                onDeactivateUser={this.handleDeactivateUser}
                onDeleteUser={this.handleDeleteUser}
                onToggleStatusSensitivity={this.handleToggleStatusSensitivity}
                onDeleteStatus={this.handleDeleteStatus}
                allowedEmoji={this.props.allowedEmoji}
                emojiSelectorFocused={this.state.emojiSelectorFocused}
                handleEmojiSelectorExpand={this.handleEmojiSelectorExpand}
                handleEmojiSelectorUnfocus={this.handleEmojiSelectorUnfocus}
              />
            </div>
          </HotKeys>

          {descendants}
        </div>
      </Column>
    );
  }

}

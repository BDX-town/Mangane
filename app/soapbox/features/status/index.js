import classNames from 'classnames';
import { List as ImmutableList, OrderedSet as ImmutableOrderedSet } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { HotKeys } from 'react-hotkeys';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createSelector } from 'reselect';

import { launchChat } from 'soapbox/actions/chats';
import {
  deactivateUserModal,
  deleteUserModal,
  deleteStatusModal,
  toggleStatusSensitivityModal,
} from 'soapbox/actions/moderation';
import { getSettings } from 'soapbox/actions/settings';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import PullToRefresh from 'soapbox/components/pull-to-refresh';
import SubNavigation from 'soapbox/components/sub_navigation';
import { Column } from 'soapbox/components/ui';
import PendingStatus from 'soapbox/features/ui/components/pending_status';

import { blockAccount } from '../../actions/accounts';
import {
  replyCompose,
  mentionCompose,
  directCompose,
  quoteCompose,
} from '../../actions/compose';
import { simpleEmojiReact } from '../../actions/emoji_reacts';
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
import { openModal } from '../../actions/modals';
import { initMuteModal } from '../../actions/mutes';
import { initReport } from '../../actions/reports';
import {
  muteStatus,
  unmuteStatus,
  deleteStatus,
  hideStatus,
  revealStatus,
} from '../../actions/statuses';
import { fetchStatusWithContext } from '../../actions/statuses';
import MissingIndicator from '../../components/missing_indicator';
import { textForScreenReader, defaultMediaVisibility } from '../../components/status';
import { makeGetStatus } from '../../selectors';
import { attachFullscreenListener, detachFullscreenListener, isFullscreen } from '../ui/util/fullscreen';

import ActionBar from './components/action_bar';
import DetailedStatus from './components/detailed_status';
import ThreadStatus from './components/thread_status';

const messages = defineMessages({
  title: { id: 'status.title', defaultMessage: '@{username}\'s Post' },
  titleDirect: { id: 'status.title_direct', defaultMessage: 'Direct message' },
  deleteConfirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
  deleteHeading: { id: 'confirmations.delete.heading', defaultMessage: 'Delete post' },
  deleteMessage: { id: 'confirmations.delete.message', defaultMessage: 'Are you sure you want to delete this post?' },
  redraftConfirm: { id: 'confirmations.redraft.confirm', defaultMessage: 'Delete & redraft' },
  redraftHeading: { id: 'confirmations.redraft.heading', defaultMessage: 'Delete & redraft' },
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

    while (id && !ancestorsIds.includes(id)) {
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

      if (descendantsIds.includes(id)) {
        break;
      }

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
      const statusId = status.get('id');
      ancestorsIds = getAncestorsIds(state, { id: state.getIn(['contexts', 'inReplyTos', statusId]) });
      descendantsIds = getDescendantsIds(state, { id: statusId });
      ancestorsIds = ancestorsIds.delete(statusId).subtract(descendantsIds);
      descendantsIds = descendantsIds.delete(statusId).subtract(ancestorsIds);
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

export default @connect(makeMapStateToProps)
@injectIntl
@withRouter
class Status extends ImmutablePureComponent {

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
    history: PropTypes.object,
  };

  state = {
    fullscreen: false,
    showMedia: defaultMediaVisibility(this.props.status, this.props.displayMedia),
    loadedStatusId: undefined,
    emojiSelectorFocused: false,
  };

  fetchData = () => {
    const { dispatch, params } = this.props;
    const { statusId } = params;

    return dispatch(fetchStatusWithContext(statusId));
  }

  componentDidMount() {
    this.fetchData();
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
      this.props.dispatch(unbookmark(status));
    } else {
      this.props.dispatch(bookmark(status));
    }
  }

  handleReplyClick = (status) => {
    const { askReplyConfirmation, dispatch, intl } = this.props;
    if (askReplyConfirmation) {
      dispatch(openModal('CONFIRM', {
        message: intl.formatMessage(messages.replyMessage),
        confirm: intl.formatMessage(messages.replyConfirm),
        onConfirm: () => dispatch(replyCompose(status, this.props.history)),
      }));
    } else {
      dispatch(replyCompose(status, this.props.history));
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

  handleQuoteClick = (status, e) => {
    const { askReplyConfirmation, dispatch, intl } = this.props;
    if (askReplyConfirmation) {
      dispatch(openModal('CONFIRM', {
        message: intl.formatMessage(messages.replyMessage),
        confirm: intl.formatMessage(messages.replyConfirm),
        onConfirm: () => dispatch(quoteCompose(status, this.props.history)),
      }));
    } else {
      dispatch(quoteCompose(status, this.props.history));
    }
  }

  handleDeleteClick = (status, history, withRedraft = false) => {
    const { dispatch, intl } = this.props;

    this.props.dispatch((_, getState) => {
      const deleteModal = getSettings(getState()).get('deleteModal');
      if (!deleteModal) {
        dispatch(deleteStatus(status.get('id'), history, withRedraft));
      } else {
        dispatch(openModal('CONFIRM', {
          icon: withRedraft ? require('@tabler/icons/icons/edit.svg') : require('@tabler/icons/icons/trash.svg'),
          heading: intl.formatMessage(withRedraft ? messages.redraftHeading : messages.deleteHeading),
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

  handleChatClick = (account, router) => {
    this.props.dispatch(launchChat(account.get('id'), router));
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
      icon: require('@tabler/icons/icons/ban.svg'),
      heading: <FormattedMessage id='confirmations.block.heading' defaultMessage='Block @{name}' values={{ name: account.get('acct') }} />,
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
    this.props.history.push(`/@${this.props.status.getIn(['account', 'acct'])}`);
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
      let index = ImmutableList(ancestorsIds).indexOf(id);

      if (index === -1) {
        index = ImmutableList(descendantsIds).indexOf(id);
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
      let index = ImmutableList(ancestorsIds).indexOf(id);

      if (index === -1) {
        index = ImmutableList(descendantsIds).indexOf(id);
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
    const { status } = this.props;

    return (
      <ThreadStatus
        key={id}
        id={id}
        focusedStatusId={status && status.get('id')}
        onMoveUp={this.handleMoveUp}
        onMoveDown={this.handleMoveDown}
        contextType='thread'
      />
    );
  }

  renderPendingStatus(id) {
    const idempotencyKey = id.replace(/^末pending-/, '');

    return (
      <PendingStatus
        className='thread__status'
        key={id}
        idempotencyKey={idempotencyKey}
        focusedStatusId={status && status.get('id')}
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
      } else if (id.startsWith('末pending-')) {
        return this.renderPendingStatus(id);
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

    if (params.statusId !== prevProps.params.statusId) {
      this._scrolledIntoView = false;
      this.fetchData();
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

  handleRefresh = () => {
    return this.fetchData();
  }

  render() {
    let ancestors, descendants;
    const { status, ancestorsIds, descendantsIds, intl, domain } = this.props;

    if (status === null) {
      return (
        <MissingIndicator />
      );
    }

    if (ancestorsIds && ancestorsIds.size > 0) {
      ancestors = this.renderChildren(ancestorsIds);
    }

    if (descendantsIds && descendantsIds.size > 0) {
      descendants = this.renderChildren(descendantsIds);
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

    const username = status.getIn(['account', 'acct']);
    const titleMessage = status && status.get('visibility') === 'direct' ? messages.titleDirect : messages.title;

    return (
      <Column label={intl.formatMessage(titleMessage, { username })} transparent>
        <div className='px-4 pt-4 sm:p-0'>
          <SubNavigation message={intl.formatMessage(titleMessage, { username })} />
        </div>
        {/*
          Eye icon to show/hide all CWs in a thread.
          I'm not convinced of the value of this. It needs a better design at the very least.
        */}
        {/* me &&
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
        */}

        <div ref={this.setRef} className='thread'>
          <PullToRefresh onRefresh={this.handleRefresh}>
            {ancestors && (
              <div className='thread__ancestors space-y-4 mb-4'>{ancestors}</div>
            )}

            <div className='thread__status thread__status--focused'>
              <HotKeys handlers={handlers}>
                <div ref={this.setStatusRef} className={classNames('detailed-status__wrapper')} tabIndex='0' aria-label={textForScreenReader(intl, status, false)}>
                  <DetailedStatus
                    status={status}
                    onOpenVideo={this.handleOpenVideo}
                    onOpenMedia={this.handleOpenMedia}
                    onToggleHidden={this.handleToggleHidden}
                    domain={domain}
                    showMedia={this.state.showMedia}
                    onToggleMediaVisibility={this.handleToggleMediaVisibility}
                  />

                  <hr className='mb-2' />

                  <ActionBar
                    status={status}
                    onReply={this.handleReplyClick}
                    onFavourite={this.handleFavouriteClick}
                    onEmojiReact={this.handleEmojiReactClick}
                    onReblog={this.handleReblogClick}
                    onQuote={this.handleQuoteClick}
                    onDelete={this.handleDeleteClick}
                    onDirect={this.handleDirectClick}
                    onChat={this.handleChatClick}
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
            </div>

            {descendants && (
              <>
                <hr className='mt-2' />
                <div className='thread__descendants space-y-4'>{descendants}</div>
              </>
            )}
          </PullToRefresh>
        </div>
      </Column>
    );
  }

}

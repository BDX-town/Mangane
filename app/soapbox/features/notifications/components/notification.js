import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import StatusContainer from '../../../containers/status_container';
import AccountContainer from '../../../containers/account_container';
import { injectIntl, FormattedMessage } from 'react-intl';
import Permalink from '../../../components/permalink';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { HotKeys } from 'react-hotkeys';
import Icon from 'soapbox/components/icon';
import emojify from 'soapbox/features/emoji/emoji';

const notificationForScreenReader = (intl, message, timestamp) => {
  const output = [message];

  output.push(intl.formatDate(timestamp, { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }));

  return output.join(', ');
};

export default @injectIntl
class Notification extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    notification: ImmutablePropTypes.map.isRequired,
    hidden: PropTypes.bool,
    onMoveUp: PropTypes.func.isRequired,
    onMoveDown: PropTypes.func.isRequired,
    onMention: PropTypes.func.isRequired,
    onFavourite: PropTypes.func.isRequired,
    onReblog: PropTypes.func.isRequired,
    onToggleHidden: PropTypes.func.isRequired,
    status: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
    getScrollPosition: PropTypes.func,
    updateScrollBottom: PropTypes.func,
    cacheMediaWidth: PropTypes.func,
    cachedMediaWidth: PropTypes.number,
  };

  handleMoveUp = () => {
    const { notification, onMoveUp } = this.props;
    onMoveUp(notification.get('id'));
  }

  handleMoveDown = () => {
    const { notification, onMoveDown } = this.props;
    onMoveDown(notification.get('id'));
  }

  handleOpen = () => {
    const { notification } = this.props;

    if (notification.get('status')) {
      this.context.router.history.push(`/@${notification.getIn(['account', 'acct'])}/posts/${notification.get('status')}`);
    } else {
      this.handleOpenProfile();
    }
  }

  handleOpenProfile = () => {
    const { notification } = this.props;
    this.context.router.history.push(`/@${notification.getIn(['account', 'acct'])}`);
  }

  handleMention = e => {
    e.preventDefault();

    const { notification, onMention } = this.props;
    onMention(notification.get('account'), this.context.router.history);
  }

  handleHotkeyFavourite = () => {
    const { status } = this.props;
    if (status) this.props.onFavourite(status);
  }

  handleHotkeyBoost = e => {
    const { status } = this.props;
    if (status) this.props.onReblog(status, e);
  }

  handleHotkeyToggleHidden = () => {
    const { status } = this.props;
    if (status) this.props.onToggleHidden(status);
  }

  getHandlers() {
    return {
      reply: this.handleMention,
      favourite: this.handleHotkeyFavourite,
      boost: this.handleHotkeyBoost,
      mention: this.handleMention,
      open: this.handleOpen,
      openProfile: this.handleOpenProfile,
      moveUp: this.handleMoveUp,
      moveDown: this.handleMoveDown,
      toggleHidden: this.handleHotkeyToggleHidden,
    };
  }

  renderFollow(notification, account, link) {
    const { intl } = this.props;

    return (
      <HotKeys handlers={this.getHandlers()}>
        <div className='notification notification-follow focusable' tabIndex='0' aria-label={notificationForScreenReader(intl, intl.formatMessage({ id: 'notification.follow', defaultMessage: '{name} followed you' }, { name: account.get('acct') }), notification.get('created_at'))}>
          <div className='notification__message'>
            <div className='notification__favourite-icon-wrapper'>
              <Icon id='user-plus' fixedWidth />
            </div>

            <span title={notification.get('created_at')}>
              <FormattedMessage id='notification.follow' defaultMessage='{name} followed you' values={{ name: link }} />
            </span>
          </div>

          <AccountContainer id={account.get('id')} withNote={false} hidden={this.props.hidden} />
        </div>
      </HotKeys>
    );
  }

  renderMention(notification) {
    return (
      <StatusContainer
        id={notification.get('status')}
        withDismiss
        hidden={this.props.hidden}
        onMoveDown={this.handleMoveDown}
        onMoveUp={this.handleMoveUp}
        contextType='notifications'
        getScrollPosition={this.props.getScrollPosition}
        updateScrollBottom={this.props.updateScrollBottom}
        cachedMediaWidth={this.props.cachedMediaWidth}
        cacheMediaWidth={this.props.cacheMediaWidth}
      />
    );
  }

  renderChatMention(notification, link) {
    const { intl } = this.props;

    return (
      <HotKeys handlers={this.getHandlers()}>
        <div className='notification notification-chat-mention focusable' tabIndex='0' aria-label={notificationForScreenReader(intl, intl.formatMessage({ id: 'notification.chat_mention', defaultMessage: '{name} sent you a message' }, { name: notification.getIn(['account', 'acct']) }), notification.get('created_at'))}>
          <div className='notification__message'>
            <div className='notification__favourite-icon-wrapper'>
              <Icon id='comment' fixedWidth />
            </div>

            <span title={notification.get('created_at')}>
              <FormattedMessage id='notification.chat_mention' defaultMessage='{name} sent you a message' values={{ name: link }} />
            </span>
          </div>
        </div>

        <div className='chat-message'>
          <span
            className='chat-message__bubble'
            dangerouslySetInnerHTML={{ __html: emojify(notification.getIn(['chat_message', 'content'])) }}
          />
        </div>
      </HotKeys>
    );
  }

  renderEmojiReact(notification, link) {
    const { intl } = this.props;

    return (
      <HotKeys handlers={this.getHandlers()}>
        <div className='notification notification-emoji-react focusable' tabIndex='0' aria-label={notificationForScreenReader(intl, intl.formatMessage({ id: 'notification.emoji_react', defaultMessage: '{name} reacted to your post' }, { name: notification.getIn(['account', 'acct']) }), notification.get('created_at'))}>
          <div className='notification__message'>
            <div className='notification__favourite-icon-wrapper'>
              <span dangerouslySetInnerHTML={{ __html: emojify(emojify(notification.get('emoji'))) }} />
            </div>

            <span title={notification.get('created_at')}>
              <FormattedMessage id='notification.emoji_react' defaultMessage='{name} reacted to your post' values={{ name: link }} />
            </span>
          </div>

          <StatusContainer
            id={notification.get('status')}
            account={notification.get('account')}
            muted
            withDismiss
            hidden={!!this.props.hidden}
            getScrollPosition={this.props.getScrollPosition}
            updateScrollBottom={this.props.updateScrollBottom}
            cachedMediaWidth={this.props.cachedMediaWidth}
            cacheMediaWidth={this.props.cacheMediaWidth}
          />
        </div>
      </HotKeys>
    );
  }

  renderFavourite(notification, link) {
    const { intl } = this.props;

    return (
      <HotKeys handlers={this.getHandlers()}>
        <div className='notification notification-favourite focusable' tabIndex='0' aria-label={notificationForScreenReader(intl, intl.formatMessage({ id: 'notification.favourite', defaultMessage: '{name} liked your post' }, { name: notification.getIn(['account', 'acct']) }), notification.get('created_at'))}>
          <div className='notification__message'>
            <div className='notification__favourite-icon-wrapper'>
              <Icon id='thumbs-up' className='star-icon' fixedWidth />
            </div>

            <span title={notification.get('created_at')}>
              <FormattedMessage id='notification.favourite' defaultMessage='{name} liked your post' values={{ name: link }} />
            </span>
          </div>

          <StatusContainer
            id={notification.get('status')}
            account={notification.get('account')}
            muted
            withDismiss
            hidden={!!this.props.hidden}
            getScrollPosition={this.props.getScrollPosition}
            updateScrollBottom={this.props.updateScrollBottom}
            cachedMediaWidth={this.props.cachedMediaWidth}
            cacheMediaWidth={this.props.cacheMediaWidth}
          />
        </div>
      </HotKeys>
    );
  }

  renderReblog(notification, link) {
    const { intl } = this.props;

    return (
      <HotKeys handlers={this.getHandlers()}>
        <div className='notification notification-reblog focusable' tabIndex='0' aria-label={notificationForScreenReader(intl, intl.formatMessage({ id: 'notification.reblog', defaultMessage: '{name} reposted your post' }, { name: notification.getIn(['account', 'acct']) }), notification.get('created_at'))}>
          <div className='notification__message'>
            <div className='notification__favourite-icon-wrapper'>
              <Icon id='retweet' fixedWidth />
            </div>

            <span title={notification.get('created_at')}>
              <FormattedMessage id='notification.reblog' defaultMessage='{name} reposted your post' values={{ name: link }} />
            </span>
          </div>

          <StatusContainer
            id={notification.get('status')}
            account={notification.get('account')}
            muted
            withDismiss
            hidden={this.props.hidden}
            getScrollPosition={this.props.getScrollPosition}
            updateScrollBottom={this.props.updateScrollBottom}
            cachedMediaWidth={this.props.cachedMediaWidth}
            cacheMediaWidth={this.props.cacheMediaWidth}
          />
        </div>
      </HotKeys>
    );
  }

  renderPoll(notification) {
    const { intl } = this.props;

    return (
      <HotKeys handlers={this.getHandlers()}>
        <div className='notification notification-poll focusable' tabIndex='0' aria-label={notificationForScreenReader(intl, intl.formatMessage({ id: 'notification.poll', defaultMessage: 'A poll you have voted in has ended' }), notification.get('created_at'))}>
          <div className='notification__message'>
            <div className='notification__favourite-icon-wrapper'>
              <Icon id='tasks' fixedWidth />
            </div>

            <span title={notification.get('created_at')}>
              <FormattedMessage id='notification.poll' defaultMessage='A poll you have voted in has ended' />
            </span>
          </div>

          <StatusContainer
            id={notification.get('status')}
            account={notification.get('account')}
            muted
            withDismiss
            hidden={this.props.hidden}
            getScrollPosition={this.props.getScrollPosition}
            updateScrollBottom={this.props.updateScrollBottom}
            cachedMediaWidth={this.props.cachedMediaWidth}
            cacheMediaWidth={this.props.cacheMediaWidth}
          />
        </div>
      </HotKeys>
    );
  }

  render() {
    const { notification } = this.props;
    const account          = notification.get('account');
    const displayNameHtml  = { __html: account.get('display_name_html') };
    const link             = <bdi><Permalink className='notification__display-name' href={`/@${account.get('acct')}`} title={account.get('acct')} to={`/@${account.get('acct')}`} dangerouslySetInnerHTML={displayNameHtml} /></bdi>;

    switch(notification.get('type')) {
    case 'follow':
      return this.renderFollow(notification, account, link);
    case 'mention':
      return this.renderMention(notification);
    case 'favourite':
      return this.renderFavourite(notification, link);
    case 'reblog':
      return this.renderReblog(notification, link);
    case 'poll':
      return this.renderPoll(notification);
    case 'pleroma:emoji_reaction':
      return this.renderEmojiReact(notification, link);
    case 'pleroma:chat_mention':
      return this.renderChatMention(notification, link);
    }

    return null;
  }

}

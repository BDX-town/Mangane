import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { HotKeys } from 'react-hotkeys';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';

import Icon from 'soapbox/components/icon';
import emojify from 'soapbox/features/emoji/emoji';

import Permalink from '../../../components/permalink';
import AccountContainer from '../../../containers/account_container';
import StatusContainer from '../../../containers/status_container';
import FollowRequestContainer from '../containers/follow_request_container';

const notificationForScreenReader = (intl, message, timestamp) => {
  const output = [message];

  output.push(intl.formatDate(timestamp, { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }));

  return output.join(', ');
};

export default @injectIntl @withRouter
class Notification extends ImmutablePureComponent {

  static propTypes = {
    notification: ImmutablePropTypes.map.isRequired,
    hidden: PropTypes.bool,
    onMoveUp: PropTypes.func.isRequired,
    onMoveDown: PropTypes.func.isRequired,
    onMention: PropTypes.func.isRequired,
    onFavourite: PropTypes.func.isRequired,
    onReblog: PropTypes.func.isRequired,
    onToggleHidden: PropTypes.func.isRequired,
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
      this.props.history.push(`/@${notification.getIn(['account', 'acct'])}/posts/${notification.getIn(['status', 'id'])}`);
    } else {
      this.handleOpenProfile();
    }
  }

  handleOpenProfile = () => {
    const { notification } = this.props;
    this.props.history.push(`/@${notification.getIn(['account', 'acct'])}`);
  }

  handleMention = e => {
    e.preventDefault();

    const { notification, onMention } = this.props;
    onMention(notification.get('account'), this.props.history);
  }

  handleHotkeyFavourite = () => {
    const { notification } = this.props;
    const status = notification.get('status');
    if (status) this.props.onFavourite(status);
  }

  handleHotkeyBoost = e => {
    const { notification } = this.props;
    const status = notification.get('status');
    if (status) this.props.onReblog(status, e);
  }

  handleHotkeyToggleHidden = () => {
    const { notification } = this.props;
    const status = notification.get('status');
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

  renderLink = account => {
    return (
      <bdi>
        <Permalink
          className='notification__display-name'
          href={`/@${account.get('acct')}`}
          title={account.get('acct')}
          to={`/@${account.get('acct')}`}
          dangerouslySetInnerHTML={{ __html: account.get('display_name_html') }}
        />
      </bdi>
    );

  }

  renderFollow(notification) {
    const { intl } = this.props;

    const account = notification.get('account');
    const link    = this.renderLink(account);

    return (
      <HotKeys handlers={this.getHandlers()}>
        <div className='notification notification-follow focusable' tabIndex='0' aria-label={notificationForScreenReader(intl, intl.formatMessage({ id: 'notification.follow', defaultMessage: '{name} followed you' }, { name: notification.getIn(['account', 'acct']) }), notification.get('created_at'))}>
          <div className='notification__message'>
            <div className='notification__icon-wrapper'>
              <Icon src={require('@tabler/icons/icons/user-plus.svg')} />
            </div>

            <span title={notification.get('created_at')}>
              <FormattedMessage id='notification.follow' defaultMessage='{name} followed you' values={{ name: link }} />
            </span>
          </div>

          <AccountContainer id={notification.getIn(['account', 'id'])} withNote={false} hidden={this.props.hidden} />
        </div>
      </HotKeys>
    );
  }

  renderFollowRequest(notification) {
    const { intl, unread } = this.props;

    const account = notification.get('account');
    const link    = this.renderLink(account);

    return (
      <HotKeys handlers={this.getHandlers()}>
        <div className={classNames('notification notification-follow-request focusable', { unread })} tabIndex='0' aria-label={notificationForScreenReader(intl, intl.formatMessage({ id: 'notification.follow_request', defaultMessage: '{name} has requested to follow you' }, { name: notification.getIn(['account', 'acct']) }), notification.get('created_at'))}>
          <div className='notification__message'>
            <div className='notification__icon-wrapper'>
              <Icon src={require('@tabler/icons/icons/user.svg')} />
            </div>

            <span title={notification.get('created_at')}>
              <FormattedMessage id='notification.follow_request' defaultMessage='{name} has requested to follow you' values={{ name: link }} />
            </span>
          </div>

          <FollowRequestContainer id={notification.getIn(['account', 'id'])} withNote={false} hidden={this.props.hidden} />
        </div>
      </HotKeys>
    );
  }

  renderMention(notification) {
    return (
      <div className='notification notification-mention focusable-within' tabIndex='0'>
        <StatusContainer
          id={notification.getIn(['status', 'id'])}
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
      </div>
    );
  }

  renderChatMention(notification) {
    const { intl } = this.props;

    const account = notification.get('account');
    const link    = this.renderLink(account);

    return (
      <HotKeys handlers={this.getHandlers()}>
        <div className='notification notification-chat-mention focusable' tabIndex='0' aria-label={notificationForScreenReader(intl, intl.formatMessage({ id: 'notification.chat_mention', defaultMessage: '{name} sent you a message' }, { name: notification.getIn(['account', 'acct']) }), notification.get('created_at'))}>
          <div className='notification__message'>
            <div className='notification__icon-wrapper'>
              <Icon src={require('@tabler/icons/icons/messages.svg')} />
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

  renderEmojiReact(notification) {
    const { intl } = this.props;

    const account = notification.get('account');
    const link    = this.renderLink(account);

    return (
      <HotKeys handlers={this.getHandlers()}>
        <div className='notification notification-emoji-react focusable' tabIndex='0' aria-label={notificationForScreenReader(intl, intl.formatMessage({ id: 'notification.pleroma:emoji_reaction', defaultMessage: '{name} reacted to your post' }, { name: notification.getIn(['account', 'acct']) }), notification.get('created_at'))}>
          <div className='notification__message'>
            <div className='notification__icon-wrapper'>
              <span dangerouslySetInnerHTML={{ __html: emojify(emojify(notification.get('emoji'))) }} />
            </div>

            <span title={notification.get('created_at')}>
              <FormattedMessage id='notification.pleroma:emoji_reaction' defaultMessage='{name} reacted to your post' values={{ name: link }} />
            </span>
          </div>

          <StatusContainer
            id={notification.getIn(['status', 'id'])}
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

  renderFavourite(notification) {
    const { intl } = this.props;

    const account = notification.get('account');
    const link    = this.renderLink(account);

    return (
      <HotKeys handlers={this.getHandlers()}>
        <div className='notification notification-favourite focusable' tabIndex='0' aria-label={notificationForScreenReader(intl, intl.formatMessage({ id: 'notification.favourite', defaultMessage: '{name} liked your post' }, { name: notification.getIn(['account', 'acct']) }), notification.get('created_at'))}>
          <div className='notification__message'>
            <div className='notification__icon-wrapper'>
              <Icon src={require('@tabler/icons/icons/thumb-up.svg')} />
            </div>

            <span title={notification.get('created_at')}>
              <FormattedMessage id='notification.favourite' defaultMessage='{name} liked your post' values={{ name: link }} />
            </span>
          </div>

          <StatusContainer
            id={notification.getIn(['status', 'id'])}
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

  renderReblog(notification) {
    const { intl } = this.props;

    const account = notification.get('account');
    const link    = this.renderLink(account);

    return (
      <HotKeys handlers={this.getHandlers()}>
        <div className='notification notification-reblog focusable' tabIndex='0' aria-label={notificationForScreenReader(intl, intl.formatMessage({ id: 'notification.reblog', defaultMessage: '{name} reposted your post' }, { name: notification.getIn(['account', 'acct']) }), notification.get('created_at'))}>
          <div className='notification__message'>
            <div className='notification__icon-wrapper'>
              <Icon src={require('feather-icons/dist/icons/repeat.svg')} />
            </div>

            <span title={notification.get('created_at')}>
              <FormattedMessage id='notification.reblog' defaultMessage='{name} reposted your post' values={{ name: link }} />
            </span>
          </div>

          <StatusContainer
            id={notification.getIn(['status', 'id'])}
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
            <div className='notification__icon-wrapper'>
              <Icon src={require('@tabler/icons/icons/chart-bar.svg')} />
            </div>

            <span title={notification.get('created_at')}>
              <FormattedMessage id='notification.poll' defaultMessage='A poll you have voted in has ended' />
            </span>
          </div>

          <StatusContainer
            id={notification.getIn(['status', 'id'])}
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

  renderMove(notification) {
    const { intl } = this.props;

    const account = notification.get('account');
    const target  = notification.get('target');
    const link    = this.renderLink(account);
    const targetLink = this.renderLink(target);

    return (
      <HotKeys handlers={this.getHandlers()}>
        <div className='notification notification-move focusable' tabIndex='0' aria-label={notificationForScreenReader(intl, intl.formatMessage({ id: 'notification.move', defaultMessage: '{name} moved to {targetName}' }, { name: notification.getIn(['account', 'acct']), targetName: notification.getIn(['target', 'acct']) }), notification.get('created_at'))}>
          <div className='notification__message'>
            <div className='notification__icon-wrapper'>
              <Icon src={require('feather-icons/dist/icons/briefcase.svg')} />
            </div>

            <span title={notification.get('created_at')}>
              <FormattedMessage id='notification.move' defaultMessage='{name} moved to {targetName}' values={{ name: link, targetName: targetLink }} />
            </span>
          </div>

          <AccountContainer id={notification.getIn(['target', 'id'])} withNote={false} hidden={this.props.hidden} />
        </div>
      </HotKeys>
    );
  }

  render() {
    const { notification } = this.props;

    switch(notification.get('type')) {
    case 'follow':
      return this.renderFollow(notification);
    case 'follow_request':
      return this.renderFollowRequest(notification);
    case 'mention':
      return this.renderMention(notification);
    case 'favourite':
      return this.renderFavourite(notification);
    case 'reblog':
      return this.renderReblog(notification);
    case 'poll':
      return this.renderPoll(notification);
    case 'move':
      return this.renderMove(notification);
    case 'pleroma:emoji_reaction':
      return this.renderEmojiReact(notification);
    case 'pleroma:chat_mention':
      return this.renderChatMention(notification);
    }

    return null;
  }

}

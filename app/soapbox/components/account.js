import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Avatar from './avatar';
import DisplayName from './display_name';
import Permalink from './permalink';
import Icon from './icon';
import IconButton from './icon_button';
import RelativeTimestamp from './relative_timestamp';
import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import classNames from 'classnames';
import emojify from 'soapbox/features/emoji/emoji';

const messages = defineMessages({
  follow: { id: 'account.follow', defaultMessage: 'Follow' },
  unfollow: { id: 'account.unfollow', defaultMessage: 'Unfollow' },
  requested: { id: 'account.requested', defaultMessage: 'Awaiting approval' },
  unblock: { id: 'account.unblock', defaultMessage: 'Unblock @{name}' },
  unmute: { id: 'account.unmute', defaultMessage: 'Unmute @{name}' },
  mute_notifications: { id: 'account.mute_notifications', defaultMessage: 'Mute notifications from @{name}' },
  unmute_notifications: { id: 'account.unmute_notifications', defaultMessage: 'Unmute notifications from @{name}' },
});

const mapStateToProps = state => {
  return {
    me: state.get('me'),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class Account extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    onFollow: PropTypes.func.isRequired,
    onBlock: PropTypes.func.isRequired,
    onMute: PropTypes.func.isRequired,
    onMuteNotifications: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    hidden: PropTypes.bool,
    actionIcon: PropTypes.string,
    actionTitle: PropTypes.string,
    onActionClick: PropTypes.func,
    withDate: PropTypes.bool,
    withRelationship: PropTypes.bool,
    reaction: PropTypes.string,
  };

  static defaultProps = {
    withDate: false,
    withRelationship: true,
  }

  handleFollow = () => {
    this.props.onFollow(this.props.account);
  }

  handleBlock = () => {
    this.props.onBlock(this.props.account);
  }

  handleMute = () => {
    this.props.onMute(this.props.account);
  }

  handleMuteNotifications = () => {
    this.props.onMuteNotifications(this.props.account, true);
  }

  handleUnmuteNotifications = () => {
    this.props.onMuteNotifications(this.props.account, false);
  }

  handleAction = () => {
    this.props.onActionClick(this.props.account);
  }

  render() {
    const { account, intl, hidden, onActionClick, actionIcon, actionTitle, me, withDate, withRelationship, reaction } = this.props;

    if (!account) {
      return <div />;
    }

    if (hidden) {
      return (
        <Fragment>
          {account.get('display_name')}
          {account.get('username')}
        </Fragment>
      );
    }

    let buttons;
    let followedBy;
    let emoji;

    if (onActionClick && actionIcon) {
      buttons = <IconButton icon={actionIcon} title={actionTitle} onClick={this.handleAction} />;
    } else if (account.get('id') !== me && account.get('relationship', null) !== null) {
      const following = account.getIn(['relationship', 'following']);
      const requested = account.getIn(['relationship', 'requested']);
      const blocking  = account.getIn(['relationship', 'blocking']);
      const muting  = account.getIn(['relationship', 'muting']);

      followedBy  = account.getIn(['relationship', 'followed_by']);

      if (requested) {
        buttons = <IconButton disabled icon='hourglass' title={intl.formatMessage(messages.requested)} />;
      } else if (blocking) {
        buttons = <IconButton active icon='unlock' title={intl.formatMessage(messages.unblock, { name: account.get('username') })} onClick={this.handleBlock} />;
      } else if (muting) {
        let hidingNotificationsButton;
        if (account.getIn(['relationship', 'muting_notifications'])) {
          hidingNotificationsButton = <IconButton active icon='bell' title={intl.formatMessage(messages.unmute_notifications, { name: account.get('username') })} onClick={this.handleUnmuteNotifications} />;
        } else {
          hidingNotificationsButton = <IconButton active icon='bell-slash' title={intl.formatMessage(messages.mute_notifications, { name: account.get('username')  })} onClick={this.handleMuteNotifications} />;
        }
        buttons = (
          <Fragment>
            <IconButton active icon='volume-up' title={intl.formatMessage(messages.unmute, { name: account.get('username') })} onClick={this.handleMute} />
            {hidingNotificationsButton}
          </Fragment>
        );
      } else if (!account.get('moved') || following) {
        buttons = <IconButton icon={following ? 'user-times' : 'user-plus'} title={intl.formatMessage(following ? messages.unfollow : messages.follow)} onClick={this.handleFollow} active={following} />;
      }
    }

    if (reaction) {
      emoji = (
        <span
          className='emoji-react__emoji'
          dangerouslySetInnerHTML={{ __html: emojify(reaction) }}
        />
      );
    }

    const createdAt = account.get('created_at');

    const joinedAt = createdAt ? (
      <div className='account__joined-at'>
        <Icon id='calendar' />
        <RelativeTimestamp timestamp={createdAt} />
      </div>
    ) : null;

    return (
      <div className={classNames('account', { 'account--with-relationship': withRelationship, 'account--with-date': withDate })}>
        <div className='account__wrapper'>
          <Permalink key={account.get('id')} className='account__display-name' title={account.get('acct')} href={`/@${account.get('acct')}`} to={`/@${account.get('acct')}`}>
            <div className='account__avatar-wrapper'>
              {emoji}
              <Avatar account={account} size={36} />
            </div>
            <DisplayName account={account} withDate={Boolean(withDate && withRelationship)} />
          </Permalink>

          {withRelationship ? (<>
            {followedBy &&
              <span className='relationship-tag'>
                <FormattedMessage id='account.follows_you' defaultMessage='Follows you' />
              </span>}

            <div className='account__relationship'>
              {buttons}
            </div>
          </>) : withDate && joinedAt}
        </div>
      </div>
    );
  }

}

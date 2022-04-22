import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import emojify from 'soapbox/features/emoji/emoji';
import ActionButton from 'soapbox/features/ui/components/action_button';

import Avatar from './avatar';
import DisplayName from './display_name';
import Icon from './icon';
import IconButton from './icon_button';
import Permalink from './permalink';
import RelativeTimestamp from './relative_timestamp';

const mapStateToProps = state => {
  return {
    me: state.get('me'),
  };
};

export default @connect(mapStateToProps)
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
    const { account, hidden, onActionClick, actionIcon, actionTitle, me, withDate, withRelationship, reaction } = this.props;

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
      buttons = <IconButton src={actionIcon} title={actionTitle} onClick={this.handleAction} />;
    } else if (account.get('id') !== me && account.get('relationship', null) !== null) {
      buttons = <ActionButton account={account} />;
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
        <Icon src={require('@tabler/icons/icons/clock.svg')} />
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

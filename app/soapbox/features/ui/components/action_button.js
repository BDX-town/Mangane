import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import Button from 'soapbox/components/button';
import ImmutablePureComponent from 'react-immutable-pure-component';
import classNames from 'classnames';
import {
  followAccount,
  unfollowAccount,
  blockAccount,
  unblockAccount,
} from 'soapbox/actions/accounts';

const messages = defineMessages({
  unfollow: { id: 'account.unfollow', defaultMessage: 'Unfollow' },
  follow: { id: 'account.follow', defaultMessage: 'Follow' },
  remote_follow: { id: 'account.remote_follow', defaultMessage: 'Remote follow' },
  requested: { id: 'account.requested', defaultMessage: 'Awaiting approval. Click to cancel follow request' },
  requested_small: { id: 'account.requested_small', defaultMessage: 'Awaiting approval' },
  unblock: { id: 'account.unblock', defaultMessage: 'Unblock @{name}' },
  edit_profile: { id: 'account.edit_profile', defaultMessage: 'Edit profile' },
});

const mapStateToProps = state => {
  const me = state.get('me');
  return {
    me,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onFollow(account) {
    if (account.getIn(['relationship', 'following']) || account.getIn(['relationship', 'requested'])) {
      dispatch(unfollowAccount(account.get('id')));
    } else {
      dispatch(followAccount(account.get('id')));
    }
  },

  onBlock(account) {
    if (account.getIn(['relationship', 'blocking'])) {
      dispatch(unblockAccount(account.get('id')));
    } else {
      dispatch(blockAccount(account.get('id')));
    }
  },
});

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class ActionButton extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    onFollow: PropTypes.func.isRequired,
    onBlock: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    small: PropTypes.bool,
  };

  static defaultProps = {
    small: false,
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleFollow = () => {
    this.props.onFollow(this.props.account);
  }

  handleBlock = () => {
    this.props.onBlock(this.props.account);
  }

  render() {
    const { account, intl, me, small } = this.props;
    const empty = <></>;

    if (!me) {
      // Remote follow
      return (<form method='POST' action='/main/ostatus'>
        <input type='hidden' name='nickname' value={account.get('username')} />
        <input type='hidden' name='profile' value='' />
        <Button className='logo-button' text={intl.formatMessage(messages.remote_follow)} click='submit' />
      </form>);
    }

    if (me !== account.get('id')) {
      if (!account.get('relationship')) { // Wait until the relationship is loaded
        return empty;
      } else if (account.getIn(['relationship', 'requested'])) {
        // Awaiting acceptance
        return <Button className='logo-button' text={small ? intl.formatMessage(messages.requested_small) : intl.formatMessage(messages.requested)} onClick={this.handleFollow} />;
      } else if (!account.getIn(['relationship', 'blocking'])) {
        // Follow & Unfollow
        return (<Button
          disabled={account.getIn(['relationship', 'blocked_by'])}
          className={classNames('logo-button', {
            'button--destructive': account.getIn(['relationship', 'following']),
          })}
          text={intl.formatMessage(account.getIn(['relationship', 'following']) ? messages.unfollow : messages.follow)}
          onClick={this.handleFollow}
        />);
      } else if (account.getIn(['relationship', 'blocking'])) {
        // Unblock
        return <Button className='logo-button' text={intl.formatMessage(messages.unblock, { name: account.get('username') })} onClick={this.handleBlock} />;
      }
    } else {
      // Edit profile
      return <Button className='logo-button' text={intl.formatMessage(messages.edit_profile)} to='/settings/profile' />;
    }
    return empty;
  }

}

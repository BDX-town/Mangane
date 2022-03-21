import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import {
  followAccount,
  unfollowAccount,
  blockAccount,
  unblockAccount,
} from 'soapbox/actions/accounts';
import { openModal } from 'soapbox/actions/modals';
import Icon from 'soapbox/components/icon';
import { Button } from 'soapbox/components/ui';
import { getFeatures } from 'soapbox/utils/features';

const messages = defineMessages({
  unfollow: { id: 'account.unfollow', defaultMessage: 'Unfollow' },
  follow: { id: 'account.follow', defaultMessage: 'Follow' },
  remote_follow: { id: 'account.remote_follow', defaultMessage: 'Remote follow' },
  requested: { id: 'account.requested', defaultMessage: 'Awaiting approval. Click to cancel follow request' },
  requested_small: { id: 'account.requested_small', defaultMessage: 'Awaiting approval' },
  unblock: { id: 'account.unblock', defaultMessage: 'Unblock @{name}' },
  edit_profile: { id: 'account.edit_profile', defaultMessage: 'Edit profile' },
  blocked: { id: 'account.blocked', defaultMessage: 'Blocked' },
});

const mapStateToProps = state => {
  const me = state.get('me');
  const instance = state.get('instance');

  return {
    me,
    features: getFeatures(instance),
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

  onOpenUnauthorizedModal(account) {
    dispatch(openModal('UNAUTHORIZED', {
      action: 'FOLLOW',
      account: account.get('id'),
      ap_id: account.get('url'),
    }));
  },
});

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class ActionButton extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    onFollow: PropTypes.func.isRequired,
    onBlock: PropTypes.func.isRequired,
    onOpenUnauthorizedModal: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    small: PropTypes.bool,
    features: PropTypes.object.isRequired,
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

  handleRemoteFollow = () => {
    this.props.onOpenUnauthorizedModal(this.props.account);
  }

  render() {
    const { account, intl, me, small, features } = this.props;
    const empty = <></>;

    if (!me) {
      // Remote follow
      if (features.remoteInteractionsAPI) {
        return (<Button
          className='button--follow'
          onClick={this.handleRemoteFollow}
        >
          {intl.formatMessage(messages.follow)}
          <Icon src={require('@tabler/icons/icons/plus.svg')} />
        </Button>);
      }

      return (<form method='POST' action='/main/ostatus'>
        <input type='hidden' name='nickname' value={account.get('acct')} />
        <input type='hidden' name='profile' value='' />
        <Button className='logo-button' text={intl.formatMessage(messages.remote_follow)} click='submit' />
      </form>);
    }

    if (me !== account.get('id')) {
      const isFollowing = account.getIn(['relationship', 'following']);
      const blockedBy = account.getIn(['relationship', 'blocked_by']);

      if (!account.get('relationship')) { // Wait until the relationship is loaded
        return empty;
      } else if (account.getIn(['relationship', 'requested'])) {
        // Awaiting acceptance
        return <Button size='sm' theme='secondary' text={small ? intl.formatMessage(messages.requested_small) : intl.formatMessage(messages.requested)} onClick={this.handleFollow} />;
      } else if (!account.getIn(['relationship', 'blocking'])) {
        // Follow & Unfollow
        return (<Button
          size='sm'
          disabled={blockedBy}
          theme={isFollowing ? 'secondary' : 'primary'}
          icon={blockedBy ? require('@tabler/icons/icons/ban.svg') : (!isFollowing && require('@tabler/icons/icons/plus.svg'))}
          onClick={this.handleFollow}
        >
          {isFollowing ? (
            intl.formatMessage(messages.unfollow)
          ) : (
            intl.formatMessage(blockedBy ? messages.blocked : messages.follow)
          )}
        </Button>);
      } else if (account.getIn(['relationship', 'blocking'])) {
        // Unblock
        return <Button theme='danger' size='sm' text={intl.formatMessage(messages.unblock, { name: account.get('username') })} onClick={this.handleBlock} />;
      }
    } else {
      // Edit profile
      return <Button theme='secondary' size='sm' text={intl.formatMessage(messages.edit_profile)} to='/settings/profile' />;
    }
    return empty;
  }

}

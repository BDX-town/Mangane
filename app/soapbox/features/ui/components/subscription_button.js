import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import {
  followAccount,
  subscribeAccount,
  unsubscribeAccount,
} from 'soapbox/actions/accounts';
import Icon from 'soapbox/components/icon';
import { Button } from 'soapbox/components/ui';

const messages = defineMessages({
  subscribe: { id: 'account.subscribe', defaultMessage: 'Subscribe to notifications from @{name}' },
  unsubscribe: { id: 'account.unsubscribe', defaultMessage: 'Unsubscribe to notifications from @{name}' },
  subscribed: { id: 'account.subscribed', defaultMessage: 'Subscribed' },
});

const mapStateToProps = state => {
  const me = state.get('me');
  return {
    me,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onSubscriptionToggle(account) {
    if (account.getIn(['relationship', 'subscribing'])) {
      dispatch(unsubscribeAccount(account.get('id')));
    } else {
      dispatch(subscribeAccount(account.get('id')));
    }
  },
  onNotifyToggle(account) {
    if (account.getIn(['relationship', 'notifying'])) {
      dispatch(followAccount(account.get('id'), { notify: false }));
    } else {
      dispatch(followAccount(account.get('id'), { notify: true }));
    }
  },
});

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class SubscriptionButton extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.record,
    features: PropTypes.object.isRequired,
  };

  handleSubscriptionToggle = () => {
    if (this.props.features.accountNotifies) this.props.onNotifyToggle(this.props.account);
    else this.props.onSubscriptionToggle(this.props.account);
  }

  render() {
    const { account, intl, features } = this.props;
    const subscribing = features.accountNotifies ? account.getIn(['relationship', 'notifying']) : account.getIn(['relationship', 'subscribing']);
    const following = account.getIn(['relationship', 'following']);
    const requested = account.getIn(['relationship', 'requested']);

    if (requested || following) {
      return (
        <Button
          className={classNames('subscription-button', subscribing && 'button-active')}
          title={intl.formatMessage(subscribing ? messages.unsubscribe : messages.subscribe, { name: account.get('username') })}
          onClick={this.handleSubscriptionToggle}
        >
          <Icon src={subscribing ? require('@tabler/icons/icons/bell-ringing.svg') : require('@tabler/icons/icons/bell.svg')} />
          {subscribing && intl.formatMessage(messages.subscribed)}
        </Button>
      );
    }

    return null;
  }

}

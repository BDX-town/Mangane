import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, injectIntl } from 'react-intl';
import classNames from 'classnames';
import Button from 'soapbox/components/button';
import Icon from 'soapbox/components/icon';
import ImmutablePureComponent from 'react-immutable-pure-component';
import {
  subscribeAccount,
  unsubscribeAccount,
} from 'soapbox/actions/accounts';

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
});

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class SubscriptionButton extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
  };

  handleSubscriptionToggle = () => {
    this.props.onSubscriptionToggle(this.props.account);
  }

  render() {
    const { account, intl } = this.props;
    const subscribing = account.getIn(['relationship', 'subscribing']);
    const following = account.getIn(['relationship', 'following']);
    const requested = account.getIn(['relationship', 'requested']);

    if (requested || following) {
      return (
        <Button
          className={classNames('subscription-button', subscribing && 'button-active')}
          title={intl.formatMessage(subscribing ? messages.unsubscribe : messages.subscribe, { name: account.get('username') })}
          onClick={this.handleSubscriptionToggle}
        >
          <Icon id={subscribing ? 'bell-ringing' : 'bell'} />
          {subscribing && intl.formatMessage(messages.subscribed)}
        </Button>
      );
    }

    return null;
  }

}

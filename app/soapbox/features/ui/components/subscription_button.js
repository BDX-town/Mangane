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
  subscribe: { id: 'account.subscribe', defaultMessage: 'Subscribe to @{name} posts' },
  unsubscribe: { id: 'account.unsubscribe', defaultMessage: 'Unsubscribe @{name} posts' },
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

    let subscriptionButton = '';

    if (account.getIn(['relationship', 'requested']) || account.getIn(['relationship', 'following'])) {
      subscriptionButton = (<Button className={classNames('subscription-button', subscribing && 'button-active')} style={{ padding: 0, lineHeight: '18px' }} title={intl.formatMessage(account.getIn(['relationship', 'subscribing']) ? messages.unsubscribe : messages.subscribe, { name: account.get('username') })} onClick={this.handleSubscriptionToggle}>
        <Icon id={account.getIn(['relationship', 'subscribing']) ? 'bell-ringing' : 'bell'} style={{ margin: 0, fontSize: 18 }} />
      </Button>);
    }

    return subscriptionButton;
  }

}

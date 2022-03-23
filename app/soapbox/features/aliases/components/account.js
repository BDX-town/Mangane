import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { addToAliases } from 'soapbox/actions/aliases';
import Avatar from 'soapbox/components/avatar';
import DisplayName from 'soapbox/components/display_name';
import IconButton from 'soapbox/components/icon_button';
import { makeGetAccount } from 'soapbox/selectors';
import { getFeatures } from 'soapbox/utils/features';

const messages = defineMessages({
  add: { id: 'aliases.account.add', defaultMessage: 'Create alias' },
});

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state, { accountId, added, aliases }) => {
    const me = state.get('me');

    const instance = state.get('instance');
    const features = getFeatures(instance);

    const account = getAccount(state, accountId);
    const apId = account.getIn(['pleroma', 'ap_id']);
    const name = features.accountMoving ? account.get('acct') : apId;

    return {
      account,
      apId,
      added: typeof added === 'undefined' ? aliases.includes(name) : added,
      me,
    };
  };

  return mapStateToProps;
};

const mapDispatchToProps = (dispatch) => ({
  onAdd: (intl, apId) => dispatch(addToAliases(intl, apId)),
});

export default @connect(makeMapStateToProps, mapDispatchToProps)
@injectIntl
class Account extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.record.isRequired,
    apId: PropTypes.string.isRequired,
    intl: PropTypes.object.isRequired,
    onAdd: PropTypes.func.isRequired,
    added: PropTypes.bool,
  };

  static defaultProps = {
    added: false,
  };

  handleOnAdd = () => this.props.onAdd(this.props.intl, this.props.account);

  render() {
    const { account, accountId, intl, added, me } = this.props;

    let button;

    if (!added && accountId !== me) {
      button = (
        <div className='account__relationship'>
          <IconButton src={require('@tabler/icons/icons/plus.svg')} title={intl.formatMessage(messages.add)} onClick={this.handleOnAdd} />
        </div>
      );
    }

    return (
      <div className='account'>
        <div className='account__wrapper'>
          <div className='account__display-name'>
            <div className='account__avatar-wrapper'><Avatar account={account} size={36} /></div>
            <DisplayName account={account} />
          </div>

          {button}
        </div>
      </div>
    );
  }

}

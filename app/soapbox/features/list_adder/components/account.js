import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Avatar from '../../../components/avatar';
import DisplayName from '../../../components/display_name';
import { makeGetAccount } from '../../../selectors';

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state, { accountId }) => ({
    account: getAccount(state, accountId),
  });

  return mapStateToProps;
};


export default @connect(makeMapStateToProps)
@injectIntl
class Account extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
  };

  render() {
    const { account } = this.props;
    return (
      <div className='account'>
        <div className='account__wrapper'>
          <div className='account__display-name'>
            <div className='account__avatar-wrapper'><Avatar account={account} size={36} /></div>
            <DisplayName account={account} />
          </div>
        </div>
      </div>
    );
  }

}

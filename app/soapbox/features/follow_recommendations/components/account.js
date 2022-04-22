import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';

import Avatar from 'soapbox/components/avatar';
import DisplayName from 'soapbox/components/display_name';
import Permalink from 'soapbox/components/permalink';
import ActionButton from 'soapbox/features/ui/components/action_button';
import { makeGetAccount } from 'soapbox/selectors';

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state, props) => ({
    account: getAccount(state, props.id),
  });

  return mapStateToProps;
};

const getFirstSentence = str => {
  const arr = str.split(/(([.?!]+\s)|[．。？！\n•])/);

  return arr[0];
};

export default @connect(makeMapStateToProps)
class Account extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  render() {
    const { account } = this.props;

    return (
      <div className='account follow-recommendations-account'>
        <div className='account__wrapper'>
          <Permalink className='account__display-name account__display-name--with-note' title={account.get('acct')} href={account.get('url')} to={`/@${account.get('acct')}`}>
            <div className='account__avatar-wrapper'><Avatar account={account} size={36} /></div>

            <DisplayName account={account} />

            <div className='account__note'>{getFirstSentence(account.get('note_plain'))}</div>
          </Permalink>

          <div className='account__relationship'>
            <ActionButton account={account} />
          </div>
        </div>
      </div>
    );
  }

}

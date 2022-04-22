import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Avatar from 'soapbox/components/avatar';
import DisplayName from 'soapbox/components/display_name';
import Icon from 'soapbox/components/icon';
import Permalink from 'soapbox/components/permalink';
import { makeGetAccount } from 'soapbox/selectors';

const messages = defineMessages({
  birthday: { id: 'account.birthday', defaultMessage: 'Born {date}' },
});

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state, { accountId }) => {
    const account = getAccount(state, accountId);

    return {
      account,
    };
  };

  return mapStateToProps;
};

export default @connect(makeMapStateToProps)
@injectIntl
class Account extends ImmutablePureComponent {

  static propTypes = {
    accountId: PropTypes.string.isRequired,
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map,
  };

  static defaultProps = {
    added: false,
  };

  componentDidMount() {
    const { account, accountId } = this.props;

    if (accountId && !account) {
      this.props.fetchAccount(accountId);
    }
  }

  render() {
    const { account, intl } = this.props;

    if (!account) return null;

    const birthday = account.get('birthday');
    if (!birthday) return null;

    const formattedBirthday = intl.formatDate(birthday, { day: 'numeric', month: 'short', year: 'numeric' });

    return (
      <div className='account'>
        <div className='account__wrapper'>
          <Permalink className='account__display-name' title={account.get('acct')} href={`/@${account.get('acct')}`} to={`/@${account.get('acct')}`}>
            <div className='account__display-name'>
              <div className='account__avatar-wrapper'><Avatar account={account} size={36} /></div>
              <DisplayName account={account} />

            </div>
          </Permalink>
          <div
            className='account__birthday'
            title={intl.formatMessage(messages.birthday, {
              date: formattedBirthday,
            })}
          >
            <Icon src={require('@tabler/icons/icons/ballon.svg')} />
            {formattedBirthday}
          </div>
        </div>
      </div>
    );
  }

}

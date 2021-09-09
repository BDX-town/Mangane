import React from 'react';
import { connect } from 'react-redux';
import { fetchOwnAccounts } from 'soapbox/actions/auth';
import { throttle } from 'lodash';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import DropdownMenuContainer from '../../../containers/dropdown_menu_container';
import { isStaff } from 'soapbox/utils/accounts';
import { defineMessages, injectIntl } from 'react-intl';
import { logOut, switchAccount } from 'soapbox/actions/auth';
import { is as ImmutableIs } from 'immutable';
import Avatar from 'soapbox/components/avatar';
import DisplayName from 'soapbox/components/display_name';
import { makeGetOtherAccounts } from 'soapbox/selectors';

const messages = defineMessages({
  add: { id: 'profile_dropdown.add_account', defaultMessage: 'Add an existing account' },
  logout: { id: 'profile_dropdown.logout', defaultMessage: 'Log out @{acct}' },
});

const makeMapStateToProps = () => {
  const getOtherAccounts = makeGetOtherAccounts();

  const mapStateToProps = state => {
    const me = state.get('me');

    return {
      account: state.getIn(['accounts', me]),
      otherAccounts: getOtherAccounts(state),
      isStaff: isStaff(state.getIn(['accounts', me])),
    };
  };

  return mapStateToProps;
};

class ProfileDropdown extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    size: PropTypes.number,
    account: ImmutablePropTypes.map,
    otherAccounts: ImmutablePropTypes.list,
    isStaff: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    isStaff: false,
  }

  handleLogOut = e => {
    this.props.dispatch(logOut(this.props.intl));
    e.preventDefault();
  };

  handleSwitchAccount = account => {
    return e => {
      this.props.dispatch(switchAccount(account.get('id')));
      e.preventDefault();
    };
  }

  handleMiddleClick = account => {
    return e => {
      this.props.dispatch(switchAccount(account.get('id'), true));
      window.open('/', '_blank', 'noopener,noreferrer');
      e.preventDefault();
    };
  }

  fetchOwnAccounts = throttle(() => {
    this.props.dispatch(fetchOwnAccounts());
  }, 2000);

  componentDidMount() {
    this.fetchOwnAccounts();
  }

  componentDidUpdate(prevProps) {
    const accountChanged = !ImmutableIs(prevProps.account, this.props.account);
    const otherAccountsChanged = !ImmutableIs(prevProps.otherAccounts, this.props.otherAccounts);

    if (accountChanged || otherAccountsChanged) {
      this.fetchOwnAccounts();
    }
  }

  renderAccount = account => {
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

  render() {
    const { intl, account, otherAccounts } = this.props;
    const size = this.props.size || 16;

    const menu = [];

    menu.push({ text: this.renderAccount(account), to: `/@${account.get('acct')}` });

    otherAccounts.forEach(account => {
      menu.push({ text: this.renderAccount(account), action: this.handleSwitchAccount(account), href: '/', middleClick: this.handleMiddleClick(account) });
    });

    menu.push(null);

    menu.push({ text: intl.formatMessage(messages.add), to: '/auth/sign_in' });
    menu.push({ text: intl.formatMessage(messages.logout, { acct: account.get('acct') }), to: '/auth/sign_out', action: this.handleLogOut });

    return (
      <div className='compose__action-bar' style={{ 'marginTop':'-6px' }}>
        <div className='compose__action-bar-dropdown'>
          <DropdownMenuContainer items={menu} icon='chevron-down' size={size} direction='right' />
        </div>
      </div>
    );
  }

}

export default injectIntl(connect(makeMapStateToProps)(ProfileDropdown));

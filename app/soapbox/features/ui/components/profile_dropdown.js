import React from 'react';
import { connect } from 'react-redux';
// import { openModal } from '../../../actions/modal';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import DropdownMenuContainer from '../../../containers/dropdown_menu_container';
import { isStaff } from 'soapbox/utils/accounts';
import { defineMessages, injectIntl } from 'react-intl';
import { logOut, switchAccount } from 'soapbox/actions/auth';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';

const messages = defineMessages({
  switch: { id: 'profile_dropdown.switch_account', defaultMessage: 'Switch to @{acct}' },
  logout: { id: 'profile_dropdown.logout', defaultMessage: 'Log out @{acct}' },
});

const mapStateToProps = state => {
  const me = state.get('me');

  const otherAccounts =
    state
      .getIn(['auth', 'users'])
      .keySeq()
      .reduce((list, id) => {
        if (id === me) return list;
        const account = state.getIn(['accounts', id]) || ImmutableMap({ id: id, acct: id });
        return list.push(account);
      }, ImmutableList());

  return {
    account: state.getIn(['accounts', me]),
    otherAccounts,
    isStaff: isStaff(state.getIn(['accounts', me])),
  };
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
    this.props.dispatch(logOut());
    e.preventDefault();
  };

  handleSwitchAccount = account => {
    return e => {
      this.props.dispatch(switchAccount(account.get('id')));
      e.preventDefault();
    };
  }

  render() {
    const { intl, account, otherAccounts } = this.props;
    const size = this.props.size || 16;

    let menu = [];

    otherAccounts.forEach(account => {
      menu.push({ text: intl.formatMessage(messages.switch, { acct: account.get('acct') }), action: this.handleSwitchAccount(account) });
    });

    if (otherAccounts.size > 0) {
      menu.push(null);
    }

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

export default injectIntl(connect(mapStateToProps)(ProfileDropdown));

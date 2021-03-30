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
import { List as ImmutableList } from 'immutable';
import Avatar from 'soapbox/components/avatar';
import DisplayName from 'soapbox/components/display_name';

const messages = defineMessages({
  add: { id: 'profile_dropdown.add_account', defaultMessage: 'Add an existing account' },
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
        const account = state.getIn(['accounts', id]);
        return account ? list.push(account) : list;
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

  handleMiddleClick = account => {
    return e => {
      this.props.dispatch(switchAccount(account.get('id'), false));
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

  componentDidUpdate() {
    this.fetchOwnAccounts();
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

    let menu = [];

    menu.push({ text: this.renderAccount(account), to: `/@${account.get('acct')}`, href: '/', middleClick: this.handleMiddleClick(account) });

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

export default injectIntl(connect(mapStateToProps)(ProfileDropdown));

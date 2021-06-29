import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import Button from 'soapbox/components/button';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import DropdownMenuContainer from '../../../../containers/dropdown_menu_container';

const messages = defineMessages({
  join: { id: 'groups.join', defaultMessage: 'Join group' },
  leave: { id: 'groups.leave', defaultMessage: 'Leave group' },
  requested: { id: 'groups.requested', defaultMessage: 'Awaiting approval. Click to cancel join request' },
  removed_accounts: { id: 'groups.removed_accounts', defaultMessage: 'Removed Accounts' },
  edit: { id: 'groups.edit', defaultMessage: 'Edit' },
});

export default @injectIntl
class Header extends ImmutablePureComponent {

  static propTypes = {
    group: ImmutablePropTypes.map,
    relationships: ImmutablePropTypes.map,
    toggleMembership: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  toggle = () => {
    const { group, relationships, toggleMembership } = this.props;
    toggleMembership(group, relationships);
  }

  getActionButton() {
    const { relationships, intl } = this.props;
    if (!relationships) return null;

    const getMessage = (messages, relationships) => {
      if (relationships.get('requested')) return messages.requested;
      return relationships.get('member') ? messages.leave : messages.join;
    };

    const message = getMessage(messages, relationships);

    return <Button className='logo-button' text={intl.formatMessage(message)} onClick={this.toggle} />;
  }

  getAdminMenu() {
    const { group, intl } = this.props;

    const menu = [
      { text: intl.formatMessage(messages.edit), to: `/groups/${group.get('id')}/edit` },
      { text: intl.formatMessage(messages.removed_accounts), to: `/groups/${group.get('id')}/removed_accounts` },
    ];

    return <DropdownMenuContainer items={menu} icon='ellipsis-v' size={24} direction='right' />;
  }

  render() {
    const { group, relationships } = this.props;

    if (!group || !relationships) {
      return null;
    }

    return (
      <div className='group__header-container'>
        <div className='group__header'>
          <div className='group__cover'>
            <img src={group.get('header')} alt='' className='parallax' />
          </div>

          <div className='group__tabs'>
            <NavLink exact className='group__tabs__tab' activeClassName='group__tabs__tab--active' to={`/groups/${group.get('id')}`}>Posts</NavLink>
            <NavLink exact className='group__tabs__tab' activeClassName='group__tabs__tab--active' to={`/groups/${group.get('id')}/members`}>Members</NavLink>
            {this.getActionButton()}
            {relationships.get('admin') && this.getAdminMenu()}
          </div>
        </div>
      </div>
    );
  }

}

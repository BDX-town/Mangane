import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';

import { Button } from 'soapbox/components/ui';

import DropdownMenuContainer from '../../../../containers/dropdown_menu_container';

const messages = defineMessages({
  join: { id: 'groups.join', defaultMessage: 'Join group' },
  leave: { id: 'groups.leave', defaultMessage: 'Leave group' },
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

  toggle = () => {
    const { group, relationships, toggleMembership } = this.props;
    toggleMembership(group, relationships);
  }

  getActionButton() {
    const { group, relationships, intl } = this.props;

    if (!relationships) {
      return '';
    } else if (!relationships.get('member')) {
      return <Button className='logo-button' text={intl.formatMessage(messages.join)} onClick={this.toggle} />;
    } else if (relationships.get('member')) {
      return <Button className='logo-button' text={intl.formatMessage(messages.leave, { name: group.get('title') })} onClick={this.toggle} />;
    }

    return '';
  }

  getAdminMenu() {
    const { group, intl } = this.props;

    const menu = [
      {
        text: intl.formatMessage(messages.edit),
        to: `/groups/${group.get('id')}/edit`,
        icon: require('@tabler/icons/icons/edit.svg'),
      },
      {
        text: intl.formatMessage(messages.removed_accounts),
        to: `/groups/${group.get('id')}/removed_accounts`,
        icon: require('@tabler/icons/icons/trash.svg'),
        destructive: true,
      },
    ];

    return <DropdownMenuContainer items={menu} src={require('@tabler/icons/icons/dots-vertical.svg')} direction='right' />;
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
            <img src={group.get('cover_image_url')} alt='' className='parallax' />
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

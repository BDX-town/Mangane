import React from 'react';
import { connect } from 'react-redux';
import { openModal } from '../../../actions/modal';
import PropTypes from 'prop-types';
import DropdownMenuContainer from '../../../containers/dropdown_menu_container';
import { isStaff } from 'soapbox/utils/accounts';
import { defineMessages, injectIntl } from 'react-intl';
import { logOut } from 'soapbox/actions/auth';

const messages = defineMessages({
  profile: { id: 'account.profile', defaultMessage: 'Profile' },
  messages: { id: 'navigation_bar.messages', defaultMessage: 'Messages' },
  lists: { id: 'navigation_bar.lists', defaultMessage: 'Lists' },
  bookmarks: { id: 'navigation_bar.bookmarks', defaultMessage: 'Bookmarks' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  follow_requests: { id: 'navigation_bar.follow_requests', defaultMessage: 'Follow requests' },
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocked users' },
  domain_blocks: { id: 'navigation_bar.domain_blocks', defaultMessage: 'Hidden domains' },
  mutes: { id: 'navigation_bar.mutes', defaultMessage: 'Muted users' },
  filters: { id: 'navigation_bar.filters', defaultMessage: 'Muted words' },
  admin_settings: { id: 'navigation_bar.admin_settings', defaultMessage: 'Admin settings' },
  soapbox_config: { id: 'navigation_bar.soapbox_config', defaultMessage: 'Soapbox config' },
  import_data: { id: 'navigation_bar.import_data', defaultMessage: 'Import data' },
  security: { id: 'navigation_bar.security', defaultMessage: 'Security' },
  logout: { id: 'navigation_bar.logout', defaultMessage: 'Logout' },
  keyboard_shortcuts: { id: 'navigation_bar.keyboard_shortcuts', defaultMessage: 'Hotkeys' },
});

const mapStateToProps = state => {
  const me = state.get('me');
  return {
    meUsername: state.getIn(['accounts', me, 'username']),
    isStaff: isStaff(state.getIn(['accounts', me])),
  };
};

const mapDispatchToProps = (dispatch, { intl }) => ({
  onOpenHotkeys() {
    dispatch(openModal('HOTKEYS'));
  },
  onClickLogOut(e) {
    dispatch(logOut(intl));
    e.preventDefault();
  },
});

class ActionBar extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    size: PropTypes.number,
    onOpenHotkeys: PropTypes.func.isRequired,
    onClickLogOut: PropTypes.func.isRequired,
    meUsername: PropTypes.string,
    isStaff: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    isStaff: false,
  }

  handleHotkeyClick = () => {
    this.props.onOpenHotkeys();
  }

  render() {
    const { intl, onClickLogOut, meUsername, isStaff } = this.props;
    const size = this.props.size || 16;

    const menu = [];

    menu.push({ text: intl.formatMessage(messages.profile), to: `/@${meUsername}` });
    menu.push({ text: intl.formatMessage(messages.lists), to: '/lists' });
    menu.push({ text: intl.formatMessage(messages.bookmarks), to: '/bookmarks' });
    menu.push(null);
    menu.push({ text: intl.formatMessage(messages.follow_requests), to: '/follow_requests' });
    menu.push({ text: intl.formatMessage(messages.mutes), to: '/mutes' });
    menu.push({ text: intl.formatMessage(messages.blocks), to: '/blocks' });
    menu.push({ text: intl.formatMessage(messages.domain_blocks), to: '/domain_blocks' });
    menu.push({ text: intl.formatMessage(messages.filters), to: '/filters' });
    menu.push(null);
    menu.push({ text: intl.formatMessage(messages.keyboard_shortcuts), action: this.handleHotkeyClick });
    if (isStaff) {
      menu.push({ text: intl.formatMessage(messages.admin_settings), href: '/pleroma/admin', newTab: true });
      menu.push({ text: intl.formatMessage(messages.soapbox_config), to: '/soapbox/config' });
    }
    menu.push({ text: intl.formatMessage(messages.preferences), to: '/settings/preferences' });
    menu.push({ text: intl.formatMessage(messages.import_data), to: '/settings/import' });
    menu.push({ text: intl.formatMessage(messages.security), to: '/auth/edit' });
    menu.push({ text: intl.formatMessage(messages.logout), to: '/auth/sign_out', action: onClickLogOut });

    return (
      <div className='compose__action-bar' style={{ 'marginTop':'-6px' }}>
        <div className='compose__action-bar-dropdown'>
          <DropdownMenuContainer items={menu} icon='chevron-down' size={size} direction='right' />
        </div>
      </div>
    );
  }

}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ActionBar));

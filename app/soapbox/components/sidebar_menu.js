import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl, defineMessages } from 'react-intl';
import classNames from 'classnames';
import Avatar from './avatar';
import IconButton from './icon_button';
import Icon from './icon';
import DisplayName from './display_name';
import { closeSidebar } from '../actions/sidebar';
import { shortNumberFormat } from '../utils/numbers';
import { isStaff } from '../utils/accounts';
import { makeGetAccount } from '../selectors';
import { logOut } from 'soapbox/actions/auth';
import ThemeToggle from '../features/ui/components/theme_toggle';

const messages = defineMessages({
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  follows: { id: 'account.follows', defaultMessage: 'Follows' },
  profile: { id: 'account.profile', defaultMessage: 'Profile' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  follow_requests: { id: 'navigation_bar.follow_requests', defaultMessage: 'Follow requests' },
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocked users' },
  domain_blocks: { id: 'navigation_bar.domain_blocks', defaultMessage: 'Hidden domains' },
  mutes: { id: 'navigation_bar.mutes', defaultMessage: 'Muted users' },
  filters: { id: 'navigation_bar.filters', defaultMessage: 'Muted words' },
  admin_settings: { id: 'navigation_bar.admin_settings', defaultMessage: 'Admin settings' },
  soapbox_config: { id: 'navigation_bar.soapbox_config', defaultMessage: 'Soapbox config' },
  security: { id: 'navigation_bar.security', defaultMessage: 'Security' },
  logout: { id: 'navigation_bar.logout', defaultMessage: 'Logout' },
  lists: { id: 'column.lists', defaultMessage: 'Lists' },
  bookmarks: { id: 'column.bookmarks', defaultMessage: 'Bookmarks' },
  apps: { id: 'tabs_bar.apps', defaultMessage: 'Apps' },
  news: { id: 'tabs_bar.news', defaultMessage: 'News' },
  donate: { id: 'donate', defaultMessage: 'Donate' },
});

const mapStateToProps = state => {
  const me = state.get('me');
  const getAccount = makeGetAccount();

  return {
    account: getAccount(state, me),
    sidebarOpen: state.get('sidebar').sidebarOpen,
    donateUrl: state.getIn(['patron', 'instance', 'url']),
    isStaff: isStaff(state.getIn(['accounts', me])),
  };
};

const mapDispatchToProps = (dispatch) => ({
  onClose() {
    dispatch(closeSidebar());
  },
  onClickLogOut(e) {
    dispatch(logOut());
    e.preventDefault();
  },
});

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class SidebarMenu extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map,
    sidebarOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    isStaff: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    isStaff: false,
  }

  render() {
    const { sidebarOpen, onClose, intl, account, onClickLogOut, donateUrl, isStaff } = this.props;
    if (!account) return null;
    const acct = account.get('acct');

    const classes = classNames('sidebar-menu__root', {
      'sidebar-menu__root--visible': sidebarOpen,
    });

    return (
      <div className={classes}>
        <div className='sidebar-menu__wrapper' role='button' onClick={onClose} />
        <div className='sidebar-menu'>

          <div className='sidebar-menu-header'>
            <span className='sidebar-menu-header__title'>Account Info</span>
            <IconButton title='close' onClick={onClose} icon='close' className='sidebar-menu-header__btn' />
          </div>

          <div className='sidebar-menu__content'>

            <div className='sidebar-menu-profile'>
              <div className='sidebar-menu-profile__avatar'>
                <Link to={`/@${acct}`} title={acct} onClick={onClose}>
                  <Avatar account={account} />
                </Link>
              </div>
              <div className='sidebar-menu-profile__name'>
                <DisplayName account={account} />
              </div>

              <div className='sidebar-menu-profile__stats'>
                <NavLink className='sidebar-menu-profile-stat' to={`/@${acct}/followers`} onClick={onClose} title={intl.formatNumber(account.get('followers_count'))}>
                  <strong className='sidebar-menu-profile-stat__value'>{shortNumberFormat(account.get('followers_count'))}</strong>
                  <span className='sidebar-menu-profile-stat__label'>{intl.formatMessage(messages.followers)}</span>
                </NavLink>
                <NavLink className='sidebar-menu-profile-stat' to={`/@${acct}/following`} onClick={onClose} title={intl.formatNumber(account.get('following_count'))}>
                  <strong className='sidebar-menu-profile-stat__value'>{shortNumberFormat(account.get('following_count'))}</strong>
                  <span className='sidebar-menu-profile-stat__label'>{intl.formatMessage(messages.follows)}</span>
                </NavLink>
              </div>

            </div>

            <div className='sidebar-menu__section sidebar-menu__section--borderless'>
              <div className='sidebar-menu-item theme-toggle'>
                <ThemeToggle showLabel />
              </div>
            </div>

            <div className='sidebar-menu__section sidebar-menu__section'>
              <NavLink className='sidebar-menu-item' to={`/@${acct}`} onClick={onClose}>
                <Icon id='user' />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.profile)}</span>
              </NavLink>
              {donateUrl ?
                <a className='sidebar-menu-item' href={donateUrl} onClick={onClose}>
                  <Icon id='dollar' />
                  <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.donate)}</span>
                </a>
                : ''}
              <NavLink className='sidebar-menu-item' to='/lists' onClick={onClose}>
                <Icon id='list' />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.lists)}</span>
              </NavLink>
              <NavLink className='sidebar-menu-item' to='/bookmarks' onClick={onClose}>
                <Icon id='bookmark' />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.bookmarks)}</span>
              </NavLink>
            </div>

            <div className='sidebar-menu__section'>
              <NavLink className='sidebar-menu-item' to='/follow_requests' onClick={onClose}>
                <Icon id='user-plus' />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.follow_requests)}</span>
              </NavLink>
              <NavLink className='sidebar-menu-item' to='/blocks' onClick={onClose}>
                <Icon id='ban' />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.blocks)}</span>
              </NavLink>
              <NavLink className='sidebar-menu-item' to='/domain_blocks' onClick={onClose}>
                <Icon id='ban' />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.domain_blocks)}</span>
              </NavLink>
              <NavLink className='sidebar-menu-item' to='/mutes' onClick={onClose}>
                <Icon id='times-circle' />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.mutes)}</span>
              </NavLink>
              <NavLink className='sidebar-menu-item' to='/filters' onClick={onClose}>
                <Icon id='filter' />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.filters)}</span>
              </NavLink>
              { isStaff && <a className='sidebar-menu-item' href='/pleroma/admin' target='_blank' onClick={onClose}>
                <Icon id='shield' />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.admin_settings)}</span>
              </a> }
              { isStaff && <NavLink className='sidebar-menu-item' to='/soapbox/config' onClick={onClose}>
                <Icon id='cog' />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.soapbox_config)}</span>
              </NavLink> }
              <NavLink className='sidebar-menu-item' to='/settings/preferences' onClick={onClose}>
                <Icon id='cog' />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.preferences)}</span>
              </NavLink>
              <NavLink className='sidebar-menu-item' to='/auth/edit' onClick={onClose}>
                <Icon id='lock' />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.security)}</span>
              </NavLink>
            </div>

            <div className='sidebar-menu__section'>
              <Link className='sidebar-menu-item' to='/auth/sign_out' onClick={onClickLogOut}>
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.logout)}</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }

}

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { Link, NavLink, withRouter } from 'react-router-dom';

import { getSettings } from 'soapbox/actions/settings';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import Icon from 'soapbox/components/icon';
import IconWithCounter from 'soapbox/components/icon_with_counter';
import SearchContainer from 'soapbox/features/compose/containers/search_container';
import { isStaff } from 'soapbox/utils/accounts';
import { getFeatures } from 'soapbox/utils/features';

import { openModal } from '../../../actions/modals';
import { openSidebar } from '../../../actions/sidebar';
import Avatar from '../../../components/avatar';
import ThemeToggle from '../../ui/components/theme_toggle_container';

import ProfileDropdown from './profile_dropdown';

const messages = defineMessages({
  post: { id: 'tabs_bar.post', defaultMessage: 'Post' },
});

class TabsBar extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    onOpenCompose: PropTypes.func,
    onOpenSidebar: PropTypes.func.isRequired,
    logo: PropTypes.string,
    account: ImmutablePropTypes.map,
    features: PropTypes.object.isRequired,
    dashboardCount: PropTypes.number,
    notificationCount: PropTypes.number,
    chatsCount: PropTypes.number,
    singleUserMode: PropTypes.bool,
    location: PropTypes.object,
  }

  state = {
    collapsed: false,
  }

  setRef = ref => {
    this.node = ref;
  }

  isHomeActive = (match, location) => {
    const { pathname } = location;
    return pathname === '/' || pathname.startsWith('/timeline/');
  }

  shouldShowLinks = () => {
    try {
      const { pathname } = this.props.location;
      return (pathname.startsWith('/@') && !pathname.includes('/posts/')) || pathname.startsWith('/admin');
    } catch {
      return false;
    }
  }

  render() {
    const { intl, account, logo, onOpenCompose, onOpenSidebar, features, dashboardCount, notificationCount, chatsCount, singleUserMode } = this.props;
    const { collapsed } = this.state;
    const showLinks = this.shouldShowLinks();

    const classes = classNames('tabs-bar', {
      'tabs-bar--collapsed': collapsed,
    });

    return (
      <nav className={classes} ref={this.setRef}>
        <div className='tabs-bar__container'>
          <div className='tabs-bar__split tabs-bar__split--left'>
            {logo ? (
              <Link key='logo' className='tabs-bar__link--logo' to='/' data-preview-title-id='column.home'>
                <img alt='Logo' src={logo} />
                <span><FormattedMessage id='tabs_bar.home' defaultMessage='Home' /></span>
              </Link>
            ) : (
              <Link key='logo' className='tabs-bar__link--logo' to='/' data-preview-title-id='column.home'>
                <Icon alt='Logo' src={require('icons/home-square.svg')} />
                <span><FormattedMessage id='tabs_bar.home' defaultMessage='Home' /></span>
              </Link>
            )}

            <div className='tabs-bar__search-container'>
              <SearchContainer openInRoute autosuggest />
            </div>
          </div>
          <div className='tabs-bar__split tabs-bar__split--right'>
            {account ? (
              <>
                {showLinks && (
                  <>
                    <NavLink key='notifications' className='tabs-bar__link' to='/notifications' data-preview-title-id='column.notifications'>
                      <IconWithCounter
                        src={require('@tabler/icons/icons/bell.svg')}
                        className={classNames('primary-navigation__icon', {
                          'svg-icon--active': location.pathname === '/notifications',
                          'svg-icon--unread': notificationCount > 0,
                        })}
                        count={notificationCount}
                      />
                      <span><FormattedMessage id='tabs_bar.notifications' defaultMessage='Notifications' /></span>
                    </NavLink>

                    {features.chats && (
                      <NavLink key='chats' className='tabs-bar__link' to='/chats' data-preview-title-id='column.chats'>
                        <IconWithCounter
                          src={require('@tabler/icons/icons/messages.svg')}
                          className={classNames('primary-navigation__icon', { 'svg-icon--active': location.pathname === '/chats' })}
                          count={chatsCount}
                        />
                        <span><FormattedMessage id='tabs_bar.chats' defaultMessage='Chats' /></span>
                      </NavLink>
                    )}

                    {isStaff(account) && (
                      <NavLink key='dashboard' className='tabs-bar__link' to='/admin' data-preview-title-id='tabs_bar.dashboard'>
                        <IconWithCounter
                          src={location.pathname.startsWith('/admin') ? require('icons/dashboard-filled.svg') : require('@tabler/icons/icons/dashboard.svg')}
                          className='primary-navigation__icon'
                          count={dashboardCount}
                        />
                        <span><FormattedMessage id='tabs_bar.dashboard' defaultMessage='Dashboard' /></span>
                      </NavLink>
                    )}
                  </>
                )}

                <ThemeToggle />
                <div className='tabs-bar__profile'>
                  <Avatar account={account} />
                  <button className='tabs-bar__sidebar-btn' onClick={onOpenSidebar} />
                  <ProfileDropdown account={account} size={34} />
                </div>

                <NavLink to='/search' className='tabs-bar__search'>
                  <Icon
                    src={require('@tabler/icons/icons/search.svg')}
                    className={classNames({ 'svg-icon--active': location.pathname === '/search' })}
                  />
                </NavLink>

                <button className='tabs-bar__button-compose button' onClick={onOpenCompose} aria-label={intl.formatMessage(messages.post)}>
                  <span>{intl.formatMessage(messages.post)}</span>
                </button>
              </>
            ) : (
              <div className='tabs-bar__unauthenticated'>
                <Link className='tabs-bar__button button' to='/auth/sign_in'>
                  <FormattedMessage id='account.login' defaultMessage='Log In' />
                </Link>
                {!singleUserMode && (
                  <Link className='tabs-bar__button button button-alternative-2' to='/'>
                    <FormattedMessage id='account.register' defaultMessage='Sign up' />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  }

}

const mapStateToProps = state => {
  const me = state.get('me');
  const reportsCount = state.getIn(['admin', 'openReports']).count();
  const approvalCount = state.getIn(['admin', 'awaitingApproval']).count();
  const instance = state.get('instance');
  const settings = getSettings(state);
  const soapboxConfig = getSoapboxConfig(state);

  // In demo mode, use the Soapbox logo
  const logo = settings.get('demo') ? require('images/soapbox-logo.svg') : getSoapboxConfig(state).get('logo');

  return {
    account: state.getIn(['accounts', me]),
    logo,
    features: getFeatures(instance),
    notificationCount: state.getIn(['notifications', 'unread']),
    chatsCount: state.getIn(['chats', 'items']).reduce((acc, curr) => acc + Math.min(curr.get('unread', 0), 1), 0),
    dashboardCount: reportsCount + approvalCount,
    singleUserMode: soapboxConfig.get('singleUserMode'),
  };
};

const mapDispatchToProps = (dispatch) => ({
  onOpenCompose() {
    dispatch(openModal('COMPOSE'));
  },
  onOpenSidebar() {
    dispatch(openSidebar());
  },
});

export default withRouter(injectIntl(
  connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true },
  )(TabsBar)));

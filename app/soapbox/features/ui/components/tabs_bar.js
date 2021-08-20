import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import classNames from 'classnames';
import IconWithCounter from 'soapbox/components/icon_with_counter';
import SearchContainer from 'soapbox/features/compose/containers/search_container';
import Avatar from '../../../components/avatar';
import ProfileDropdown from './profile_dropdown';
import { openModal } from '../../../actions/modal';
import { openSidebar } from '../../../actions/sidebar';
import Icon from '../../../components/icon';
import ThemeToggle from '../../ui/components/theme_toggle_container';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { isStaff } from 'soapbox/utils/accounts';
import { getFeatures } from 'soapbox/utils/features';

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
    dashboardCount: PropTypes.number,
    notificationCount: PropTypes.number,
    chatsCount: PropTypes.number,
    features: PropTypes.object.isRequired,
  }

  state = {
    collapsed: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  setRef = ref => {
    this.node = ref;
  }

  isHomeActive = (match, location) => {
    const { pathname } = location;
    return pathname === '/' || pathname.startsWith('/timeline/');
  }

  getNavLinks() {
    const { intl: { formatMessage }, logo, account, dashboardCount, notificationCount, chatsCount, features } = this.props;
    const links = [];
    if (logo) {
      links.push(
        <Link key='logo' className='tabs-bar__link--logo' to='/' data-preview-title-id='column.home'>
          <img alt='Logo' src={logo} />
          <span><FormattedMessage id='tabs_bar.home' defaultMessage='Home' /></span>
        </Link>);
    }
    links.push(
      <NavLink key='home' className='tabs-bar__link' exact to='/' data-preview-title-id='column.home' isActive={this.isHomeActive}>
        <Icon id='home' />
        <span><FormattedMessage id='tabs_bar.home' defaultMessage='Home' /></span>
      </NavLink>);
    if (account) {
      links.push(
        <NavLink key='notifications' className='tabs-bar__link' to='/notifications' data-preview-title-id='column.notifications'>
          <IconWithCounter icon='bell' count={notificationCount} />
          <span><FormattedMessage id='tabs_bar.notifications' defaultMessage='Notifications' /></span>
        </NavLink>);
    }
    if (features.chats && account) {
      links.push(
        <NavLink key='chats' className='tabs-bar__link tabs-bar__link--chats' to='/chats' data-preview-title-id='column.chats'>
          <IconWithCounter icon='comment' count={chatsCount} />
          <span><FormattedMessage id='tabs_bar.chats' defaultMessage='Chats' /></span>
        </NavLink>);
    }
    if (account && isStaff(account)) {
      links.push(
        <NavLink key='dashboard' className='tabs-bar__link' to='/admin' data-preview-title-id='tabs_bar.dashboard'>
          <IconWithCounter icon='tachometer' count={dashboardCount} />
          <span><FormattedMessage id='tabs_bar.dashboard' defaultMessage='Dashboard' /></span>
        </NavLink>);
    }
    links.push(
      <NavLink key='search' className='tabs-bar__link tabs-bar__link--search' to='/search' data-preview-title-id='tabs_bar.search'>
        <Icon id='search' />
        <span><FormattedMessage id='tabs_bar.search' defaultMessage='Search' /></span>
      </NavLink>,
    );
    return links.map((link) =>
      React.cloneElement(link, {
        'aria-label': formatMessage({
          id: link.props['data-preview-title-id'],
        }),
      }));
  }

  render() {
    const { account, onOpenCompose, onOpenSidebar, intl } = this.props;
    const { collapsed } = this.state;

    const classes = classNames('tabs-bar', {
      'tabs-bar--collapsed': collapsed,
    });

    return (
      <nav className={classes} ref={this.setRef}>
        <div className='tabs-bar__container'>
          <div className='tabs-bar__split tabs-bar__split--left'>
            {this.getNavLinks()}
          </div>
          <div className='tabs-bar__split tabs-bar__split--right'>
            <div className='tabs-bar__search-container'>
              <SearchContainer openInRoute />
            </div>
            { account &&
              <>
                <ThemeToggle />
                <div className='tabs-bar__profile'>
                  <Avatar account={account} />
                  <button className='tabs-bar__sidebar-btn' onClick={onOpenSidebar} />
                  <ProfileDropdown account={account} size={34} />
                </div>
                <button className='tabs-bar__button-compose button' onClick={onOpenCompose} aria-label={intl.formatMessage(messages.post)}>
                  <span>{intl.formatMessage(messages.post)}</span>
                </button>
              </>
            }
            {
              !account &&
              <div className='flex'>
                <Link className='tabs-bar__button button' to='/auth/sign_in'>
                  <FormattedMessage id='account.login' defaultMessage='Log In' />
                </Link>
                <Link className='tabs-bar__button button button-alternative-2' to='/'>
                  <FormattedMessage id='account.register' defaultMessage='Sign up' />
                </Link>
              </div>
            }
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

  return {
    account: state.getIn(['accounts', me]),
    logo: getSoapboxConfig(state).get('logo'),
    notificationCount: state.getIn(['notifications', 'unread']),
    chatsCount: state.get('chats').reduce((acc, curr) => acc + Math.min(curr.get('unread', 0), 1), 0),
    dashboardCount: reportsCount + approvalCount,
    features: getFeatures(instance),
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

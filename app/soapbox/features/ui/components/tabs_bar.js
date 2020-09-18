import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import classNames from 'classnames';
import NotificationsCounterIcon from './notifications_counter_icon';
import ReportsCounterIcon from './reports_counter_icon';
import ChatsCounterIcon from './chats_counter_icon';
import SearchContainer from 'soapbox/features/compose/containers/search_container';
import Avatar from '../../../components/avatar';
import ActionBar from 'soapbox/features/compose/components/action_bar';
import { openModal } from '../../../actions/modal';
import { openSidebar } from '../../../actions/sidebar';
import Icon from '../../../components/icon';
import ThemeToggle from '../../ui/components/theme_toggle';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { isStaff } from 'soapbox/utils/accounts';

const messages = defineMessages({
  post: { id: 'tabs_bar.post', defaultMessage: 'Post' },
});

@withRouter
class TabsBar extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    onOpenCompose: PropTypes.func,
    onOpenSidebar: PropTypes.func.isRequired,
    logo: PropTypes.string,
    account: ImmutablePropTypes.map,
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
    const { intl: { formatMessage }, logo, account } = this.props;
    let links = [];
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
          <Icon id='bell' />
          <NotificationsCounterIcon />
          <span><FormattedMessage id='tabs_bar.notifications' defaultMessage='Notifications' /></span>
        </NavLink>);
    }
    if (account) {
      links.push(
        <NavLink key='chats' className='tabs-bar__link tabs-bar__link--chats' to='/chats' data-preview-title-id='column.chats'>
          <Icon id='comment' />
          <ChatsCounterIcon />
          <span><FormattedMessage id='tabs_bar.chats' defaultMessage='Chats' /></span>
        </NavLink>);
    }
    if (account && isStaff(account)) {
      links.push(
        <a key='reports' className='tabs-bar__link' href='/pleroma/admin/#/reports/index' target='_blank' data-preview-title-id='tabs_bar.reports'>
          <Icon id='gavel' />
          <ReportsCounterIcon />
          <span><FormattedMessage id='tabs_bar.reports' defaultMessage='Reports' /></span>
        </a>);
    }
    links.push(
      <NavLink key='search' className='tabs-bar__link tabs-bar__link--search' to='/search' data-preview-title-id='tabs_bar.search'>
        <Icon id='search' />
        <span><FormattedMessage id='tabs_bar.search' defaultMessage='Search' /></span>
      </NavLink>
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
                  <ActionBar account={account} size={34} />
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
  return {
    account: state.getIn(['accounts', me]),
    logo: getSoapboxConfig(state).get('logo'),
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

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true }
  )(TabsBar));

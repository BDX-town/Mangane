import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { throttle } from 'lodash';
import { connect } from 'react-redux';
import classNames from 'classnames';
import NotificationsCounterIcon from './notifications_counter_icon';
import SearchContainer from 'soapbox/features/compose/containers/search_container';
import Avatar from '../../../components/avatar';
import ActionBar from 'soapbox/features/compose/components/action_bar';
import { openModal } from '../../../actions/modal';
import { openSidebar } from '../../../actions/sidebar';
import Icon from '../../../components/icon';
import { changeSetting, getSettings } from 'soapbox/actions/settings';

const messages = defineMessages({
  post: { id: 'tabs_bar.post', defaultMessage: 'Post' },
  switchToLight: { id: 'tabs_bar.theme_toggle_light', defaultMessage: 'Switch to light theme' },
  switchToDark: { id: 'tabs_bar.theme_toggle_dark', defaultMessage: 'Switch to dark theme' },
});

@withRouter
class TabsBar extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    onOpenCompose: PropTypes.func,
    onOpenSidebar: PropTypes.func.isRequired,
    toggleTheme: PropTypes.func,
    logo: PropTypes.string,
    account: ImmutablePropTypes.map,
    themeMode: PropTypes.string,
  }

  state = {
    collapsed: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  lastScrollTop = 0;

  componentDidMount() {
    this.window = window;
    this.documentElement = document.scrollingElement || document.documentElement;

    this.attachScrollListener();
    // Handle initial scroll posiiton
    this.handleScroll();
  }

  componentWillUnmount() {
    this.detachScrollListener();
  }

  setRef = ref => {
    this.node = ref;
  }

  attachScrollListener() {
    this.window.addEventListener('scroll', this.handleScroll);
  }

  detachScrollListener() {
    this.window.removeEventListener('scroll', this.handleScroll);
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
      <NavLink key='home' className='tabs-bar__link' exact to='/' data-preview-title-id='column.home'>
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

  getNewThemeValue() {
    if (this.props.themeMode === 'light') return 'dark';

    return 'light';
  }

  handleToggleTheme = () => {
    this.props.toggleTheme(this.getNewThemeValue());
  }

  handleScroll = throttle(() => {
    if (this.window) {
      const { pageYOffset, innerWidth } = this.window;
      if (innerWidth > 895) return;
      const { scrollTop } = this.documentElement;

      let st = pageYOffset || scrollTop;
      if (st > this.lastScrollTop){
        let offset = st - this.lastScrollTop;
        if (offset > 50) this.setState({ collapsed: true });
      } else {
        let offset = this.lastScrollTop - st;
        if (offset > 50) this.setState({ collapsed: false });
      }

      this.lastScrollTop = st <= 0 ? 0 : st;
    }
  }, 150, {
    trailing: true,
  });

  render() {
    const { account, onOpenCompose, onOpenSidebar, intl, themeMode } = this.props;
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
              <div className='flex'>
                <button className='tabs-bar__button-theme-toggle button' onClick={this.handleToggleTheme} aria-label={themeMode === 'light' ? intl.formatMessage(messages.switchToDark) : intl.formatMessage(messages.switchToLight)}>
                  <Icon id={themeMode === 'light' ? 'sun' : 'moon'} />
                </button>
                <div className='tabs-bar__profile'>
                  <Avatar account={account} />
                  <button className='tabs-bar__sidebar-btn' onClick={onOpenSidebar} />
                  <ActionBar account={account} size={34} />
                </div>
                <button className='tabs-bar__button-compose button' onClick={onOpenCompose} aria-label={intl.formatMessage(messages.post)}>
                  <span>{intl.formatMessage(messages.post)}</span>
                </button>
              </div>
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
  const settings = getSettings(state);
  return {
    account: state.getIn(['accounts', me]),
    logo: state.getIn(['soapbox', 'logo']),
    themeMode: settings.get('themeMode'),
  };
};

const mapDispatchToProps = (dispatch) => ({
  onOpenCompose() {
    dispatch(openModal('COMPOSE'));
  },
  onOpenSidebar() {
    dispatch(openSidebar());
  },
  toggleTheme(setting) {
    dispatch(changeSetting(['themeMode'], setting));
  },
});

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true }
  )(TabsBar));

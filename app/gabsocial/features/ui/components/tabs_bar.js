import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { throttle } from 'lodash';
import { connect } from 'react-redux';
import classNames from 'classnames';
import NotificationsCounterIcon from './notifications_counter_icon';
import SearchContainer from 'gabsocial/features/compose/containers/search_container';
import Avatar from '../../../components/avatar';
import ActionBar from 'gabsocial/features/compose/components/action_bar';
import { openModal } from '../../../actions/modal';
import { openSidebar } from '../../../actions/sidebar';
import Icon from '../../../components/icon';

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
          <FormattedMessage id='tabs_bar.home' defaultMessage='Home' />
        </Link>);
    }
    links.push(
      <NavLink key='home' className='tabs-bar__link' exact to='/' data-preview-title-id='column.home'>
        <Icon id='home' />
        <FormattedMessage id='tabs_bar.home' defaultMessage='Home' />
      </NavLink>);
    if (account) {
      links.push(
        <NavLink key='notifications' className='tabs-bar__link' to='/notifications' data-preview-title-id='column.notifications'>
          <Icon id='bell' />
          <NotificationsCounterIcon />
          <FormattedMessage id='tabs_bar.notifications' defaultMessage='Notifications' />
        </NavLink>);
    }
    links.push(
      <NavLink key='search' className='tabs-bar__link tabs-bar__link--search' to='/search' data-preview-title-id='tabs_bar.search'>
        <Icon id='search' />
        <FormattedMessage id='tabs_bar.search' defaultMessage='Search' />
      </NavLink>
    );
    return links.map((link) =>
      React.cloneElement(link, {
        'aria-label': formatMessage({
          id: link.props['data-preview-title-id'],
        }),
      }));
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
    const { account, onOpenCompose, onOpenSidebar } = this.props;
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
                <div className='tabs-bar__profile'>
                  <Avatar account={account} />
                  <button className='tabs-bar__sidebar-btn' onClick={onOpenSidebar} />
                  <ActionBar account={account} size={34} />
                </div>
                <button className='tabs-bar__button-compose button' onClick={onOpenCompose} aria-label='Gab'>
                  <span>Gab</span>
                </button>
              </div>
            }
            {
              !account &&
              <div className='flex'>
                <Link className='tabs-bar__button button' to='/auth/sign_in'>
                  <FormattedMessage id='account.login' defaultMessage='Log In' />
                </Link>
                <Link className='tabs-bar__button button button-alternative-2' to='/auth/sign_up'>
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
    logo: state.getIn(['soapbox', 'logo']),
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

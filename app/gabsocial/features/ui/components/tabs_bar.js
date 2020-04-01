import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { throttle } from 'lodash';
import { connect } from 'react-redux';
import { me } from '../../../initial_state';
import classNames from 'classnames';
import NotificationsCounterIcon from './notifications_counter_icon';
import SearchContainer from 'gabsocial/features/compose/containers/search_container';
import Avatar from '../../../components/avatar';
import ActionBar from 'gabsocial/features/compose/components/action_bar';
import { openModal } from '../../../actions/modal';
import { openSidebar } from '../../../actions/sidebar';

@withRouter
class TabsBar extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    onOpenCompose: PropTypes.func,
    onOpenSidebar: PropTypes.func.isRequired,
  }

  state = {
    collapsed: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  lastScrollTop = 0;

  componentDidMount () {
    this.window = window;
    this.documentElement = document.scrollingElement || document.documentElement;

    this.attachScrollListener();
    // Handle initial scroll posiiton
    this.handleScroll();
  }

  componentWillUnmount () {
    this.detachScrollListener();
  }

  setRef = ref => {
    this.node = ref;
  }

  attachScrollListener () {
    this.window.addEventListener('scroll', this.handleScroll);
  }

  detachScrollListener () {
    this.window.removeEventListener('scroll', this.handleScroll);
  }

  getPrivateLinks() {
    const { intl: { formatMessage }, logo } = this.props;
    let links = [];
    if (logo) {
      links.push(
        <NavLink key='pr0' className='tabs-bar__link--logo' to='/home#' data-preview-title-id='column.home' style={{ padding: '0', backgroundImage: `url(${logo})` }}>
          <FormattedMessage id='tabs_bar.home' defaultMessage='Home' />
        </NavLink>)
    }
    links.push(
      <NavLink key='pr1' className='tabs-bar__link' to='/home' data-preview-title-id='column.home'>
        <i className='tabs-bar__link__icon home'/>
        <FormattedMessage id='tabs_bar.home' defaultMessage='Home' />
      </NavLink>,
      <NavLink key='pr2' className='tabs-bar__link' to='/notifications' data-preview-title-id='column.notifications'>
        <i className='tabs-bar__link__icon notifications'/>
        <NotificationsCounterIcon />
        <FormattedMessage id='tabs_bar.notifications' defaultMessage='Notifications' />
      </NavLink>,
      // <NavLink key='pr3' className='tabs-bar__link' to='/groups' data-preview-title-id='column.groups'>
      //   <i className='tabs-bar__link__icon groups'/>
      //   <FormattedMessage id='tabs_bar.groups' defaultMessage='Groups' />
      // </NavLink>,
      <NavLink key='pr5' className='tabs-bar__link tabs-bar__link--search' to='/search' data-preview-title-id='tabs_bar.search'>
        <i className='tabs-bar__link__icon tabs-bar__link__icon--search'/>
        <FormattedMessage id='tabs_bar.search' defaultMessage='Search' />
      </NavLink>,
    );
    return links.map((link) =>
      React.cloneElement(link, {
        key: link.props.to,
        'aria-label': formatMessage({
        id: link.props['data-preview-title-id']
      })
    }));
  }

  getPublicLinks() {
    const { intl: { formatMessage }, logo } = this.props;
    let links = [];
    if (logo) {
      links.push(
        <a key='pl0' className='tabs-bar__link--logo' href='/#' data-preview-title-id='column.home' style={{ padding: '0', backgroundImage: `url(${logo})` }}>
          <FormattedMessage id='tabs_bar.home' defaultMessage='Home' />
        </a>
      );
    }
    links.push(
      <a key='pl1' className='tabs-bar__link' href='/home' data-preview-title-id='column.home'  >
        <i className='tabs-bar__link__icon home'/>
        <FormattedMessage id='tabs_bar.home' defaultMessage='Home' />
      </a>,
      <NavLink key='pl2' className='tabs-bar__link tabs-bar__link--search' to='/search' data-preview-title-id='tabs_bar.search' >
        <i className='tabs-bar__link__icon tabs-bar__link__icon--search'/>
        <FormattedMessage id='tabs_bar.search' defaultMessage='Search' />
      </NavLink>
    );
    return links.map((link, i) => React.cloneElement(link, {
      key: i,
    }))
  }

  handleScroll = throttle(() => {
    if (this.window) {
      const { pageYOffset, innerWidth } = this.window;
      if (innerWidth > 895) return;
      const { scrollTop } = this.documentElement;

      let st = pageYOffset || scrollTop;
      if (st > this.lastScrollTop){
        let offset = st - this.lastScrollTop;
        if (offset > 50) this.setState({collapsed: true});
      } else {
        let offset = this.lastScrollTop - st;
        if (offset > 50) this.setState({collapsed: false});
      }

      this.lastScrollTop = st <= 0 ? 0 : st;
    }
  }, 150, {
    trailing: true,
  });

  render () {
    const { intl: { formatMessage }, account, onOpenCompose, onOpenSidebar } = this.props;
    const { collapsed } = this.state;

    const classes = classNames('tabs-bar', {
      'tabs-bar--collapsed': collapsed,
    })

    return (
      <nav className={classes} ref={this.setRef}>
        <div className='tabs-bar__container'>
          <div className='tabs-bar__split tabs-bar__split--left'>
            { account ? this.getPrivateLinks() : this.getPublicLinks() }
          </div>
          <div className='tabs-bar__split tabs-bar__split--right'>
            <div className='tabs-bar__search-container'>
              <SearchContainer openInRoute />
            </div>
            { account &&
              <div className='flex'>
                <div className='tabs-bar__profile'>
                  <Avatar account={account} />
                  <button className='tabs-bar__sidebar-btn' onClick={onOpenSidebar}></button>
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
                <a className='tabs-bar__button button' href='/auth/sign_in'>
                  <FormattedMessage id='account.login' defaultMessage='Log In' />
                </a>
                <a className='tabs-bar__button button button-alternative-2' href='/auth/sign_up'>
                  <FormattedMessage id='account.register' defaultMessage='Sign up' />
                </a>
              </div>
            }
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => {
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
)(TabsBar))

import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import classNames from 'classnames';
import SearchContainer from 'soapbox/features/compose/containers/search_container';
import Avatar from '../../../components/avatar';
import Icon from 'soapbox/components/icon';
import ProfileDropdown from './profile_dropdown';
import { openModal } from '../../../actions/modal';
import { openSidebar } from '../../../actions/sidebar';
import ThemeToggle from '../../ui/components/theme_toggle_container';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';

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

  render() {
    const { account, logo, onOpenCompose, onOpenSidebar, intl } = this.props;
    const { collapsed } = this.state;

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
              <SearchContainer openInRoute />
            </div>
          </div>
          <div className='tabs-bar__split tabs-bar__split--right'>
            {account &&
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

export default withRouter(injectIntl(
  connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true },
  )(TabsBar)));

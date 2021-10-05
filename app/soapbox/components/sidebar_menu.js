import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { throttle } from 'lodash';
import { Link, NavLink } from 'react-router-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import Avatar from './avatar';
import IconButton from './icon_button';
import Icon from './icon';
import DisplayName from './display_name';
import { closeSidebar } from '../actions/sidebar';
import { isAdmin, getBaseURL } from '../utils/accounts';
import { makeGetAccount, makeGetOtherAccounts } from '../selectors';
import { logOut, switchAccount } from 'soapbox/actions/auth';
import ThemeToggle from '../features/ui/components/theme_toggle_container';
import { fetchOwnAccounts } from 'soapbox/actions/auth';
import { is as ImmutableIs } from 'immutable';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { getFeatures } from 'soapbox/utils/features';

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
  import_data: { id: 'navigation_bar.import_data', defaultMessage: 'Import data' },
  account_aliases: { id: 'navigation_bar.account_aliases', defaultMessage: 'Account aliases' },
  security: { id: 'navigation_bar.security', defaultMessage: 'Security' },
  logout: { id: 'navigation_bar.logout', defaultMessage: 'Logout' },
  lists: { id: 'column.lists', defaultMessage: 'Lists' },
  bookmarks: { id: 'column.bookmarks', defaultMessage: 'Bookmarks' },
  header: { id: 'tabs_bar.header', defaultMessage: 'Account Info' },
  apps: { id: 'tabs_bar.apps', defaultMessage: 'Apps' },
  news: { id: 'tabs_bar.news', defaultMessage: 'News' },
  donate: { id: 'donate', defaultMessage: 'Donate' },
  donate_crypto: { id: 'donate_crypto', defaultMessage: 'Donate cryptocurrency' },
  info: { id: 'column.info', defaultMessage: 'Server information' },
  add_account: { id: 'profile_dropdown.add_account', defaultMessage: 'Add an existing account' },
});

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();
  const getOtherAccounts = makeGetOtherAccounts();

  const mapStateToProps = state => {
    const me = state.get('me');
    const account = state.getIn(['accounts', me]);
    const instance = state.get('instance');

    const features = getFeatures(instance);
    const soapbox = getSoapboxConfig(state);

    return {
      account: getAccount(state, me),
      sidebarOpen: state.get('sidebar').sidebarOpen,
      donateUrl: state.getIn(['patron', 'instance', 'url']),
      hasCrypto: typeof soapbox.getIn(['cryptoAddresses', 0, 'ticker']) === 'string',
      otherAccounts: getOtherAccounts(state),
      features,
      siteTitle: instance.get('title'),
      baseURL: getBaseURL(account),
    };
  };

  return mapStateToProps;
};

const mapDispatchToProps = (dispatch, { intl }) => ({
  onClose() {
    dispatch(closeSidebar());
  },
  onClickLogOut(e) {
    dispatch(logOut(intl));
    e.preventDefault();
  },
  fetchOwnAccounts() {
    dispatch(fetchOwnAccounts());
  },
  switchAccount(account) {
    dispatch(switchAccount(account.get('id')));
  },
});

export default @injectIntl
@connect(makeMapStateToProps, mapDispatchToProps)
class SidebarMenu extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map,
    otherAccounts: ImmutablePropTypes.list,
    sidebarOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    features: PropTypes.object.isRequired,
    baseURL: PropTypes.string,
  };

  state = {
    switcher: false,
  }

  handleClose = () => {
    this.setState({ switcher: false });
    this.props.onClose();
  }

  handleSwitchAccount = account => {
    return e => {
      this.props.switchAccount(account);
      e.preventDefault();
    };
  }

  handleSwitcherClick = e => {
    this.setState({ switcher: !this.state.switcher });
    e.preventDefault();
  }

  fetchOwnAccounts = throttle(() => {
    this.props.fetchOwnAccounts();
  }, 2000);

  componentDidMount() {
    this.fetchOwnAccounts();
  }

  componentDidUpdate(prevProps) {
    const accountChanged = !ImmutableIs(prevProps.account, this.props.account);
    const otherAccountsChanged = !ImmutableIs(prevProps.otherAccounts, this.props.otherAccounts);

    if (accountChanged || otherAccountsChanged) {
      this.fetchOwnAccounts();
    }
  }

  renderAccount = account => {
    return (
      <a href='/' className='sidebar-account' onClick={this.handleSwitchAccount(account)} key={account.get('id')}>
        <div className='account'>
          <div className='account__wrapper'>
            <div className='account__display-name'>
              <div className='account__avatar-wrapper'><Avatar account={account} size={36} /></div>
              <DisplayName account={account} />
            </div>
          </div>
        </div>
      </a>
    );
  }

  render() {
    const { sidebarOpen, intl, account, onClickLogOut, donateUrl, otherAccounts, hasCrypto, features, siteTitle, baseURL } = this.props;
    const { switcher } = this.state;
    if (!account) return null;
    const acct = account.get('acct');

    const classes = classNames('sidebar-menu__root', {
      'sidebar-menu__root--visible': sidebarOpen,
    });

    return (
      <div className={classes}>
        <div className='sidebar-menu__wrapper' role='button' onClick={this.handleClose} />
        <div className='sidebar-menu'>
          <div className='sidebar-menu__content'>

            <div className='sidebar-menu-profile'>
              <IconButton title='close' onClick={this.handleClose} src={require('@tabler/icons/icons/x.svg')} className='sidebar-menu__close' />
              <div className='sidebar-menu-profile__avatar'>
                <Link to={`/@${acct}`} title={acct} onClick={this.handleClose}>
                  <Avatar account={account} />
                </Link>
              </div>
              <a href='#' className='sidebar-menu-profile__name' onClick={this.handleSwitcherClick}>
                <DisplayName account={account} />
                <Icon src={switcher ? require('@tabler/icons/icons/caret-up.svg') : require('@tabler/icons/icons/caret-down.svg')} className='sidebar-menu-profile__caret' />
              </a>
            </div>

            {switcher && <div className='sidebar-menu__section'>
              {otherAccounts.map(account => this.renderAccount(account))}

              <NavLink className='sidebar-menu-item' to='/auth/sign_in' onClick={this.handleClose}>
                <Icon src={require('@tabler/icons/icons/plus.svg')} />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.add_account)}</span>
              </NavLink>
            </div>}

            <div className='sidebar-menu__section'>
              <div className='sidebar-menu-item theme-toggle'>
                <ThemeToggle showLabel />
              </div>
            </div>

            <div className='sidebar-menu__section'>
              {features.federating ? (
                <NavLink to='/timeline/local' className='sidebar-menu-item' onClick={this.handleClose}>
                  <Icon src={require('@tabler/icons/icons/users.svg')} />
                  <span className='sidebar-menu-item__title'>{siteTitle}</span>
                </NavLink>
              ) : (
                <NavLink to='/timeline/local' className='sidebar-menu-item' onClick={this.handleClose}>
                  <Icon src={require('@tabler/icons/icons/world.svg')} />
                  <span className='sidebar-menu-item__title'><FormattedMessage id='tabs_bar.all' defaultMessage='All' /></span>
                </NavLink>
              )}

              {features.federating && <NavLink to='/timeline/fediverse' className='sidebar-menu-item' onClick={this.handleClose}>
                <Icon src={require('icons/fediverse.svg')} />
                <span className='sidebar-menu-item__title'><FormattedMessage id='tabs_bar.fediverse' defaultMessage='Fediverse' /></span>
              </NavLink>}
            </div>

            <div className='sidebar-menu__section'>
              <NavLink className='sidebar-menu-item' to={`/@${acct}`} onClick={this.handleClose}>
                <Icon src={require('@tabler/icons/icons/user.svg')} />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.profile)}</span>
              </NavLink>
              {donateUrl && <a className='sidebar-menu-item' href={donateUrl} onClick={this.handleClose}>
                <Icon src={require('@tabler/icons/icons/coin.svg')} />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.donate)}</span>
              </a>}
              {hasCrypto && <NavLink className='sidebar-menu-item' to='/donate/crypto' onClick={this.handleClose}>
                <Icon src={require('@tabler/icons/icons/currency-bitcoin.svg')} />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.donate_crypto)}</span>
              </NavLink>}
              {features.lists && <NavLink className='sidebar-menu-item' to='/lists' onClick={this.handleClose}>
                <Icon src={require('@tabler/icons/icons/list.svg')} />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.lists)}</span>
              </NavLink>}
              {features.bookmarks && <NavLink className='sidebar-menu-item' to='/bookmarks' onClick={this.handleClose}>
                <Icon src={require('@tabler/icons/icons/bookmarks.svg')} />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.bookmarks)}</span>
              </NavLink>}
            </div>

            <div className='sidebar-menu__section'>
              <NavLink className='sidebar-menu-item' to='/follow_requests' onClick={this.handleClose}>
                <Icon src={require('@tabler/icons/icons/user-plus.svg')} />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.follow_requests)}</span>
              </NavLink>
              <NavLink className='sidebar-menu-item' to='/blocks' onClick={this.handleClose}>
                <Icon src={require('@tabler/icons/icons/ban.svg')} />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.blocks)}</span>
              </NavLink>
              {features.federating && <NavLink className='sidebar-menu-item' to='/domain_blocks' onClick={this.handleClose}>
                <Icon src={require('@tabler/icons/icons/ban.svg')} />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.domain_blocks)}</span>
              </NavLink>}
              <NavLink className='sidebar-menu-item' to='/mutes' onClick={this.handleClose}>
                <Icon src={require('@tabler/icons/icons/circle-x.svg')} />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.mutes)}</span>
              </NavLink>
              <NavLink className='sidebar-menu-item' to='/filters' onClick={this.handleClose}>
                <Icon src={require('@tabler/icons/icons/filter.svg')} />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.filters)}</span>
              </NavLink>
              {isAdmin(account) && <a className='sidebar-menu-item' href='/pleroma/admin' target='_blank' onClick={this.handleClose}>
                <Icon src={require('@tabler/icons/icons/shield.svg')} />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.admin_settings)}</span>
              </a>}
              {isAdmin(account) && <NavLink className='sidebar-menu-item' to='/soapbox/config' onClick={this.handleClose}>
                <Icon src={require('@tabler/icons/icons/settings.svg')} />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.soapbox_config)}</span>
              </NavLink>}
              {features.settingsStore ? (
                <NavLink className='sidebar-menu-item' to='/settings/preferences' onClick={this.handleClose}>
                  <Icon src={require('@tabler/icons/icons/settings.svg')} />
                  <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.preferences)}</span>
                </NavLink>
              ) : (
                <a className='sidebar-menu-item' href={`${baseURL}/settings/preferences`} onClick={this.handleClose}>
                  <Icon src={require('@tabler/icons/icons/settings.svg')} />
                  <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.preferences)}</span>
                </a>
              )}
              <NavLink className='sidebar-menu-item' to='/settings/import' onClick={this.handleClose}>
                <Icon src={require('@tabler/icons/icons/cloud-upload.svg')} />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.import_data)}</span>
              </NavLink>
              {(features.federating && features.accountAliasesAPI) && <NavLink className='sidebar-menu-item' to='/settings/aliases' onClick={this.handleClose}>
                <Icon src={require('@tabler/icons/icons/briefcase.svg')} />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.account_aliases)}</span>
              </NavLink>}
              {features.securityAPI ? (
                <NavLink className='sidebar-menu-item' to='/auth/edit' onClick={this.handleClose}>
                  <Icon src={require('@tabler/icons/icons/shield-lock.svg')} />
                  <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.security)}</span>
                </NavLink>
              ) : (
                <a className='sidebar-menu-item' href={`${baseURL}/auth/edit`} onClick={this.handleClose}>
                  <Icon src={require('@tabler/icons/icons/shield-lock.svg')} />
                  <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.security)}</span>
                </a>
              )}
            </div>

            <div className='sidebar-menu__section'>
              <Link className='sidebar-menu-item' to='/info' onClick={this.handleClose}>
                <Icon src={require('@tabler/icons/icons/info-circle.svg')} />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.info)}</span>
              </Link>
            </div>

            <div className='sidebar-menu__section'>
              <Link className='sidebar-menu-item' to='/auth/sign_out' onClick={onClickLogOut}>
                <Icon src={require('@tabler/icons/icons/logout.svg')} />
                <span className='sidebar-menu-item__title'>{intl.formatMessage(messages.logout)}</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }

}

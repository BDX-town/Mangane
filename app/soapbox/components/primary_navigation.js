'use strict';

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage } from 'react-intl';
import { NavLink, withRouter } from 'react-router-dom';
import Icon from 'soapbox/components/icon';
import IconWithCounter from 'soapbox/components/icon_with_counter';
import classNames from 'classnames';
import { getFeatures } from 'soapbox/utils/features';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { isStaff } from 'soapbox/utils/accounts';

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
    instance,
  };
};

export default @withRouter @connect(mapStateToProps)
class PrimaryNavigation extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    logo: PropTypes.string,
    account: ImmutablePropTypes.map,
    dashboardCount: PropTypes.number,
    notificationCount: PropTypes.number,
    chatsCount: PropTypes.number,
    features: PropTypes.object.isRequired,
    location: PropTypes.object,
    instance: ImmutablePropTypes.map.isRequired,
  };

  render() {
    const { account, features, notificationCount, chatsCount, dashboardCount, location, instance } = this.props;

    return (
      <div className='column-header__wrapper primary-navigation__wrapper'>
        <h1 className='column-header primary-navigation'>
          <NavLink to='/' exact className='btn grouped'>
            <Icon
              src={require('icons/home-square.svg')}
              className={classNames('primary-navigation__icon', 'svg-icon--home', { 'svg-icon--active': location.pathname === '/' })}
            />
            <FormattedMessage id='tabs_bar.home' defaultMessage='Home' />
          </NavLink>

          {account && (
            <NavLink key='notifications' className='btn grouped' to='/notifications' data-preview-title-id='column.notifications'>
              <IconWithCounter
                src={require('@tabler/icons/icons/bell.svg')}
                className={classNames('primary-navigation__icon', {
                  'svg-icon--active': location.pathname === '/notifications',
                  'svg-icon--unread': notificationCount > 0,
                })}
                count={notificationCount}
              />
              <FormattedMessage id='tabs_bar.notifications' defaultMessage='Notifications' />
            </NavLink>
          )}

          <NavLink key='search' className='btn grouped' to='/search'>
            <Icon
              src={require('@tabler/icons/icons/search.svg')}
              className={classNames('primary-navigation__icon', { 'svg-icon--active': location.pathname === '/search' })}
            />
            <FormattedMessage id='navigation.search' defaultMessage='Search' />
          </NavLink>

          {account && (
            features.chats ? (
              <NavLink key='chats' className='btn grouped' to='/chats' data-preview-title-id='column.chats'>
                <IconWithCounter
                  src={require('@tabler/icons/icons/messages.svg')}
                  className={classNames('primary-navigation__icon', { 'svg-icon--active': location.pathname === '/chats' })}
                  count={chatsCount}
                />
                <FormattedMessage id='tabs_bar.chats' defaultMessage='Chats' />
              </NavLink>
            ) : (
              <NavLink to='/messages' className='btn grouped'>
                <Icon
                  src={require('@tabler/icons/icons/mail.svg')}
                  className={classNames('primary-navigation__icon', { 'svg-icon--active': ['/messages', '/conversations'].includes(location.pathname) })}
                />
                <FormattedMessage id='navigation.direct_messages' defaultMessage='Messages' />
              </NavLink>
            )
          )}

          {(account && isStaff(account)) && (
            <NavLink key='dashboard' className='btn grouped' to='/admin' data-preview-title-id='tabs_bar.dashboard'>
              <IconWithCounter
                src={location.pathname.startsWith('/admin') ? require('icons/dashboard-filled.svg') : require('@tabler/icons/icons/dashboard.svg')}
                className='primary-navigation__icon'
                count={dashboardCount}
              />
              <FormattedMessage id='tabs_bar.dashboard' defaultMessage='Dashboard' />
            </NavLink>
          )}

          {(account && instance.get('invites_enabled')) && (
            <a href='/invites' className='btn grouped'>
              <Icon src={require('@tabler/icons/icons/mailbox.svg')} className='primary-navigation__icon' />
              <FormattedMessage id='navigation.invites' defaultMessage='Invites' />
            </a>
          )}

          <hr />

          {features.federating ? (
            <NavLink to='/timeline/local' className='btn grouped'>
              <Icon
                src={require('@tabler/icons/icons/users.svg')}
                className={classNames('primary-navigation__icon', { 'svg-icon--active': location.pathname === '/timeline/local' })}
              />
              {instance.get('title')}
            </NavLink>
          ) : (
            <NavLink to='/timeline/local' className='btn grouped'>
              <Icon src={require('@tabler/icons/icons/world.svg')} className='primary-navigation__icon' />
              <FormattedMessage id='tabs_bar.all' defaultMessage='All' />
            </NavLink>
          )}

          {features.federating && (
            <NavLink to='/timeline/fediverse' className='btn grouped'>
              <Icon src={require('icons/fediverse.svg')} className='column-header__icon' />
              <FormattedMessage id='tabs_bar.fediverse' defaultMessage='Fediverse' />
            </NavLink>
          )}
        </h1>
      </div>
    );
  }

}

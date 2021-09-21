'use strict';

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage } from 'react-intl';
import { NavLink, withRouter } from 'react-router-dom';
import Icon from 'soapbox/components/icon';
import IconWithCounter from 'soapbox/components/icon_with_counter';
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
    siteTitle: state.getIn(['instance', 'title']),
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
    siteTitle: PropTypes.string,
  };

  render() {
    const { account, features, notificationCount, chatsCount, dashboardCount, siteTitle } = this.props;

    return (
      <div className='column-header__wrapper primary-navigation__wrapper'>
        <h1 className='column-header primary-navigation'>
          <NavLink to='/' exact className='btn grouped'>
            <Icon src={require('@tabler/icons/icons/home-2.svg')} className='primary-navigation__icon' />
            <FormattedMessage id='tabs_bar.home' defaultMessage='Home' />
          </NavLink>

          {account && <NavLink key='notifications' className='btn grouped' to='/notifications' data-preview-title-id='column.notifications'>
            <IconWithCounter
              src={notificationCount > 0 ? require('@tabler/icons/icons/bell-ringing-2.svg') : require('@tabler/icons/icons/bell.svg')}
              className='primary-navigation__icon'
              count={notificationCount}
            />
            <FormattedMessage id='tabs_bar.notifications' defaultMessage='Notifications' />
          </NavLink>}

          {(features.chats && account) && <NavLink key='chats' className='btn grouped' to='/chats' data-preview-title-id='column.chats'>
            <IconWithCounter
              src={require('@tabler/icons/icons/messages.svg')}
              className='primary-navigation__icon'
              count={chatsCount}
            />
            <FormattedMessage id='tabs_bar.chats' defaultMessage='Chats' />
          </NavLink>}

          {(account && isStaff(account)) && <NavLink key='dashboard' className='btn grouped' to='/admin' data-preview-title-id='tabs_bar.dashboard'>
            <IconWithCounter
              src={require('@tabler/icons/icons/dashboard.svg')}
              className='primary-navigation__icon'
              count={dashboardCount}
            />
            <FormattedMessage id='tabs_bar.dashboard' defaultMessage='Dashboard' />
          </NavLink>}

          <hr />

          {features.federating ? (
            <NavLink to='/timeline/local' className='btn grouped'>
              <Icon src={require('@tabler/icons/icons/users.svg')} className='primary-navigation__icon' />
              {siteTitle}
            </NavLink>
          ) : (
            <NavLink to='/timeline/local' className='btn grouped'>
              <Icon src={require('@tabler/icons/icons/world.svg')} className='primary-navigation__icon' />
              <FormattedMessage id='tabs_bar.all' defaultMessage='All' />
            </NavLink>
          )}

          {features.federating && <NavLink to='/timeline/fediverse' className='btn grouped'>
            <Icon src={require('icons/fediverse.svg')} className='column-header__icon' />
            <FormattedMessage id='tabs_bar.fediverse' defaultMessage='Fediverse' />
          </NavLink>}
        </h1>
      </div>
    );
  }

}

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
  const features = getFeatures(instance);

  return {
    account: state.getIn(['accounts', me]),
    logo: getSoapboxConfig(state).get('logo'),
    notificationCount: state.getIn(['notifications', 'unread']),
    chatsCount: state.get('chats').reduce((acc, curr) => acc + Math.min(curr.get('unread', 0), 1), 0),
    dashboardCount: reportsCount + approvalCount,
    features: getFeatures(instance),
    siteTitle: state.getIn(['instance', 'title']),
    federating: features.federating,
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
    federating: PropTypes.bool,
  };

  render() {
    const { account, features, notificationCount, chatsCount, dashboardCount } = this.props;

    return (
      <div className='column-header__wrapper primary-navigation__wrapper'>
        <h1 className='column-header primary-navigation'>
          <NavLink to='/' exact className='btn grouped'>
            <Icon id='home' className='primary-navigation__icon' />
            <FormattedMessage id='tabs_bar.home' defaultMessage='Home' />
          </NavLink>

          {account && <NavLink key='notifications' className='btn grouped' to='/notifications' data-preview-title-id='column.notifications'>
            <IconWithCounter icon='bell' count={notificationCount} />
            <FormattedMessage id='tabs_bar.notifications' defaultMessage='Notifications' />
          </NavLink>}

          {(features.chats && account) && <NavLink key='chats' className='btn grouped' to='/chats' data-preview-title-id='column.chats'>
            <IconWithCounter icon='comment' count={chatsCount} />
            <FormattedMessage id='tabs_bar.chats' defaultMessage='Chats' />
          </NavLink>}

          {(account && isStaff(account)) && <NavLink key='dashboard' className='btn grouped' to='/admin' data-preview-title-id='tabs_bar.dashboard'>
            <IconWithCounter icon='tachometer' count={dashboardCount} />
            <FormattedMessage id='tabs_bar.dashboard' defaultMessage='Dashboard' />
          </NavLink>}

          {/* <NavLink to='/timeline/local' className='btn grouped'>
            <Icon id={federating ? 'users' : 'globe-w'} fixedWidth className='column-header__icon' />
            {federating ? siteTitle : <FormattedMessage id='tabs_bar.all' defaultMessage='All' />}
          </NavLink> */}

          {/* federating && <NavLink to='/timeline/fediverse' className='btn grouped'>
            <Icon id='fediverse' fixedWidth className='column-header__icon' />
            <FormattedMessage id='tabs_bar.fediverse' defaultMessage='Fediverse' />
          </NavLink> */}
        </h1>
      </div>
    );
  }

}

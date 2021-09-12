import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { NavLink, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Icon from 'soapbox/components/icon';
import IconWithCounter from 'soapbox/components/icon_with_counter';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { isStaff } from 'soapbox/utils/accounts';
import { getFeatures } from 'soapbox/utils/features';

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

export default @withRouter
@connect(mapStateToProps)
class ThumbNavigation extends React.PureComponent {

  static propTypes = {
    logo: PropTypes.string,
    account: ImmutablePropTypes.map,
    dashboardCount: PropTypes.number,
    notificationCount: PropTypes.number,
    chatsCount: PropTypes.number,
    features: PropTypes.object.isRequired,
  }

  render() {
    const { account, dashboardCount, features } = this.props;

    return (
      <div className='thumb-navigation'>
        <NavLink to='/' exact className='thumb-navigation__link'>
          <Icon id='home' />
          <span>
            <FormattedMessage id='navigation.home' defaultMessage='Home' />
          </span>
        </NavLink>

        {account && (
          <NavLink to='/notifications' className='thumb-navigation__link'>
            <Icon id='bell' />
            <span>
              <FormattedMessage id='navigation.notifications' defaultMessage='Notifications' />
            </span>
          </NavLink>
        )}

        {(features.chats && account) && (
          <NavLink to='/chats' className='thumb-navigation__link'>
            <Icon id='comment' />
            <span>
              <FormattedMessage id='navigation.chats' defaultMessage='Chats' />
            </span>
          </NavLink>
        )}

        <NavLink to='/search' className='thumb-navigation__link'>
          <Icon id='search' />
          <span>
            <FormattedMessage id='navigation.search' defaultMessage='Search' />
          </span>
        </NavLink>

        {(account && isStaff(account)) && (
          <NavLink key='dashboard' to='/admin' className='thumb-navigation__link'>
            <IconWithCounter icon='tachometer' count={dashboardCount} />
            <span>
              <FormattedMessage id='tabs_bar.dashboard' defaultMessage='Dashboard' />
            </span>
          </NavLink>
        )}
      </div>
    );
  }

}

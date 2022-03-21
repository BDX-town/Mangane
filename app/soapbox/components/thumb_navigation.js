import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';

import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import IconWithCounter from 'soapbox/components/icon_with_counter';
import { Icon, Text } from 'soapbox/components/ui';
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
    chatsCount: state.getIn(['chats', 'items']).reduce((acc, curr) => acc + Math.min(curr.get('unread', 0), 1), 0),
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
    location: PropTypes.object,
  }

  render() {
    const { account, notificationCount, chatsCount, location, features } = this.props;

    return (
      <div className='thumb-navigation'>
        <NavLink to='/' exact className='thumb-navigation__link'>
          <Icon
            src={require('icons/feed.svg')}
            className={classNames({
              'h-5 w-5': true,
              'text-gray-600': location.pathname !== '/',
              'text-primary-600': location.pathname === '/',
            })}
          />

          <Text tag='span' size='xs'>
            <FormattedMessage id='navigation.home' defaultMessage='Home' />
          </Text>
        </NavLink>

        <NavLink to='/search' className='thumb-navigation__link'>
          <Icon
            src={require('@tabler/icons/icons/search.svg')}
            className={classNames({
              'h-5 w-5': true,
              'text-gray-600': location.pathname !== '/search',
              'text-primary-600': location.pathname === '/search',
            })}
          />

          <Text tag='span' size='xs'>
            <FormattedMessage id='navigation.search' defaultMessage='Search' />
          </Text>
        </NavLink>

        {account && (
          <NavLink to='/notifications' className='thumb-navigation__link'>
            <Icon
              src={require('@tabler/icons/icons/bell.svg')}
              className={classNames({
                'h-5 w-5': true,
                'text-gray-600': location.pathname !== '/notifications',
                'text-primary-600': location.pathname === '/notifications',
              })}
              count={notificationCount}
            />

            <Text tag='span' size='xs'>
              <FormattedMessage id='navigation.notifications' defaultMessage='Alerts' />
            </Text>
          </NavLink>
        )}

        {account && (
          features.chats ? (
            <NavLink to='/chats' className='thumb-navigation__link'>
              <IconWithCounter
                src={require('@tabler/icons/icons/messages.svg')}
                className={classNames({ 'svg-icon--active': location.pathname === '/chats' })}
                count={chatsCount}
              />
              <span>
                <FormattedMessage id='navigation.chats' defaultMessage='Chats' />
              </span>
            </NavLink>
          ) : (
            <NavLink to='/messages' className='thumb-navigation__link'>
              <Icon
                src={require('@tabler/icons/icons/mail.svg')}
                className={classNames({
                  'h-5 w-5': true,
                  'text-gray-600': !['/messages', '/conversations'].includes(location.pathname),
                  'text-primary-600': ['/messages', '/conversations'].includes(location.pathname),
                })}
              />

              <Text tag='span' size='xs'>
                <FormattedMessage id='navigation.direct_messages' defaultMessage='Messages' />
              </Text>
            </NavLink>
          )
        )}

        {/* (account && isStaff(account)) && (
          <NavLink to='/admin' className='thumb-navigation__link'>
            <Icon
              src={require('@tabler/icons/icons/dashboard.svg')}
              className={classNames({
                'h-5 w-5': true,
                'text-gray-600': !location.pathname.startsWith('/admin'),
                'text-primary-600': location.pathname.startsWith('/admin'),
              })}
              count={dashboardCount}
            />

            <Text tag='span' size='xs'>
              <FormattedMessage id='navigation.dashboard' defaultMessage='Dashboard' />
            </Text>
          </NavLink>
        ) */}
      </div>
    );
  }

}

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';

import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import Icon from 'soapbox/components/icon';
import IconWithCounter from 'soapbox/components/icon_with_counter';
import { getFeatures } from 'soapbox/utils/features';

const mapStateToProps = state => {
  const me = state.get('me');
  const reportsCount = state.getIn(['admin', 'openReports']).count();
  const approvalCount = state.getIn(['admin', 'awaitingApproval']).count();
  const instance = state.get('instance');

  return {
    instance,
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
    instance: PropTypes.object.isRequired,
  }

  render() {
    const { account, notificationCount, chatsCount, location, features, instance } = this.props;

    return (
      <div className='thumb-navigation'>
        <NavLink to='/' exact className='thumb-navigation__link'>
          <Icon
            src={require('icons/home-square.svg')}
            className={classNames('svg-icon--home', { 'svg-icon--active': location.pathname === '/' })}
          />
          <span>
            <FormattedMessage id='navigation.home' defaultMessage='Home' />
          </span>
        </NavLink>

        {features.federating ? (
          <NavLink to='/timeline/local' className='thumb-navigation__link'>
            <Icon
              src={require('@tabler/icons/icons/users.svg')}
              className={classNames({ 'svg-icon--active': location.pathname === '/timeline/local' })}
            />
            <span>
              {instance.get('title')}
            </span>
          </NavLink>
        ) : (
          <NavLink to='/timeline/local' className='thumb-navigation__link'>
            <Icon src={require('@tabler/icons/icons/world.svg')} />
            <span>
              <FormattedMessage id='tabs_bar.all' defaultMessage='All' />
            </span>
          </NavLink>
        )}

        {features.federating && (
          <NavLink to='/timeline/fediverse' className='thumb-navigation__link'>
            <Icon
              src={require('icons/fediverse.svg')}
              className={classNames('svg-icon--fediverse', { 'svg-icon--active': location.pathname === '/timeline/fediverse' })}
            />
            <span>
              <FormattedMessage id='tabs_bar.fediverse' defaultMessage='Fediverse' />
            </span>
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
                className={classNames({ 'svg-icon--active': ['/messages', '/conversations'].includes(location.pathname) })}
              />
              <span>
                <FormattedMessage id='navigation.direct_messages' defaultMessage='Messages' />
              </span>
            </NavLink>
          )
        )}


        {account && (
          <NavLink to='/notifications' className='thumb-navigation__link'>
            <IconWithCounter
              src={require('@tabler/icons/icons/bell.svg')}
              className={classNames({
                'svg-icon--active': location.pathname === '/notifications',
                'svg-icon--unread': notificationCount > 0,
              })}
              count={notificationCount}
            />
            <span>
              <FormattedMessage id='navigation.notifications' defaultMessage='Notifications' />
            </span>
          </NavLink>
        )}

      </div>
    );
  }

}

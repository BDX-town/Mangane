import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Icon from 'soapbox/components/icon';

export default
@withRouter
class ThumbNavigation extends React.PureComponent {

  render() {
    return (
      <div className='thumb-navigation'>
        <NavLink to='/' exact className='thumb-navigation__link'>
          <Icon id='home' />
          <span>
            <FormattedMessage id='navigation.home' defaultMessage='Home' />
          </span>
        </NavLink>

        <NavLink to='/search' className='thumb-navigation__link'>
          <Icon id='search' />
          <span>
            <FormattedMessage id='navigation.search' defaultMessage='Search' />
          </span>
        </NavLink>

        <NavLink to='/notifications' className='thumb-navigation__link'>
          <Icon id='bell' />
          <span>
            <FormattedMessage id='navigation.notifications' defaultMessage='Notifications' />
          </span>
        </NavLink>

        <NavLink to='/chats' className='thumb-navigation__link'>
          <Icon id='comment' />
          <span>
            <FormattedMessage id='navigation.chats' defaultMessage='Chats' />
          </span>
        </NavLink>
      </div>
    );
  }

}

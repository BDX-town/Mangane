import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'soapbox/components/icon';
import { NavLink } from 'react-router-dom';
import { injectIntl, defineMessages } from 'react-intl';

const messages = defineMessages({
  manage_followers: { id: 'account.manage_followers', defaultMessage: 'Manage Followers' },
  follow_requests: { id: 'account.follow_requests', defaultMessage: 'Follow Requests' },
  manage_follows: { id: 'account.manage_follows', defaultMessage: 'Manage Follows' },
});

export default
@injectIntl
class ManageFollowersMenu extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  };

  render() {
    const { intl } = this.props;

    return (
      <div className='wtf-panel promo-panel'>
        <div className='promo-panel__container'>

          <div className='promo-panel-item'>
            <NavLink className='promo-panel-item__btn' to='/manage_followers'>
              <Icon id='users' className='promo-panel-item__icon' fixedWidth />
              {intl.formatMessage(messages.manage_followers)}
            </NavLink>
          </div>

          <div className='promo-panel-item'>
            <NavLink className='promo-panel-item__btn' to='/follow_requests'>
              <Icon id='user-plus' className='promo-panel-item__icon' fixedWidth />
              {intl.formatMessage(messages.follow_requests)}
            </NavLink>
          </div>

          <div className='promo-panel-item'>
            <NavLink className='promo-panel-item__btn' to='/manage_follows'>
              <Icon id='user-times' className='promo-panel-item__icon' fixedWidth />
              {intl.formatMessage(messages.manage_follows)}
            </NavLink>
          </div>

        </div>
      </div>
    );
  }

}

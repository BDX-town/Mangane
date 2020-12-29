import React from 'react';
import Icon from 'soapbox/components/icon';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

export default
class AdminNav extends React.PureComponent {

  render() {
    return (
      <div className='wtf-panel promo-panel'>
        <div className='promo-panel__container'>
          <NavLink className='promo-panel-item' to='/admin'>
            <Icon id='tachometer' className='promo-panel-item__icon' fixedWidth />
            <FormattedMessage id='admin_nav.dashboard' defaultMessage='Dashboard' />
          </NavLink>
        </div>
      </div>
    );
  }

}

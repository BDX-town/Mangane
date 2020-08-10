import React from 'react';
import Icon from 'soapbox/components/icon';
import { NavLink } from 'react-router-dom';

export default class FeaturesPanel extends React.PureComponent {

  render() {
    return (
      <div className='wtf-panel promo-panel'>
        <div className='promo-panel__container'>

          <div className='promo-panel-item'>
            <NavLink className='promo-panel-item__btn' to='/settings/profile'>
              <Icon id='user' className='promo-panel-item__icon' fixedWidth />
              Edit Profile
            </NavLink>
          </div>

          <div className='promo-panel-item'>
            <NavLink className='promo-panel-item__btn' to='/messages'>
              <Icon id='envelope' className='promo-panel-item__icon' fixedWidth />
              Messages
            </NavLink>
          </div>

          <div className='promo-panel-item'>
            <NavLink className='promo-panel-item__btn' to='/bookmarks'>
              <Icon id='bookmark' className='promo-panel-item__icon' fixedWidth />
              Bookmarks
            </NavLink>
          </div>

          <div className='promo-panel-item'>
            <NavLink className='promo-panel-item__btn' to='/lists'>
              <Icon id='list' className='promo-panel-item__icon' fixedWidth />
              Lists
            </NavLink>
          </div>

          <div className='promo-panel-item'>
            <NavLink className='promo-panel-item__btn' to='/auth/edit'>
              <Icon id='lock' className='promo-panel-item__icon' fixedWidth />
              Security
            </NavLink>
          </div>

          <div className='promo-panel-item'>
            <NavLink className='promo-panel-item__btn' to='/settings/preferences'>
              <Icon id='cog' className='promo-panel-item__icon' fixedWidth />
              Preferences
            </NavLink>
          </div>

        </div>
      </div>
    );
  }

}

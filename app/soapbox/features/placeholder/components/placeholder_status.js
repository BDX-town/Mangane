import React from 'react';
import PlaceholderAvatar from './placeholder_avatar';
import PlaceholderDisplayName from './placeholder_display_name';
import PlaceholderStatusContent from './placeholder_status_content';

export default class PlaceholderStatus extends React.Component {

  shouldComponentUpdate() {
    // Re-rendering this will just cause the random lengths to jump around.
    // There's basically no reason to ever do it.
    return false;
  }

  render() {
    return (
      <div className='placeholder-status'>
        <div className='status__wrapper'>
          <div className='status'>
            <div className='status__info'>
              <div className='status__profile'>
                <div className='status__avatar'>
                  <PlaceholderAvatar size={48} />
                </div>
                <span className='status__display-name'>
                  <PlaceholderDisplayName minLength={3} maxLength={25} />
                </span>
              </div>
            </div>

            <PlaceholderStatusContent minLength={5} maxLength={120} />

            {/* TODO */}
            {/* <PlaceholderActionBar /> */}
          </div>
        </div>
      </div>
    );
  }

}

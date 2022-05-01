import React from 'react';

import PlaceholderAvatar from './placeholder_avatar';
import PlaceholderDisplayName from './placeholder_display_name';

/** Fake account to display while data is loading. */
const PlaceholderAccount: React.FC = () => {
  return (
    <div className='account'>
      <div className='account__wrapper'>
        <span className='account__display-name'>
          <div className='account__avatar-wrapper'>
            <PlaceholderAvatar size={36} />
          </div>
          <PlaceholderDisplayName minLength={3} maxLength={25} />
        </span>
      </div>
    </div>
  );
};

export default PlaceholderAccount;

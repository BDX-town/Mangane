import React from 'react';

import { randomIntFromInterval, generateText } from '../utils';

import PlaceholderAvatar from './placeholder_avatar';
import PlaceholderDisplayName from './placeholder_display_name';

/** Fake chat to display while data is loading. */
const PlaceholderChat: React.FC = () => {
  const messageLength = randomIntFromInterval(5, 75);

  return (
    <div className='chat-list-item chat-list-item--placeholder'>
      <div className='account'>
        <div className='account__wrapper'>
          <div className='account__display-name'>
            <div className='account__avatar-wrapper'>
              <PlaceholderAvatar size={36} />
            </div>
            <PlaceholderDisplayName minLength={3} maxLength={25} />
            <span className='chat__last-message'>
              {generateText(messageLength)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderChat;

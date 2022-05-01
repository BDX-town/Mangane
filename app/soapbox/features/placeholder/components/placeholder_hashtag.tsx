import React from 'react';

import { generateText, randomIntFromInterval } from '../utils';

/** Fake hashtag to display while data is loading. */
const PlaceholderHashtag: React.FC = () => {
  const length = randomIntFromInterval(15, 30);

  return (
    <div className='placeholder-hashtag'>
      <div className='trends__item'>
        <div className='trends__item__name'>
          {generateText(length)}
        </div>
      </div>
    </div>
  );
};

export default PlaceholderHashtag;

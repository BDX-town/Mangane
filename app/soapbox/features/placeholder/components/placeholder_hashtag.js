import React from 'react';

import { generateText, randomIntFromInterval } from '../utils';

export default class PlaceholderHashtag extends React.Component {

  render() {
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
  }

}
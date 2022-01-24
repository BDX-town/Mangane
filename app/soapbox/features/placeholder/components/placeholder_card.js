import React from 'react';

import { randomIntFromInterval, generateText } from '../utils';

export default class PlaceholderCard extends React.Component {

  shouldComponentUpdate() {
    // Re-rendering this will just cause the random lengths to jump around.
    // There's basically no reason to ever do it.
    return false;
  }

  render() {
    return (
      <div className='status-card status-card--link status-card--placeholder'>
        <div className='status-card__image' />
        <div className='status-card__content'>
          <span className='status-card__title'>{generateText(randomIntFromInterval(5, 25))}</span>
          <p className='status-card__description'>
            {generateText(randomIntFromInterval(5, 75))}
          </p>
          <span className='status-card__host'>
            {generateText(randomIntFromInterval(5, 15))}
          </span>
        </div>
      </div>
    );
  }

}

import React from 'react';
import PlaceholderAccount from './placeholder_account';
import { randomIntFromInterval, generateText } from '../utils';

export default class PlaceholderNotification extends React.Component {

  shouldComponentUpdate() {
    // Re-rendering this will just cause the random lengths to jump around.
    // There's basically no reason to ever do it.
    return false;
  }

  render() {
    return (
      <div className='notification notification-follow notification--placeholder' tabIndex='0'>
        <div className='notification__message'>
          <span>
            {generateText(randomIntFromInterval(15, 30))}
          </span>
        </div>

        <PlaceholderAccount />
      </div>
    );
  }

}

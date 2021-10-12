import React from 'react';
import PropTypes from 'prop-types';
import { randomIntFromInterval, generateText } from '../utils';

export default class DisplayName extends React.Component {

  static propTypes = {
    maxLength: PropTypes.number.isRequired,
    minLength: PropTypes.number.isRequired,
  }

  render() {
    const { maxLength, minLength } = this.props;
    const length = randomIntFromInterval(maxLength, minLength);
    const acctLength = randomIntFromInterval(maxLength, minLength);

    return (
      <span className='display-name display-name--placeholder'>
        <span>
          <span className='display-name__name'>
            <bdi><strong className='display-name__html'>{generateText(length)}</strong></bdi>
          </span>
        </span>
        <span class='display-name__account'>{generateText(acctLength)}</span>
      </span>
    );
  }

}

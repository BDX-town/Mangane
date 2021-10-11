import React from 'react';
import PropTypes from 'prop-types';
import { randomIntFromInterval, generateText } from '../utils';

export default class PlaceholderStatusContent extends React.Component {

  static propTypes = {
    maxLength: PropTypes.number.isRequired,
    minLength: PropTypes.number.isRequired,
  }

  render() {
    const { maxLength, minLength } = this.props;
    const length = randomIntFromInterval(maxLength, minLength);

    return(
      <div className='status__content' tabIndex='0' key='content'>
        {generateText(length)}
      </div>
    );
  }

}

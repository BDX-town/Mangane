import PropTypes from 'prop-types';
import React from 'react';

import { randomIntFromInterval, generateText } from '../utils';

const PlaceholderStatusContent = ({ minLength, maxLength }) => {
  const length = randomIntFromInterval(maxLength, minLength);

  return (
    <div className='flex flex-col text-slate-200'>
      <p className='break-words'>{generateText(length)}</p>
    </div>
  );
};

PlaceholderStatusContent.propTypes = {
  maxLength: PropTypes.number.isRequired,
  minLength: PropTypes.number.isRequired,
};

export default PlaceholderStatusContent;

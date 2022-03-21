import PropTypes from 'prop-types';
import React from 'react';

import { randomIntFromInterval, generateText } from '../utils';

const PlaceholderDisplayName = ({ minLength, maxLength }) => {
  const length = randomIntFromInterval(maxLength, minLength);
  const acctLength = randomIntFromInterval(maxLength, minLength);

  return (
    <div className='flex flex-col text-slate-200'>
      <p>{generateText(length)}</p>
      <p>{generateText(acctLength)}</p>
    </div>
  );
};

PlaceholderDisplayName.propTypes = {
  maxLength: PropTypes.number.isRequired,
  minLength: PropTypes.number.isRequired,
};

export default PlaceholderDisplayName;

import React from 'react';

import { randomIntFromInterval, generateText } from '../utils';

interface IPlaceholderDisplayName {
  maxLength: number,
  minLength: number,
}

/** Fake display name to show when data is loading. */
const PlaceholderDisplayName: React.FC<IPlaceholderDisplayName> = ({ minLength, maxLength }) => {
  const length = randomIntFromInterval(maxLength, minLength);
  const acctLength = randomIntFromInterval(maxLength, minLength);

  return (
    <div className='flex flex-col text-primary-50 dark:text-primary-800'>
      <p>{generateText(length)}</p>
      <p>{generateText(acctLength)}</p>
    </div>
  );
};

export default PlaceholderDisplayName;

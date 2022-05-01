import React from 'react';

import { randomIntFromInterval, generateText } from '../utils';

interface IPlaceholderStatusContent {
  maxLength: number,
  minLength: number,
}

/** Fake status content while data is loading. */
const PlaceholderStatusContent: React.FC<IPlaceholderStatusContent> = ({ minLength, maxLength }) => {
  const length = randomIntFromInterval(maxLength, minLength);

  return (
    <div className='flex flex-col text-slate-200 dark:text-slate-700'>
      <p className='break-words'>{generateText(length)}</p>
    </div>
  );
};

export default PlaceholderStatusContent;

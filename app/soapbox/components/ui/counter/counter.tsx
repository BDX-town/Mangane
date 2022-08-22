import React from 'react';

import { shortNumberFormat } from 'soapbox/utils/numbers';

interface ICounter {
  /** Number this counter should display. */
  count: number,
}

/** A simple counter for notifications, etc. */
const Counter: React.FC<ICounter> = ({ count }) => {
  return (
    <span className='block px-1.5 py-0.5 bg-accent-500 text-xs text-white rounded-full ring-2 ring-white dark:ring-slate-800'>
      {shortNumberFormat(count)}
    </span>
  );
};

export default Counter;

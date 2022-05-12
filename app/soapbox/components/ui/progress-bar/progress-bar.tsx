import React from 'react';

interface IProgressBar {
  progress: number,
}

/** A horizontal meter filled to the given percentage. */
const ProgressBar: React.FC<IProgressBar> = ({ progress }) => (
  <div className='h-2.5 w-full rounded-full bg-gray-100 dark:bg-slate-900/50 overflow-hidden'>
    <div className='h-full bg-accent-500' style={{ width: `${Math.floor(progress * 100)}%` }} />
  </div>
);

export default ProgressBar;

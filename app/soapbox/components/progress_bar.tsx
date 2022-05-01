import React from 'react';

interface IProgressBar {
  progress: number,
}

const ProgressBar: React.FC<IProgressBar> = ({ progress }) => (
  <div className='h-2 w-full rounded-md bg-gray-300 dark:bg-slate-700 overflow-hidden'>
    <div className='h-full bg-primary-500' style={{ width: `${Math.floor(progress*100)}%` }} />
  </div>
);

export default ProgressBar;

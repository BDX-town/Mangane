import React from 'react';

interface IProgressBar {
  progress: number,
}

const ProgressBar: React.FC<IProgressBar> = ({ progress }) => (
  <div className='progress-bar'>
    <div className='progress-bar__progress' style={{ width: `${Math.floor(progress*100)}%` }} />
  </div>
)

export default ProgressBar;

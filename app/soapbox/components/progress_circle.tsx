import classNames from 'classnames';
import React from 'react';

interface IProgressCircle {
  progress: number,
  radius?: number,
  stroke?: number,
  title?: string,
}

const ProgressCircle: React.FC<IProgressCircle> = ({ progress, radius = 12, stroke = 4, title }) => {
  const progressStroke = stroke + 0.5;
  const actualRadius = radius + progressStroke;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - Math.min(progress, 1));

  return (
    <div title={title}>
      <svg
        width={actualRadius * 2}
        height={actualRadius * 2}
        viewBox={`0 0 ${actualRadius * 2} ${actualRadius * 2}`}
      >
        <circle
          className='stroke-gray-400'
          cx={actualRadius}
          cy={actualRadius}
          r={radius}
          fill='none'
          strokeWidth={stroke}
        />
        <circle
          className={classNames('stroke-primary-800', {
            'stroke-danger-600': progress > 1,
          })}
          style={{
            strokeDashoffset: dashoffset,
            strokeDasharray: circumference,
          }}
          cx={actualRadius}
          cy={actualRadius}
          r={radius}
          fill='none'
          strokeWidth={progressStroke}
          strokeLinecap='round'
        />
      </svg>
    </div>
  );
};

export default ProgressCircle;

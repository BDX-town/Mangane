import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

export default class ProgressCircle extends React.PureComponent {

  static propTypes = {
    progress: PropTypes.number.isRequired,
    radius: PropTypes.number,
    stroke: PropTypes.number,
    title: PropTypes.string,
  };

  static defaultProps = {
    radius: 12,
    stroke: 4,
  }

  render() {
    const { progress, radius, stroke, title } = this.props;

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
  }

}

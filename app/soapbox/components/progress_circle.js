import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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
      <div className={classNames('progress-circle', { 'progress-circle--over': progress > 1 })} title={title}>
        <svg
          width={actualRadius * 2}
          height={actualRadius * 2}
          viewBox={`0 0 ${actualRadius * 2} ${actualRadius * 2}`}
        >
          <circle
            className='progress-circle__circle'
            cx={actualRadius}
            cy={actualRadius}
            r={radius}
            fill='none'
            strokeWidth={stroke}
          />
          <circle
            className={classNames('progress-circle__progress')}
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

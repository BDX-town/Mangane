import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { shortNumberFormat } from '../utils/numbers';
import classNames from 'classnames';

export default class TimelineQueueButtonHeader extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    count: PropTypes.number,
    itemType: PropTypes.string,
  };

  static defaultProps = {
    count: 0,
    itemType: 'item',
  };

  render () {
    const { count, itemType, onClick } = this.props;

    const classes = classNames('timeline-queue-header', {
      'hidden': (count <= 0)
    });

    return (
      <div className={classes}>
        <a className='timeline-queue-header__btn' onClick={onClick}>
          {(count > 0) && <FormattedMessage
            id='timeline_queue.label'
            defaultMessage='Click to see {count} new {type}'
            values={{
              count: shortNumberFormat(count),
              type: count == 1 ? itemType : `${itemType}s`,
            }}
          />}
        </a>
      </div>
    );
  }
}

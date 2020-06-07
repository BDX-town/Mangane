import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';

export default @injectIntl
class TimelineQueueButtonHeader extends React.PureComponent {

  static propTypes = {
    onClick: PropTypes.func.isRequired,
    count: PropTypes.number,
    message: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  };

  static defaultProps = {
    count: 0,
  };

  render() {
    const { count, message, onClick, intl } = this.props;

    const classes = classNames('timeline-queue-header', {
      'hidden': (count <= 0),
    });

    return (
      <div className={classes}>
        <a className='timeline-queue-header__btn' onClick={onClick}>
          {(count > 0) && intl.formatMessage(message, { count })}
        </a>
      </div>
    );
  }

}

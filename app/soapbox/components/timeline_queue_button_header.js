import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { throttle } from 'lodash';
import classNames from 'classnames';
import Icon from 'soapbox/components/icon';

export default @injectIntl
class TimelineQueueButtonHeader extends React.PureComponent {

  static propTypes = {
    onClick: PropTypes.func.isRequired,
    count: PropTypes.number,
    message: PropTypes.object.isRequired,
    threshold: PropTypes.number,
    intl: PropTypes.object.isRequired,
  };

  static defaultProps = {
    count: 0,
    threshold: 400,
  };

  state = {
    scrolled: false,
  }

  componentDidMount() {
    this.window = window;
    this.documentElement = document.scrollingElement || document.documentElement;

    this.attachScrollListener();
  }

  componentWillUnmount() {
    this.detachScrollListener();
  }

  attachScrollListener() {
    this.window.addEventListener('scroll', this.handleScroll);
  }

  detachScrollListener() {
    this.window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = throttle(() => {
    const { scrollTop } = (document.scrollingElement || document.documentElement);
    const { threshold } = this.props;

    if (scrollTop > threshold) {
      this.setState({ scrolled: true });
    } else {
      this.setState({ scrolled: false });
    }
  }, 150, { trailing: true });

  render() {
    const { count, message, onClick, intl } = this.props;
    const { scrolled } = this.state;

    const visible = count > 0 && scrolled;

    const classes = classNames('timeline-queue-header', {
      'hidden': !visible,
    });

    return (
      <div className={classes}>
        <a className='timeline-queue-header__btn' onClick={onClick}>
          <Icon src={require('@tabler/icons/icons/arrow-bar-to-up.svg')} />
          {(count > 0) && (
            <div className='timeline-queue-header__label'>
              {intl.formatMessage(message, { count })}
            </div>
          )}
        </a>
      </div>
    );
  }

}

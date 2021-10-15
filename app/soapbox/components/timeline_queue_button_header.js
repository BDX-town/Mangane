import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { throttle } from 'lodash';
import classNames from 'classnames';
import Icon from 'soapbox/components/icon';
import { getSettings } from 'soapbox/actions/settings';

const mapStateToProps = state => {
  const settings = getSettings(state);

  return {
    autoload: settings.get('autoloadTimelines'),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class TimelineQueueButtonHeader extends React.PureComponent {

  static propTypes = {
    onClick: PropTypes.func.isRequired,
    count: PropTypes.number,
    message: PropTypes.object.isRequired,
    threshold: PropTypes.number,
    intl: PropTypes.object.isRequired,
    autoload: PropTypes.bool,
    autoloadThreshold: PropTypes.number,
  };

  static defaultProps = {
    count: 0,
    threshold: 400,
    autoload: true,
    autoloadThreshold: 50,
  };

  state = {
    scrolled: false,
  }

  componentDidMount() {
    this.attachScrollListener();
  }

  componentWillUnmount() {
    this.detachScrollListener();
  }

  componentDidUpdate(prevProps, prevState) {
    const { scrollTop } = (document.scrollingElement || document.documentElement);
    const { count, onClick, autoload, autoloadThreshold } = this.props;

    if (autoload && scrollTop <= autoloadThreshold && count !== prevProps.count) {
      onClick();
    }
  }

  attachScrollListener() {
    window.addEventListener('scroll', this.handleScroll);
  }

  detachScrollListener() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = throttle(() => {
    const { scrollTop } = (document.scrollingElement || document.documentElement);
    const { threshold, onClick, autoload, autoloadThreshold } = this.props;

    if (autoload && scrollTop <= autoloadThreshold) {
      onClick();
    }

    if (scrollTop > threshold) {
      this.setState({ scrolled: true });
    } else {
      this.setState({ scrolled: false });
    }
  }, 150, { trailing: true });

  handleClick = e => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.props.onClick(e);
  }

  render() {
    const { count, message, intl } = this.props;
    const { scrolled } = this.state;

    const visible = count > 0 && scrolled;

    const classes = classNames('timeline-queue-header', {
      'hidden': !visible,
    });

    return (
      <div className={classes}>
        <a className='timeline-queue-header__btn' onClick={this.handleClick}>
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

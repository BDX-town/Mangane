import classNames from 'classnames';
import { throttle } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { getSettings } from 'soapbox/actions/settings';
import Icon from 'soapbox/components/icon';
import { Text } from 'soapbox/components/ui';

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

  scrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  handleClick = e => {
    setTimeout(this.scrollUp, 10);
    this.props.onClick(e);
  }

  render() {
    const { count, message, intl } = this.props;
    const { scrolled } = this.state;

    const visible = count > 0 && scrolled;

    const classes = classNames('left-1/2 -translate-x-1/2 fixed top-20 z-50', {
      'hidden': !visible,
    });

    return (
      <div className={classes}>
        <a className='flex items-center bg-primary-600 hover:bg-primary-700 hover:scale-105 active:scale-100 transition-transform text-white rounded-full px-4 py-2 space-x-1.5 cursor-pointer whitespace-nowrap' onClick={this.handleClick}>
          <Icon src={require('@tabler/icons/icons/arrow-bar-to-up.svg')} />

          {(count > 0) && (
            <Text theme='inherit' size='sm'>
              {intl.formatMessage(message, { count })}
            </Text>
          )}
        </a>
      </div>
    );
  }

}

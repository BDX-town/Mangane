import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { throttle } from 'lodash';
import Icon from 'soapbox/components/icon';
import classNames from 'classnames';
import Helmet from 'soapbox/components/helmet';

export default class SubNavigation extends React.PureComponent {

  static propTypes = {
    message: PropTypes.string,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  state = {
    scrolled: false,
  }

  handleBackClick = () => {
    if (window.history && window.history.length === 1) {
      this.context.router.history.push('/');
    } else {
      this.context.router.history.goBack();
    }
  }

  handleBackKeyUp = (e) => {
    if (e.key === 'Enter') {
      this.handleClick();
    }
  }

  componentDidMount() {
    this.attachScrollListener();
  }

  componentWillUnmount() {
    this.detachScrollListener();
  }

  attachScrollListener() {
    window.addEventListener('scroll', this.handleScroll);
  }

  detachScrollListener() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = throttle(() => {
    if (this.node) {
      const { top } = this.node.getBoundingClientRect();

      if (top <= 50) {
        this.setState({ scrolled: true });
      } else {
        this.setState({ scrolled: false });
      }
    }
  }, 150, { trailing: true });

  setRef = c => {
    this.node = c;
  }

  render() {
    const { message } = this.props;
    const { scrolled } = this.state;

    return (
      <div className={classNames('sub-navigation', { 'sub-navigation--scrolled': scrolled })} ref={this.setRef}>
        <div className='sub-navigation__content'>
          <button
            className='sub-navigation__back'
            onClick={this.handleBackClick}
            onKeyUp={this.handleBackKeyUp}
          >
            <Icon src={require('@tabler/icons/icons/arrow-back.svg')} />
            <FormattedMessage id='sub_navigation.back' defaultMessage='Back' />
          </button>
          {message && (
            <div className='sub-navigation__message'>
              <Helmet><title>{message}</title></Helmet>
              {message}
            </div>
          )}
        </div>
      </div>
    );
  }

}

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { throttle } from 'lodash';
import Icon from 'soapbox/components/icon';
import IconButton from 'soapbox/components/icon_button';
import classNames from 'classnames';
import Helmet from 'soapbox/components/helmet';
import { openModal } from 'soapbox/actions/modal';

const mapDispatchToProps = (dispatch, { settings: Settings }) => {
  return {
    onOpenSettings() {
      dispatch(openModal('COMPONENT', { component: Settings }));
    },
  };
};

export default @connect(undefined, mapDispatchToProps)
class SubNavigation extends React.PureComponent {

  static propTypes = {
    message: PropTypes.string,
    settings: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    onOpenSettings: PropTypes.func.isRequired,
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

  handleOpenSettings = () => {
    this.props.onOpenSettings();
  }

  setRef = c => {
    this.node = c;
  }

  render() {
    const { message, settings: Settings } = this.props;
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
            <FormattedMessage id='column_back_button.label' defaultMessage='Back' />
          </button>
          {message && (
            <div className='sub-navigation__message'>
              <Helmet><title>{message}</title></Helmet>
              {message}
            </div>
          )}
          {Settings && (
            <div className='sub-navigation__cog'>
              <IconButton src={require('@tabler/icons/icons/settings.svg')} onClick={this.handleOpenSettings} />
            </div>
          )}
        </div>
      </div>
    );
  }

}

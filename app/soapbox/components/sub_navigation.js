import classNames from 'classnames';
import { throttle } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';

import { openModal } from 'soapbox/actions/modals';
import Helmet from 'soapbox/components/helmet';
import Icon from 'soapbox/components/icon';
import IconButton from 'soapbox/components/icon_button';

const messages = defineMessages({
  back: { id: 'column_back_button.label', defaultMessage: 'Back' },
  settings: { id: 'column_header.show_settings', defaultMessage: 'Show settings' },
});

const mapDispatchToProps = (dispatch, { settings: Settings }) => {
  return {
    onOpenSettings() {
      dispatch(openModal('COMPONENT', { component: Settings }));
    },
  };
};

export default @connect(undefined, mapDispatchToProps)
@injectIntl
class SubNavigation extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
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
      const { offsetTop } = this.node;

      if (offsetTop > 0) {
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
    const { intl, message, settings: Settings } = this.props;
    const { scrolled } = this.state;

    return (
      <div className={classNames('sub-navigation', { 'sub-navigation--scrolled': scrolled })} ref={this.setRef}>
        <div className='sub-navigation__content'>
          <button
            className='sub-navigation__back'
            onClick={this.handleBackClick}
            onKeyUp={this.handleBackKeyUp}
            aria-label={intl.formatMessage(messages.back)}
            title={intl.formatMessage(messages.back)}
          >
            <Icon src={require('@tabler/icons/icons/arrow-left.svg')} />
            {intl.formatMessage(messages.back)}
          </button>
          {message && (
            <div className='sub-navigation__message'>
              <Helmet><title>{message}</title></Helmet>
              {message}
            </div>
          )}
          {Settings && (
            <div className='sub-navigation__cog'>
              <IconButton
                src={require('@tabler/icons/icons/settings.svg')}
                onClick={this.handleOpenSettings}
                title={intl.formatMessage(messages.settings)}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

}

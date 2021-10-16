import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import { throttle } from 'lodash';
import Icon from 'soapbox/components/icon';
import IconButton from 'soapbox/components/icon_button';
import classNames from 'classnames';
import Helmet from 'soapbox/components/helmet';
import { openModal } from 'soapbox/actions/modal';

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
    className: PropTypes.string,
    showAfter: PropTypes.number,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  state = {
    sticking: false,
    visible: typeof this.props.showAfter !== 'number',
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

  updateSticking = () => {
    if (this.node) {
      const { top } = this.node.getBoundingClientRect();

      if (top <= 50) {
        this.setState({ sticking: true });
      } else {
        this.setState({ sticking: false });
      }
    }
  }

  updateVisibile = () => {
    const { showAfter } = this.props;

    if (typeof showAfter === 'number') {
      if (document.documentElement.scrollTop >= showAfter) {
        this.setState({ visible: true });
      } else {
        this.setState({ visible: false });
      }
    }
  }

  handleScroll = throttle(() => {
    this.updateSticking();
    this.updateVisibile();
  }, 150, { trailing: true });

  handleOpenSettings = () => {
    this.props.onOpenSettings();
  }

  setRef = c => {
    this.node = c;
  }

  render() {
    const { intl, message, settings: Settings, className, showAfter } = this.props;
    const { sticking, visible } = this.state;

    return (
      <div className={classNames(className, 'sub-navigation', { 'sub-navigation--sticking': sticking, 'sub-navigation--hidden': !visible, 'sub-navigation--visible': visible, 'sub-navigation--show-after': typeof showAfter === 'number' })} ref={this.setRef}>
        <div className='sub-navigation__content'>
          <button
            className='sub-navigation__back'
            onClick={this.handleBackClick}
            onKeyUp={this.handleBackKeyUp}
            aria-label={intl.formatMessage(messages.back)}
            title={intl.formatMessage(messages.back)}
          >
            <Icon src={require('@tabler/icons/icons/arrow-back.svg')} />
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

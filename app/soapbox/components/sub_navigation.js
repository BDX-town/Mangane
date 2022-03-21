import { throttle } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';

import { openModal } from 'soapbox/actions/modals';

import { CardHeader, CardTitle } from './ui';

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
    const { intl, message } = this.props;

    return (
      <CardHeader
        aria-label={intl.formatMessage(messages.back)}
        onBackClick={this.handleBackClick}
      >
        <CardTitle title={message} />
      </CardHeader>
    );
  }

}

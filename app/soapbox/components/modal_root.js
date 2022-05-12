import classNames from 'classnames';
import { createBrowserHistory } from 'history';
import PropTypes from 'prop-types';
import React from 'react';
import 'wicg-inert';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { cancelReplyCompose } from '../actions/compose';
import { openModal, closeModal } from '../actions/modals';

const messages = defineMessages({
  confirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
});

const checkComposeContent = compose => {
  return [
    compose.get('text').length > 0,
    compose.get('spoiler_text').length > 0,
    compose.get('media_attachments').size > 0,
    compose.get('in_reply_to') !== null,
    compose.get('quote') !== null,
    compose.get('poll') !== null,
  ].some(check => check === true);
};

const mapStateToProps = state => ({
  hasComposeContent: checkComposeContent(state.get('compose')),
});

const mapDispatchToProps = (dispatch) => ({
  onOpenModal(type, opts) {
    dispatch(openModal(type, opts));
  },
  onCloseModal(type) {
    dispatch(closeModal(type));
  },
  onCancelReplyCompose() {
    dispatch(closeModal('COMPOSE'));
    dispatch(cancelReplyCompose());
  },
});

@withRouter
class ModalRoot extends React.PureComponent {

  static propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
    onOpenModal: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    onCancelReplyCompose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    hasComposeContent: PropTypes.bool,
    type: PropTypes.string,
    onCancel: PropTypes.func,
    history: PropTypes.object,
  };

  state = {
    revealed: !!this.props.children,
  };

  activeElement = this.state.revealed ? document.activeElement : null;

  handleKeyUp = (e) => {
    if ((e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27)
         && !!this.props.children) {
      this.handleOnClose();
    }
  }

  handleOnClose = () => {
    const { onOpenModal, onCloseModal, hasComposeContent, intl, type, onCancelReplyCompose } = this.props;

    if (hasComposeContent && type === 'COMPOSE') {
      onOpenModal('CONFIRM', {
        icon: require('@tabler/icons/icons/trash.svg'),
        heading: <FormattedMessage id='confirmations.delete.heading' defaultMessage='Delete post' />,
        message: <FormattedMessage id='confirmations.delete.message' defaultMessage='Are you sure you want to delete this post?' />,
        confirm: intl.formatMessage(messages.confirm),
        onConfirm: () => onCancelReplyCompose(),
        onCancel: () => onCloseModal('CONFIRM'),
      });
    } else if (hasComposeContent && type === 'CONFIRM') {
      onCloseModal('CONFIRM');
    } else {
      this.props.onClose();
    }
  };


  handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      const focusable = Array.from(this.node.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter((x) => window.getComputedStyle(x).display !== 'none');
      const index = focusable.indexOf(e.target);

      let element;

      if (e.shiftKey) {
        element = focusable[index - 1] || focusable[focusable.length - 1];
      } else {
        element = focusable[index + 1] || focusable[0];
      }

      if (element) {
        element.focus();
        e.stopPropagation();
        e.preventDefault();
      }
    }
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUp, false);
    window.addEventListener('keydown', this.handleKeyDown, false);
    this.history = this.props.history || createBrowserHistory();
  }

  componentDidUpdate(prevProps) {
    if (!!this.props.children && !prevProps.children) {
      this.activeElement = document.activeElement;
      this.getSiblings().forEach(sibling => sibling.setAttribute('inert', true));

      this._handleModalOpen();
    } else if (!prevProps.children) {
      this.setState({ revealed: false });
    }

    if (!this.props.children && !!prevProps.children) {
      this.activeElement.focus();
      this.activeElement = null;
      this.getSiblings().forEach(sibling => sibling.removeAttribute('inert'));

      this._handleModalClose(prevProps.type);
    }

    if (this.props.children) {
      requestAnimationFrame(() => {
        this.setState({ revealed: true });
      });

      this._ensureHistoryBuffer();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  _handleModalOpen() {
    this._modalHistoryKey = Date.now();
    this.unlistenHistory = this.history.listen((_, action) => {
      if (action === 'POP') {
        this.handleOnClose();

        if (this.props.onCancel) this.props.onCancel();
      }
    });
  }

  _handleModalClose(type) {
    if (this.unlistenHistory) {
      this.unlistenHistory();
    }
    if (!['FAVOURITES', 'MENTIONS', 'REACTIONS', 'REBLOGS', 'MEDIA'].includes(type)) {
      const { state } = this.history.location;
      if (state && state.soapboxModalKey === this._modalHistoryKey) {
        this.history.goBack();
      }
    }
  }

  _ensureHistoryBuffer() {
    const { pathname, state } = this.history.location;
    if (!state || state.soapboxModalKey !== this._modalHistoryKey) {
      this.history.push(pathname, { ...state, soapboxModalKey: this._modalHistoryKey });
    }
  }

  getSiblings = () => {
    return Array(...this.node.parentElement.childNodes).filter(node => node !== this.node);
  }

  setRef = ref => {
    this.node = ref;
  }

  render() {
    const { children, type } = this.props;
    const { revealed } = this.state;
    const visible = !!children;

    if (!visible) {
      return (
        <div className='z-50 transition-all' ref={this.setRef} style={{ opacity: 0 }} />
      );
    }

    return (
      <div
        ref={this.setRef}
        className={classNames({
          'fixed top-0 left-0 z-[100] w-full h-full overflow-x-hidden overflow-y-auto': true,
          'pointer-events-none': !visible,
        })}
        style={{ opacity: revealed ? 1 : 0 }}
      >
        <div
          role='presentation'
          id='modal-overlay'
          className='fixed inset-0 bg-gray-600 bg-opacity-90'
          onClick={this.handleOnClose}
        />

        <div
          role='dialog'
          className={classNames({
            'my-2 mx-auto relative pointer-events-none flex items-center': true,
            'p-4 md:p-0': type !== 'MEDIA',
          })}
          style={{ minHeight: 'calc(100% - 3.5rem)' }}
        >
          {children}
        </div>
      </div>
    );
  }

}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ModalRoot));

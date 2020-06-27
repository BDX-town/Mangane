import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { openModal } from '../actions/modal';
import { cancelReplyCompose } from '../actions/compose';

const messages = defineMessages({
  confirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
});

const checkComposeContent = compose => {
  return [
    compose.get('text').length > 0,
    compose.get('spoiler_text').length > 0,
    compose.get('media_attachments').size > 0,
    compose.get('in_reply_to') !== null,
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
  onCancelReplyCompose() {
    dispatch(cancelReplyCompose());
  },
});

class ModalRoot extends React.PureComponent {

  static propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
    onOpenModal: PropTypes.func.isRequired,
    onCancelReplyCompose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    hasComposeContent: PropTypes.bool,
    type: PropTypes.string,
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
    const { onOpenModal, hasComposeContent, intl, type, onCancelReplyCompose } = this.props;

    if (hasComposeContent && type === 'COMPOSE') {
      onOpenModal('CONFIRM', {
        message: <FormattedMessage id='confirmations.delete.message' defaultMessage='Are you sure you want to delete this post?' />,
        confirm: intl.formatMessage(messages.confirm),
        onConfirm: () => onCancelReplyCompose(),
        onCancel: () => onOpenModal('COMPOSE'),
      });
    } else if (hasComposeContent && type === 'CONFIRM') {
      onOpenModal('COMPOSE');
    } else {
      this.props.onClose();
    }
  };

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUp, false);
  }

  componentDidUpdate(nextProps, prevProps) {
    if (!!nextProps.children && !this.props.children) {
      this.activeElement = document.activeElement;
      this.getSiblings().forEach(sibling => sibling.setAttribute('inert', true));
    } else if (!nextProps.children) {
      this.setState({ revealed: false });
    }
    if (!nextProps.children && !!this.props.children) {
      this.activeElement = document.activeElement;
      this.activeElement.focus();
      this.activeElement = null;
    }
    if (!this.props.children && !!prevProps.children) {
      this.getSiblings().forEach(sibling => sibling.removeAttribute('inert'));
    }
    if (this.props.children) {
      requestAnimationFrame(() => {
        this.setState({ revealed: true });
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  getSiblings = () => {
    return Array(...this.node.parentElement.childNodes).filter(node => node !== this.node);
  }

  setRef = ref => {
    this.node = ref;
  }

  render() {
    const { children } = this.props;
    const { revealed } = this.state;
    const visible = !!children;

    if (!visible) {
      return (
        <div className='modal-root' ref={this.setRef} style={{ opacity: 0 }} />
      );
    }

    return (
      <div className='modal-root' ref={this.setRef} style={{ opacity: revealed ? 1 : 0 }}>
        <div style={{ pointerEvents: visible ? 'auto' : 'none' }}>
          <div role='presentation' className='modal-root__overlay' onClick={this.handleOnClose} />
          <div role='dialog' className='modal-root__container'>{children}</div>
        </div>
      </div>
    );
  }

}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ModalRoot));

import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import IconButton from 'soapbox/components/icon_button';

import { cancelReplyCompose } from '../../../actions/compose';
import { openModal } from '../../../actions/modal';
import ComposeFormContainer from '../../compose/containers/compose_form_container';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  confirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
});

const mapStateToProps = state => {
  const me = state.get('me');
  return {
    account: state.getIn(['accounts', me]),
    composeText: state.getIn(['compose', 'text']),
    privacy: state.getIn(['compose', 'privacy']),
    inReplyTo: state.getIn(['compose', 'in_reply_to']),
    quote: state.getIn(['compose', 'quote']),
  };
};

class ComposeModal extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    composeText: PropTypes.string,
    privacy: PropTypes.string,
    inReplyTo: PropTypes.string,
    quote: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  };

  onClickClose = () => {
    const { composeText, dispatch, onClose, intl } = this.props;

    if (composeText) {
      dispatch(openModal('CONFIRM', {
        icon: require('@tabler/icons/icons/trash.svg'),
        heading: <FormattedMessage id='confirmations.delete.heading' defaultMessage='Delete post' />,
        message: <FormattedMessage id='confirmations.delete.message' defaultMessage='Are you sure you want to delete this post?' />,
        confirm: intl.formatMessage(messages.confirm),
        onConfirm: () => dispatch(cancelReplyCompose()),
        onCancel: () => dispatch(openModal('COMPOSE')),
      }));
    } else {
      onClose('COMPOSE');
    }
  };

  renderTitle = () => {
    const { privacy, inReplyTo, quote } = this.props;

    if (privacy === 'direct') {
      return <FormattedMessage id='navigation_bar.compose_direct' defaultMessage='Direct message' />;
    } else if (inReplyTo) {
      return <FormattedMessage id='navigation_bar.compose_reply' defaultMessage='Reply to post' />;
    } else if (quote) {
      return <FormattedMessage id='navigation_bar.compose_quote' defaultMessage='Quote post' />;
    } else {
      return <FormattedMessage id='navigation_bar.compose' defaultMessage='Compose new post' />;
    }
  }

  render() {
    const { intl } = this.props;

    return (
      <div className='modal-root__modal compose-modal'>
        <div className='compose-modal__header'>
          <h3 className='compose-modal__header__title'>
            {this.renderTitle()}
          </h3>
          <IconButton
            className='compose-modal__close'
            title={intl.formatMessage(messages.close)}
            src={require('@tabler/icons/icons/x.svg')}
            onClick={this.onClickClose} size={20}
          />
        </div>
        <div className='compose-modal__content compose-modal__content--scroll'>
          <ComposeFormContainer />
        </div>
      </div>
    );
  }

}

export default injectIntl(connect(mapStateToProps)(ComposeModal));

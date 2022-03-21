import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { changeAccountNoteComment, submitAccountNote } from 'soapbox/actions/account_notes';
import { closeModal } from 'soapbox/actions/modals';
import Icon from 'soapbox/components/icon';
import { Button } from 'soapbox/components/ui';
import { makeGetAccount } from 'soapbox/selectors';


const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  placeholder: { id: 'account_note.placeholder', defaultMessage: 'No comment provided' },
  save: { id: 'account_note.save', defaultMessage: 'Save' },
});

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = state => ({
    isSubmitting: state.getIn(['account_notes', 'edit', 'isSubmitting']),
    account: getAccount(state, state.getIn(['account_notes', 'edit', 'account_id'])),
    comment: state.getIn(['account_notes', 'edit', 'comment']),
  });

  return mapStateToProps;
};

const mapDispatchToProps = dispatch => {
  return {
    onConfirm() {
      dispatch(submitAccountNote());
    },

    onClose() {
      dispatch(closeModal());
    },

    onCommentChange(comment) {
      dispatch(changeAccountNoteComment(comment));
    },
  };
};

export default @connect(makeMapStateToProps, mapDispatchToProps)
@injectIntl
class AccountNoteModal extends React.PureComponent {

  static propTypes = {
    isSubmitting: PropTypes.bool,
    account: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCommentChange: PropTypes.func.isRequired,
    comment: PropTypes.string,
    intl: PropTypes.object.isRequired,
  };

  handleCommentChange = e => {
    this.props.onCommentChange(e.target.value);
  }

  handleSubmit = () => {
    this.props.onConfirm();
  }

  handleKeyDown = e => {
    if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
      this.handleSubmit();
    }
  }


  render() {
    const { account, isSubmitting, comment, onClose, intl } = this.props;

    return (
      <div className='modal-root__modal account-note-modal'>
        <div className='account-note-modal__header'>
          <Icon src={require('@tabler/icons/icons/note.svg')} />
          <FormattedMessage id='account_note.target' defaultMessage='Note for @{target}' values={{ target: account.get('acct') }} />
        </div>

        <div className='account-note-modal__container'>
          <p><FormattedMessage id='account_note.hint' defaultMessage='You can keep notes about this user for yourself (this will not be shared with them):' /></p>

          <textarea
            className='setting-text light'
            placeholder={intl.formatMessage(messages.placeholder)}
            value={comment}
            onChange={this.handleCommentChange}
            onKeyDown={this.handleKeyDown}
            disabled={isSubmitting}
            autoFocus
          />
        </div>
        <div className='account-note-modal__action-bar'>
          <Button onClick={onClose} className='account-note-modal__cancel-button'>
            <FormattedMessage id='confirmation_modal.cancel' defaultMessage='Cancel' />
          </Button>
          <Button text={intl.formatMessage(messages.save)} onClick={this.handleSubmit} disabled={isSubmitting} />
        </div>
      </div>
    );
  }

}

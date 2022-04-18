import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { changeAccountNoteComment, submitAccountNote } from 'soapbox/actions/account_notes';
import { closeModal } from 'soapbox/actions/modals';
import { Modal, Text } from 'soapbox/components/ui';
import { makeGetAccount } from 'soapbox/selectors';


const messages = defineMessages({
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
      <Modal
        title={<FormattedMessage id='account_note.target' defaultMessage='Note for @{target}' values={{ target: account.get('acct') }} />}
        onClose={onClose}
        confirmationAction={this.handleSubmit}
        confirmationText={intl.formatMessage(messages.save)}
        confirmationDisabled={isSubmitting}
      >
        <Text theme='muted'>
          <FormattedMessage id='account_note.hint' defaultMessage='You can keep notes about this user for yourself (this will not be shared with them):' />
        </Text>

        <textarea
          className='setting-text light'
          placeholder={intl.formatMessage(messages.placeholder)}
          value={comment}
          onChange={this.handleCommentChange}
          onKeyDown={this.handleKeyDown}
          disabled={isSubmitting}
          autoFocus
        />
      </Modal>
    );
  }

}

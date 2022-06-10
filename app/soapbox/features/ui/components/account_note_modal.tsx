import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { changeAccountNoteComment, submitAccountNote } from 'soapbox/actions/account-notes';
import { closeModal } from 'soapbox/actions/modals';
import { Modal, Text } from 'soapbox/components/ui';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';
import { makeGetAccount } from 'soapbox/selectors';

const messages = defineMessages({
  placeholder: { id: 'account_note.placeholder', defaultMessage: 'No comment provided' },
  save: { id: 'account_note.save', defaultMessage: 'Save' },
});

const getAccount = makeGetAccount();

const AccountNoteModal = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const isSubmitting = useAppSelector((state) => state.account_notes.edit.isSubmitting);
  const account = useAppSelector((state) => getAccount(state, state.account_notes.edit.account!));
  const comment = useAppSelector((state) => state.account_notes.edit.comment);

  const onClose = () => {
    dispatch(closeModal('ACCOUNT_NOTE'));
  };

  const handleCommentChange: React.ChangeEventHandler<HTMLTextAreaElement> = e => {
    dispatch(changeAccountNoteComment(e.target.value));
  };

  const handleSubmit = () => {
    dispatch(submitAccountNote());
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = e => {
    if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  return (
    <Modal
      title={<FormattedMessage id='account_note.target' defaultMessage='Note for @{target}' values={{ target: account!.acct }} />}
      onClose={onClose}
      confirmationAction={handleSubmit}
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
        onChange={handleCommentChange}
        onKeyDown={handleKeyDown}
        disabled={isSubmitting}
        autoFocus
      />
    </Modal>
  );
};

export default AccountNoteModal;

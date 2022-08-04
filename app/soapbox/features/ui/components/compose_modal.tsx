import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { cancelReplyCompose } from 'soapbox/actions/compose';
import { openModal, closeModal } from 'soapbox/actions/modals';
import { Modal } from 'soapbox/components/ui';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

import ComposeFormContainer from '../../compose/containers/compose_form_container';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  confirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
  cancelEditing: { id: 'confirmations.cancel_editing.confirm', defaultMessage: 'Cancel editing' },
});

interface IComposeModal {
  onClose: (type?: string) => void,
}

const ComposeModal: React.FC<IComposeModal> = ({ onClose }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const statusId = useAppSelector((state) => state.compose.id);
  const composeText = useAppSelector((state) => state.compose.text);
  const privacy = useAppSelector((state) => state.compose.privacy);
  const inReplyTo = useAppSelector((state) => state.compose.in_reply_to);
  const quote = useAppSelector((state) => state.compose.quote);

  const onClickClose = () => {
    if (composeText) {
      dispatch(openModal('CONFIRM', {
        icon: require('@tabler/icons/trash.svg'),
        heading: statusId
          ? <FormattedMessage id='confirmations.cancel_editing.heading' defaultMessage='Cancel post editing' />
          : <FormattedMessage id='confirmations.delete.heading' defaultMessage='Delete post' />,
        message: statusId
          ? <FormattedMessage id='confirmations.cancel_editing.message' defaultMessage='Are you sure you want to cancel editing this post? All changes will be lost.' />
          : <FormattedMessage id='confirmations.delete.message' defaultMessage='Are you sure you want to delete this post?' />,
        confirm: intl.formatMessage(statusId ? messages.cancelEditing : messages.confirm),
        onConfirm: () => {
          dispatch(closeModal('COMPOSE'));
          dispatch(cancelReplyCompose());
        },
      }));
    } else {
      onClose('COMPOSE');
    }
  };

  const renderTitle = () => {
    if (statusId) {
      return <FormattedMessage id='navigation_bar.compose_edit' defaultMessage='Edit post' />;
    } else if (privacy === 'direct') {
      return <FormattedMessage id='navigation_bar.compose_direct' defaultMessage='Direct message' />;
    } else if (inReplyTo) {
      return <FormattedMessage id='navigation_bar.compose_reply' defaultMessage='Reply to post' />;
    } else if (quote) {
      return <FormattedMessage id='navigation_bar.compose_quote' defaultMessage='Quote post' />;
    } else {
      return <FormattedMessage id='navigation_bar.compose' defaultMessage='Compose new post' />;
    }
  };

  return (
    <Modal
      title={renderTitle()}
      onClose={onClickClose}
    >
      <ComposeFormContainer />
    </Modal>
  );
};

export default ComposeModal;

import React from 'react';
import { injectIntl, FormattedMessage, IntlShape, defineMessages } from 'react-intl';

import { Modal } from 'soapbox/components/ui';

const messages = defineMessages({
  modalTitle: { id: 'missing_description_modal.text', defaultMessage: 'You have not entered a description for all attachments.' },
  post: { id: 'missing_description_modal.continue', defaultMessage: 'Post' },
  cancel: { id: 'missing_description_modal.cancel', defaultMessage: 'Cancel' },
});

interface IMissingDescriptionModal {
  onClose: Function,
  onContinue: Function,
  intl: IntlShape,
}

class MissingDescriptionModal extends React.PureComponent<IMissingDescriptionModal> {

  handleContinue = () => {
    this.props.onClose();
    this.props.onContinue();
  }

  handleCancel = () => {
    this.props.onClose();
  }

  render() {
    const { intl } = this.props;

    return (
      <Modal
        title={intl.formatMessage(messages.modalTitle)}
        confirmationAction={this.handleContinue}
        confirmationText={intl.formatMessage(messages.post)}
        confirmationTheme='danger'
        cancelText={intl.formatMessage(messages.cancel)}
        cancelAction={this.handleCancel}
      >
        <p className='text-gray-600 dark:text-gray-300'>
          <FormattedMessage id='missing_description_modal.description' defaultMessage='Continue anyway?' />
        </p>
      </Modal>
    );
  }

}

export default injectIntl(MissingDescriptionModal);

import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import IconButton from 'soapbox/components/icon_button';

const messages = defineMessages({
  error: { id: 'bundle_modal_error.message', defaultMessage: 'Something went wrong while loading this page.' },
  retry: { id: 'bundle_modal_error.retry', defaultMessage: 'Try again' },
  close: { id: 'bundle_modal_error.close', defaultMessage: 'Close' },
});

interface IBundleModalError {
  onRetry: () => void,
  onClose: () => void,
}

const BundleModalError: React.FC<IBundleModalError> = ({ onRetry, onClose }) => {
  const intl = useIntl();

  const handleRetry = () => {
    onRetry();
  };

  return (
    <div className='modal-root__modal error-modal'>
      <div className='error-modal__body'>
        <IconButton title={intl.formatMessage(messages.retry)} icon='refresh' onClick={handleRetry} size={64} />
        {intl.formatMessage(messages.error)}
      </div>

      <div className='error-modal__footer'>
        <div>
          <button
            onClick={onClose}
            className='error-modal__nav onboarding-modal__skip'
          >
            {intl.formatMessage(messages.close)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BundleModalError;

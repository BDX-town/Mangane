import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import IconButton from '../../../components/icon_button';

import Column from './column';
import ColumnHeader from './column_header';

const messages = defineMessages({
  title: { id: 'bundle_column_error.title', defaultMessage: 'Network error' },
  body: { id: 'bundle_column_error.body', defaultMessage: 'Something went wrong while loading this component.' },
  retry: { id: 'bundle_column_error.retry', defaultMessage: 'Try again' },
});

interface IBundleColumnError {
  onRetry: () => void,
}

const BundleColumnError: React.FC<IBundleColumnError> = ({ onRetry }) => {
  const intl = useIntl();

  const handleRetry = () => {
    onRetry();
  };

  return (
    <Column>
      <ColumnHeader icon='exclamation-circle' type={intl.formatMessage(messages.title)} />
      <div className='error-column'>
        <IconButton title={intl.formatMessage(messages.retry)} src={require('@tabler/icons/icons/refresh.svg')} onClick={handleRetry} />
        {intl.formatMessage(messages.body)}
      </div>
    </Column>
  );
};

export default BundleColumnError;

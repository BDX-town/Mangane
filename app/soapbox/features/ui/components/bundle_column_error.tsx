import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Column, Stack, Text, IconButton } from 'soapbox/components/ui';

const messages = defineMessages({
  title: { id: 'bundle_column_error.title', defaultMessage: 'Network error' },
  body: { id: 'bundle_column_error.body', defaultMessage: 'Something went wrong while loading this page.' },
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
    <Column label={intl.formatMessage(messages.title)}>
      <Stack space={4} alignItems='center' justifyContent='center' className='bg-primary-50 dark:bg-slate-700 p-10 min-h-[160px] rounded-lg'>
        <IconButton
          iconClassName='w-20 h-20'
          title={intl.formatMessage(messages.retry)}
          src={require('@tabler/icons/icons/refresh.svg')}
          onClick={handleRetry}
        />

        <Text align='center'>{intl.formatMessage(messages.body)}</Text>
      </Stack>
    </Column>
  );
};

export default BundleColumnError;

import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import Column from './column';

const messages = defineMessages({
  title: { id: 'column_forbidden.title', defaultMessage: 'Forbidden' },
  body: { id: 'column_forbidden.body', defaultMessage: 'You do not have permission to access this page.' },
});

const ColumnForbidden = () => {
  const intl = useIntl();

  return (
    <Column label={intl.formatMessage(messages.title)}>
      <div className='error-column'>
        {intl.formatMessage(messages.body)}
      </div>
    </Column>
  );
};

export default ColumnForbidden;

import React from 'react';
import { useIntl, defineMessages } from 'react-intl';

import Icon from 'soapbox/components/icon';

const messages = defineMessages({
  verified: { id: 'account.verified', defaultMessage: 'Verified Account' },
});

const VerificationBadge = () => {
  const intl = useIntl();

  return (
    <span className='verified-icon'>
      <Icon src={require('icons/verified.svg')} alt={intl.formatMessage(messages.verified)} />
    </span>
  );
};

export default VerificationBadge;

import classNames from 'classnames';
import React from 'react';
import { useIntl, defineMessages } from 'react-intl';

import Icon from 'soapbox/components/ui/icon/icon';
import { useSoapboxConfig } from 'soapbox/hooks';

const messages = defineMessages({
  verified: { id: 'account.verified', defaultMessage: 'Verified Account' },
});

interface IVerificationBadge {
  className?: string,
}

const VerificationBadge: React.FC<IVerificationBadge> = ({ className }) => {
  const intl = useIntl();
  const soapboxConfig = useSoapboxConfig();

  // Prefer a custom icon if found
  const icon = soapboxConfig.verifiedIcon || require('icons/verified.svg');

  // Render component based on file extension
  const Element = icon.endsWith('.svg') ? Icon : 'img';

  return (
    <span className='verified-icon'>
      <Element className={classNames('w-4 text-accent-500', className)} src={icon} alt={intl.formatMessage(messages.verified)} />
    </span>
  );
};

export default VerificationBadge;

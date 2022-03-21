import classNames from 'classnames';
import { Map as ImmutableMap } from 'immutable';
import React from 'react';
import { useIntl, defineMessages } from 'react-intl';
import { useSelector } from 'react-redux';

import Icon from 'soapbox/components/ui/icon/icon';

const messages = defineMessages({
  verified: { id: 'account.verified', defaultMessage: 'Verified Account' },
});

interface IVerificationBadge {
  className?: string,
}

const VerificationBadge = ({ className }: IVerificationBadge) => {
  const intl = useIntl();

  // Prefer a custom icon if found
  const customIcon = useSelector((state: ImmutableMap<string, any>) => state.getIn(['soapbox', 'verifiedIcon']));
  const icon = customIcon || require('icons/verified.svg');

  // Render component based on file extension
  const Element = icon.endsWith('.svg') ? Icon : 'img';

  return (
    <span className='verified-icon'>
      <Element className={classNames('w-4 text-accent-500', className)} src={icon} alt={intl.formatMessage(messages.verified)} />
    </span>
  );
};

export default VerificationBadge;

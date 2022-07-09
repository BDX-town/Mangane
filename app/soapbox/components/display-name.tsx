import * as React from 'react';

import HoverRefWrapper from 'soapbox/components/hover_ref_wrapper';
import { useSoapboxConfig } from 'soapbox/hooks';

import { getAcct } from '../utils/accounts';

import Icon from './icon';
import RelativeTimestamp from './relative_timestamp';
import VerificationBadge from './verification_badge';

import type { Account } from 'soapbox/types/entities';

interface IDisplayName {
  account: Account
  withDate?: boolean
}

const DisplayName: React.FC<IDisplayName> = ({ account, children, withDate = false }) => {
  const { displayFqn = false } = useSoapboxConfig();
  const { created_at: createdAt, verified } = account;

  const joinedAt = createdAt ? (
    <div className='account__joined-at'>
      <Icon src={require('@tabler/icons/clock.svg')} />
      <RelativeTimestamp timestamp={createdAt} />
    </div>
  ) : null;

  const displayName = (
    <span className='display-name__name'>
      <bdi><strong className='display-name__html' dangerouslySetInnerHTML={{ __html: account.get('display_name_html') }} /></bdi>
      {verified && <VerificationBadge />}
      {withDate && joinedAt}
    </span>
  );

  const suffix = (<span className='display-name__account'>@{getAcct(account, displayFqn)}</span>);

  return (
    <span className='display-name' data-testid='display-name'>
      <HoverRefWrapper accountId={account.get('id')} inline>
        {displayName}
      </HoverRefWrapper>
      {suffix}
      {children}
    </span>
  );
};

export default DisplayName;

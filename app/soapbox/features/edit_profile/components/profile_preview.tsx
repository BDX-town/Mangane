import React from 'react';
import { Link } from 'react-router-dom';

import StillImage from 'soapbox/components/still_image';
import VerificationBadge from 'soapbox/components/verification_badge';
import { useSoapboxConfig } from 'soapbox/hooks';

import type { Account } from 'soapbox/types/entities';

interface IProfilePreview {
  account: Account,
}

/** Displays a preview of the user's account, including avatar, banner, etc. */
const ProfilePreview: React.FC<IProfilePreview> = ({ account }) => {
  const { displayFqn } = useSoapboxConfig();

  return (
    <div className='card h-card'>
      <Link to={`/@${account.acct}`}>
        <div className='card__img'>
          <StillImage alt='' src={account.header} />
        </div>
        <div className='card__bar'>
          <div className='avatar'>
            <StillImage alt='' className='u-photo' src={account.avatar} width='48' height='48' />
          </div>
          <div className='display-name'>
            <span style={{ display: 'none' }}>{account.username}</span>
            <bdi>
              <strong className='emojify p-name'>
                {account.display_name}
                {account.verified && <VerificationBadge />}
              </strong>
            </bdi>
            <span>@{displayFqn ? account.fqn : account.acct}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProfilePreview;

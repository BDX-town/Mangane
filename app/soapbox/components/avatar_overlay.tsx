import React from 'react';

import StillImage from 'soapbox/components/still_image';

import type { Account as AccountEntity } from 'soapbox/types/entities';

interface IAvatarOverlay {
  account: AccountEntity,
  friend: AccountEntity,
}

const AvatarOverlay: React.FC<IAvatarOverlay> = ({ account, friend }) => (
  <div className='account__avatar-overlay'>
    <StillImage src={account.avatar} className='account__avatar-overlay-base' />
    <StillImage src={friend.avatar} className='account__avatar-overlay-overlay' />
  </div>
);

export default AvatarOverlay;

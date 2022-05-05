import React from 'react';

import StillImage from 'soapbox/components/still_image';
import { HStack, Stack, Text } from 'soapbox/components/ui';
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
    <div className='bg-white dark:bg-slate-800 rounded-lg text-black dark:text-white sm:shadow dark:sm:shadow-inset overflow-hidden'>
      <div>
        <div className='relative w-full h-32 md:rounded-t-lg bg-gray-200 dark:bg-slate-900/50'>
          <StillImage alt='' src={account.header} className='absolute inset-0 object-cover md:rounded-t-lg' />
        </div>
      </div>

      <HStack space={3} alignItems='center' className='p-3'>
        <div className='relative'>
          <div className='h-12 w-12 bg-gray-400 rounded-full'>
            <StillImage alt='' className='h-12 w-12 rounded-full' src={account.avatar} />
          </div>

          {!account.verified && <div className='absolute -top-1.5 -right-1.5'><VerificationBadge /></div>}
        </div>

        <Stack className='truncate'>
          <Text weight='medium' size='sm' truncate>
            {account.display_name}
          </Text>
          <Text theme='muted' size='sm'>@{displayFqn ? account.fqn : account.acct}</Text>
        </Stack>
      </HStack>
    </div>
  );
};

export default ProfilePreview;

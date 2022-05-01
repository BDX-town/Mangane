import React from 'react';

import { Stack } from 'soapbox/components/ui';
import { useSoapboxConfig } from 'soapbox/hooks';

import CryptoAddress from './crypto_address';

interface ISiteWallet {
  limit?: number,
}

const SiteWallet: React.FC<ISiteWallet> = ({ limit }): JSX.Element => {
  const { cryptoAddresses } = useSoapboxConfig();
  const addresses = typeof limit === 'number' ? cryptoAddresses.take(limit) : cryptoAddresses;

  return (
    <Stack space={4}>
      {addresses.map(address => (
        <CryptoAddress
          key={address.ticker}
          address={address.address}
          ticker={address.ticker}
          note={address.note}
        />
      ))}
    </Stack>
  );
};

export default SiteWallet;

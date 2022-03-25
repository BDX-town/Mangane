import { trimStart } from 'lodash';
import React from 'react';

import { useSoapboxConfig } from 'soapbox/hooks';

import CryptoAddress from './crypto_address';

import type { Map as ImmutableMap, List as ImmutableList } from 'immutable';

type Address = ImmutableMap<string, any>;

// Address example:
// {"ticker": "btc", "address": "bc1q9cx35adpm73aq2fw40ye6ts8hfxqzjr5unwg0n", "note": "This is our main address"}
const normalizeAddress = (address: Address): Address => {
  return address.update('ticker', '', ticker => {
    return trimStart(ticker, '$').toLowerCase();
  });
};

interface ISiteWallet {
  limit?: number,
}

const SiteWallet: React.FC<ISiteWallet> = ({ limit }): JSX.Element => {
  const addresses: ImmutableList<Address> =
    useSoapboxConfig().get('cryptoAddresses').map(normalizeAddress);

  const coinList = typeof limit === 'number' ? addresses.take(limit) : addresses;

  return (
    <div>
      {coinList.map(coin => (
        <CryptoAddress
          key={coin.get('ticker')}
          {...coin.toJS()}
        />
      ))}
    </div>
  );
};

export default SiteWallet;

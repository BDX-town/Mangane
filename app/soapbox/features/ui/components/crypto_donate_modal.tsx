import React from 'react';

import DetailedCryptoAddress from 'soapbox/features/crypto_donate/components/detailed_crypto_address';

import type { ICryptoAddress } from '../../crypto_donate/components/crypto_address';

const CryptoDonateModal: React.FC<ICryptoAddress> = (props) => {
  return (
    <div className='modal-root__modal crypto-donate-modal'>
      <DetailedCryptoAddress {...props} />
    </div>
  );

};

export default CryptoDonateModal;

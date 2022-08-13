import React from 'react';

import { Modal } from 'soapbox/components/ui';
import DetailedCryptoAddress from 'soapbox/features/crypto_donate/components/detailed_crypto_address';

import type { ICryptoAddress } from '../../crypto_donate/components/crypto_address';

const CryptoDonateModal: React.FC<ICryptoAddress & { onClose: () => void }> = ({ onClose, ...props }) => {

  return (
    <Modal onClose={onClose} width='xs'>
      <div className='crypto-donate-modal'>
        <DetailedCryptoAddress {...props} />
      </div>
    </Modal>
  );

};

export default CryptoDonateModal;

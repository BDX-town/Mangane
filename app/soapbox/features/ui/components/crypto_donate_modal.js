import React from 'react';
import PropTypes from 'prop-types';
import DetailedCryptoAddress from 'soapbox/features/crypto_donate/components/detailed_crypto_address';

export default class CryptoDonateModal extends React.PureComponent {

  static propTypes = {
    address: PropTypes.string.isRequired,
    ticker: PropTypes.string.isRequired,
    note: PropTypes.string,
  };

  render() {
    return (
      <div className='modal-root__modal crypto-donate-modal'>
        <DetailedCryptoAddress {...this.props} />
      </div>
    );
  }

}

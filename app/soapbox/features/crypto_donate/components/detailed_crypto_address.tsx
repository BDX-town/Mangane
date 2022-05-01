import QRCode from 'qrcode.react';
import React from 'react';

import Icon from 'soapbox/components/icon';
import { CopyableInput } from 'soapbox/features/forms';

import { getExplorerUrl } from '../utils/block_explorer';
import { getTitle } from '../utils/coin_db';

import CryptoIcon from './crypto_icon';

interface IDetailedCryptoAddress {
  address: string,
  ticker: string,
  note?: string,
}

const DetailedCryptoAddress: React.FC<IDetailedCryptoAddress> = ({ address, ticker, note }): JSX.Element => {
  const title = getTitle(ticker);
  const explorerUrl = getExplorerUrl(ticker, address);

  return (
    <div className='crypto-address'>
      <div className='crypto-address__head'>
        <CryptoIcon
          className='crypto-address__icon'
          ticker={ticker}
          title={title}
        />
        <div className='crypto-address__title'>{title || ticker.toUpperCase()}</div>
        <div className='crypto-address__actions'>
          {explorerUrl && <a href={explorerUrl} target='_blank'>
            <Icon src={require('@tabler/icons/icons/external-link.svg')} />
          </a>}
        </div>
      </div>
      {note && <div className='crypto-address__note'>{note}</div>}
      <div className='crypto-address__qrcode'>
        <QRCode value={address} />
      </div>
      <div className='crypto-address__address simple_form'>
        <CopyableInput value={address} />
      </div>
    </div>
  );
};

export default DetailedCryptoAddress;

import React from 'react';
import { useDispatch } from 'react-redux';

import { openModal } from 'soapbox/actions/modals';
import Icon from 'soapbox/components/icon';
import { CopyableInput } from 'soapbox/features/forms';

import { getExplorerUrl } from '../utils/block_explorer';
import { getTitle } from '../utils/coin_db';

import CryptoIcon from './crypto_icon';

interface ICryptoAddress {
  address: string,
  ticker: string,
  note?: string,
}

const CryptoAddress: React.FC<ICryptoAddress> = (props): JSX.Element => {
  const { address, ticker, note } = props;

  const dispatch = useDispatch();

  const handleModalClick = (e: React.MouseEvent<HTMLElement>): void => {
    dispatch(openModal('CRYPTO_DONATE', props));
    e.preventDefault();
  };

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
          <a href='#' onClick={handleModalClick}>
            <Icon src={require('@tabler/icons/icons/qrcode.svg')} />
          </a>
          {explorerUrl && <a href={explorerUrl} target='_blank'>
            <Icon src={require('@tabler/icons/icons/external-link.svg')} />
          </a>}
        </div>
      </div>
      {note && <div className='crypto-address__note'>{note}</div>}
      <div className='crypto-address__address simple_form'>
        <CopyableInput value={address} />
      </div>
    </div>
  );
};

export default CryptoAddress;

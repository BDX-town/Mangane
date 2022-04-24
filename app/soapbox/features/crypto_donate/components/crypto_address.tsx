import React from 'react';
import { useDispatch } from 'react-redux';

import { openModal } from 'soapbox/actions/modals';
import { Text, Icon, Stack, HStack } from 'soapbox/components/ui';
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
    <Stack>
      <HStack alignItems='center' className='mb-1'>
        <CryptoIcon
          className='flex items-start justify-center w-6 mr-2.5'
          ticker={ticker}
          title={title}
        />

        <Text weight='bold'>{title || ticker.toUpperCase()}</Text>

        <HStack alignItems='center' className='ml-auto'>
          <a className='text-gray-500 ml-1' href='#' onClick={handleModalClick}>
            <Icon src={require('@tabler/icons/icons/qrcode.svg')} size={20} />
          </a>

          {explorerUrl && (
            <a className='text-gray-500 ml-1' href={explorerUrl} target='_blank'>
              <Icon src={require('@tabler/icons/icons/external-link.svg')} size={20} />
            </a>
          )}
        </HStack>
      </HStack>

      {note && (
        <Text>{note}</Text>
      )}

      <div className='crypto-address__address simple_form'>
        <CopyableInput value={address} />
      </div>
    </Stack>
  );
};

export default CryptoAddress;

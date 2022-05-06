import React from 'react';
import { useIntl, defineMessages } from 'react-intl';

import { HStack, Input } from 'soapbox/components/ui';
import { StreamfieldComponent } from 'soapbox/components/ui/streamfield/streamfield';

import type { CryptoAddress } from 'soapbox/types/soapbox';

const messages = defineMessages({
  ticker: { id: 'soapbox_config.crypto_address.meta_fields.ticker_placeholder', defaultMessage: 'Ticker' },
  address: { id: 'soapbox_config.crypto_address.meta_fields.address_placeholder', defaultMessage: 'Address' },
  note: { id: 'soapbox_config.crypto_address.meta_fields.note_placeholder', defaultMessage: 'Note (optional)' },
});

const CryptoAddressInput: StreamfieldComponent<CryptoAddress> = ({ value, onChange }) => {
  const intl = useIntl();

  const handleChange = (key: 'ticker' | 'address' | 'note'): React.ChangeEventHandler<HTMLInputElement> => {
    return e => {
      onChange(value.set(key, e.currentTarget.value));
    };
  };

  return (
    <HStack space={2} grow>
      <Input
        type='text'
        outerClassName='w-1/6 flex-grow'
        value={value.ticker}
        onChange={handleChange('ticker')}
        placeholder={intl.formatMessage(messages.ticker)}
      />
      <Input
        type='text'
        outerClassName='w-3/6 flex-grow'
        value={value.address}
        onChange={handleChange('address')}
        placeholder={intl.formatMessage(messages.address)}
      />
      <Input
        type='text'
        outerClassName='w-2/6 flex-grow'
        value={value.note}
        onChange={handleChange('note')}
        placeholder={intl.formatMessage(messages.note)}
      />
    </HStack>
  );
};

export default CryptoAddressInput;

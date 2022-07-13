import React from 'react';

import { CountryCode, formatPhoneNumber } from 'soapbox/utils/phone';

import HStack from '../hstack/hstack';
import Input from '../input/input';

import CountryCodeDropdown from './country-code-dropdown';

interface IPhoneInput extends Pick<React.InputHTMLAttributes<HTMLInputElement>, 'required' | 'autoFocus'> {
  /** Input phone number. */
  value?: string,
  /** E164 country code. */
  countryCode?: CountryCode,
  /** Change event handler taking the formatted input. */
  onChange?: (phone: string) => void,
}

/** Internationalized phone input with country code picker. */
const PhoneInput: React.FC<IPhoneInput> = (props) => {
  const { countryCode = 1, value = '', onChange, ...rest } = props;

  const handleCountryChange = (code: CountryCode) => {
    if (onChange) {
      onChange(formatPhoneNumber(countryCode, value));
    }
  };

  /** Pass the formatted phone to the handler. */
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    if (onChange) {
      onChange(formatPhoneNumber(countryCode, target.value));
    }
  };

  return (
    <HStack alignItems='center'>
      <CountryCodeDropdown
        countryCode={countryCode}
        onChange={handleCountryChange}
      />

      <Input
        type='text'
        onChange={handleChange}
        value={value}
        {...rest}
      />
    </HStack>
  );
};

export default PhoneInput;

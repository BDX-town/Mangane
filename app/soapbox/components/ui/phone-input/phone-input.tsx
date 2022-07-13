import { parsePhoneNumber } from 'libphonenumber-js';
import React, { useState, useEffect } from 'react';

import { CountryCode } from 'soapbox/utils/phone';

import HStack from '../hstack/hstack';
import Input from '../input/input';

import CountryCodeDropdown from './country-code-dropdown';

interface IPhoneInput extends Pick<React.InputHTMLAttributes<HTMLInputElement>, 'required' | 'autoFocus'> {
  /** E164 phone number. */
  value?: string,
  /** Change handler which receives the E164 phone string. */
  onChange?: (phone: string | undefined) => void,
  /** Country code that's selected on mount. */
  defaultCountryCode?: CountryCode,
}

/** Internationalized phone input with country code picker. */
const PhoneInput: React.FC<IPhoneInput> = (props) => {
  const { value, onChange, defaultCountryCode = '1', ...rest } = props;

  const [countryCode, setCountryCode] = useState<CountryCode>(defaultCountryCode);
  const [nationalNumber, setNationalNumber] = useState<string>('');

  const handleCountryChange = (code: CountryCode) => {
    setCountryCode(code);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setNationalNumber(target.value);
  };

  // When the internal state changes, update the external state.
  useEffect(() => {
    if (onChange) {
      try {
        const opts = { defaultCallingCode: countryCode, extract: false } as any;
        const result = parsePhoneNumber(nationalNumber, opts);

        if (!result.isPossible()) {
          throw result;
        }

        onChange(result.format('E.164'));
      } catch (e) {
        // The value returned is always a valid E164 string.
        // If it's not valid, it'll return undefined.
        onChange(undefined);
      }
    }
  }, [countryCode, nationalNumber]);

  return (
    <HStack alignItems='center'>
      <CountryCodeDropdown
        countryCode={countryCode}
        onChange={handleCountryChange}
      />

      <Input
        type='text'
        onChange={handleChange}
        value={nationalNumber}
        {...rest}
      />
    </HStack>
  );
};

export default PhoneInput;

import React from 'react';

import { COUNTRY_CODES, CountryCode } from 'soapbox/utils/phone';

interface ICountryCodeDropdown {
  countryCode: CountryCode,
  onChange(countryCode: CountryCode): void,
}

/** Dropdown menu to select a country code. */
const CountryCodeDropdown: React.FC<ICountryCodeDropdown> = ({ countryCode, onChange }) => {
  return (
    <select
      value={countryCode}
      className='h-full py-0 pl-3 pr-7 text-base bg-transparent border-transparent focus:outline-none focus:ring-primary-500 dark:text-white sm:text-sm rounded-md'
      onChange={(event) => onChange(event.target.value as any)}
    >
      {COUNTRY_CODES.map((code) => (
        <option value={code} key={code}>+{code}</option>
      ))}
    </select>
  );
};

export default CountryCodeDropdown;

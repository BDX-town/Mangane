import React from 'react';

import { Icon, HStack } from 'soapbox/components/ui';
import DropdownMenu from 'soapbox/containers/dropdown_menu_container';
import { COUNTRY_CODES, CountryCode } from 'soapbox/utils/phone';

import type { Menu } from 'soapbox/components/dropdown_menu';

interface ICountryCodeDropdown {
  countryCode: CountryCode,
  onChange(countryCode: CountryCode): void,
}

/** Dropdown menu to select a country code. */
const CountryCodeDropdown: React.FC<ICountryCodeDropdown> = ({ countryCode, onChange }) => {

  const handleMenuItem = (code: CountryCode) => {
    return () => {
      onChange(code);
    };
  };

  const menu: Menu = COUNTRY_CODES.map(code => ({
    text: <>+{code}</>,
    action: handleMenuItem(code),
  }));

  return (
    <DropdownMenu items={menu}>
      <button className='px-4 items-center'>
        <HStack space={1} alignItems='center'>
          <div>+{countryCode}</div>
          <Icon className='w-4 h-4 stroke-primary-600' src={require('@tabler/icons/chevron-down.svg')} />
        </HStack>
      </button>
    </DropdownMenu>
  );
};

export default CountryCodeDropdown;

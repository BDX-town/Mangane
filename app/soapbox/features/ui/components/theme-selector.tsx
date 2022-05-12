import React, { useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Icon } from 'soapbox/components/ui';

const messages = defineMessages({
  light: { id: 'theme_toggle.light', defaultMessage: 'Light' },
  dark: { id: 'theme_toggle.dark', defaultMessage: 'Dark' },
  system: { id: 'theme_toggle.system', defaultMessage: 'System' },
});

interface IThemeSelector {
  value: string,
  onChange: (value: string) => void,
}

/** Pure theme selector. */
const ThemeSelector: React.FC<IThemeSelector> = ({ value, onChange }) => {
  const intl = useIntl();

  const themeIconSrc = useMemo(() => {
    switch (value) {
      case 'system':
        return require('@tabler/icons/icons/device-desktop.svg');
      case 'light':
        return require('@tabler/icons/icons/sun.svg');
      case 'dark':
        return require('@tabler/icons/icons/moon.svg');
      default:
        return null;
    }
  }, [value]);

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = e => {
    onChange(e.target.value);
  };

  return (
    <label>
      <div className='relative rounded-md shadow-sm'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <Icon src={themeIconSrc} className='h-4 w-4 text-gray-400' />
        </div>

        <select
          onChange={handleChange}
          defaultValue={value}
          className='focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:border-gray-600 block w-full pl-8 pr-12 sm:text-sm border-gray-300 rounded-md'
        >
          <option value='system'>{intl.formatMessage(messages.system)}</option>
          <option value='light'>{intl.formatMessage(messages.light)}</option>
          <option value='dark'>{intl.formatMessage(messages.dark)}</option>
        </select>

        <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
          <Icon src={require('@tabler/icons/icons/chevron-down.svg')} className='h-4 w-4 text-gray-400' />
        </div>
      </div>
    </label>
  );
};

export default ThemeSelector;

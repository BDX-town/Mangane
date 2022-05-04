import React, { useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { changeSetting } from 'soapbox/actions/settings';
import { Icon } from 'soapbox/components/ui';
import { useSettings } from 'soapbox/hooks';

const messages = defineMessages({
  switchToLight: { id: 'tabs_bar.theme_toggle_light', defaultMessage: 'Switch to light theme' },
  switchToDark: { id: 'tabs_bar.theme_toggle_dark', defaultMessage: 'Switch to dark theme' },
});

interface IThemeToggle {
  showLabel?: boolean,
}

const ThemeToggle = ({ showLabel }: IThemeToggle) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const themeMode = useSettings().get('themeMode');

  const label = intl.formatMessage(themeMode === 'light' ? messages.switchToDark : messages.switchToLight);

  const onToggle = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(changeSetting(['themeMode'], event.target.value));
  };

  const themeIconSrc = useMemo(() => {
    switch (themeMode) {
    case 'system':
      return require('@tabler/icons/icons/device-desktop.svg');
    case 'light':
      return require('@tabler/icons/icons/sun.svg');
    case 'dark':
      return require('@tabler/icons/icons/moon.svg');
    default:
      return null;
    }
  }, [themeMode]);

  return (
    <label>
      <div className='relative rounded-md shadow-sm'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <Icon src={themeIconSrc} className='h-4 w-4 text-gray-400' />
        </div>

        <select
          onChange={onToggle}
          defaultValue={themeMode}
          className='focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:border-gray-600 block w-full pl-8 pr-12 sm:text-sm border-gray-300 rounded-md'
        >
          <option value='system'>System</option>
          <option value='light'>Light</option>
          <option value='dark'>Dark</option>
        </select>

        <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
          <Icon src={require('@tabler/icons/icons/chevron-down.svg')} className='h-4 w-4 text-gray-400' />
        </div>
      </div>
    </label>
  );
};

export default ThemeToggle;

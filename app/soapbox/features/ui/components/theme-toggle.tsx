import React, { useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { changeSetting } from 'soapbox/actions/settings';
import { Icon } from 'soapbox/components/ui';
import { useSettings } from 'soapbox/hooks';

const messages = defineMessages({
  light: { id: 'theme_toggle.light', defaultMessage: 'Light' },
  dark: { id: 'theme_toggle.dark', defaultMessage: 'Dark' },
  system: { id: 'theme_toggle.system', defaultMessage: 'System' },
});

interface IThemeToggle {
  showLabel?: boolean,
}

const ThemeToggle = ({ showLabel }: IThemeToggle) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const themeMode = useSettings().get('themeMode');

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

export default ThemeToggle;

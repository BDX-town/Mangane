import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import Toggle from 'react-toggle';
import { v4 as uuidv4 } from 'uuid';

import { changeSetting } from 'soapbox/actions/settings';
import { useSettings } from 'soapbox/hooks';

const messages = defineMessages({
  switchToLight: { id: 'tabs_bar.theme_toggle_light', defaultMessage: 'Switch to light theme' },
  switchToDark: { id: 'tabs_bar.theme_toggle_dark', defaultMessage: 'Switch to dark theme' },
});

interface IThemeToggle {
  showLabel: boolean,
}

function ThemeToggle({ showLabel }: IThemeToggle) {
  const intl = useIntl();
  const dispatch = useDispatch();
  const themeMode = useSettings().get('themeMode');

  const id = uuidv4();
  const label = intl.formatMessage(themeMode === 'light' ? messages.switchToDark : messages.switchToLight);

  const onToggle = () => {
    const setting = themeMode === 'light' ? 'dark' : 'light';
    dispatch(changeSetting(['themeMode'], setting));
  };

  return (
    <div className='theme-toggle'>
      <div className='setting-toggle' aria-label={label}>
        <Toggle
          id={id}
          checked={themeMode === 'light'}
          onChange={onToggle}
        />
        {showLabel && (<label htmlFor={id} className='setting-toggle__label'>{label}</label>)}
      </div>
    </div>
  );
}

export default ThemeToggle;

import React from 'react';
import { useDispatch } from 'react-redux';

import { changeSetting } from 'soapbox/actions/settings';
import { useSettings } from 'soapbox/hooks';

import ThemeSelector from './theme-selector';

/** Stateful theme selector. */
const ThemeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const themeMode = useSettings().get('themeMode');

  const handleChange = (themeMode: string) => {
    dispatch(changeSetting(['themeMode'], themeMode));
  };

  return (
    <ThemeSelector
      value={themeMode}
      onChange={handleChange}
    />
  );
};

export default ThemeToggle;

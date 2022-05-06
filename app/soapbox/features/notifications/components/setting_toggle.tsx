import React from 'react';

import { Toggle } from 'soapbox/components/ui';

import type { Map as ImmutableMap } from 'immutable';

interface ISettingToggle {
  /** Unique identifier for the Toggle. */
  id?: string,
  /** The full user settings map. */
  settings: ImmutableMap<string, any>,
  /** Array of key names leading into the setting map. */
  settingPath: string[],
  /** Callback when the setting is toggled. */
  onChange: (settingPath: string[], checked: boolean) => void,

}

/** Stateful toggle to change user settings. */
const SettingToggle: React.FC<ISettingToggle> = ({ id, settings, settingPath, onChange }) => {

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    onChange(settingPath, target.checked);
  };

  return (
    <Toggle
      id={id}
      checked={!!settings.getIn(settingPath)}
      onChange={handleChange}
    />
  );
};

export default SettingToggle;

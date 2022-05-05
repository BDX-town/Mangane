import React from 'react';

import IconPickerDropdown from './icon_picker_dropdown';

interface IIconPicker {
  value: string,
  onChange: React.ChangeEventHandler,
}

const IconPicker: React.FC<IIconPicker> = ({ value, onChange }) => {
  return (
    <div className='mt-1 relative rounded-md shadow-sm dark:bg-slate-800 border border-solid border-gray-300 dark:border-gray-600 rounded-md'>
      <IconPickerDropdown value={value} onPickEmoji={onChange} />
    </div>
  );
};

export default IconPicker;

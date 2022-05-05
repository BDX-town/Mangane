import React from 'react';

import IconPickerDropdown from './icon_picker_dropdown';

interface IIconPicker {
  label: React.ReactNode,
  value: string,
  onChange: React.ChangeEventHandler,
}

const IconPicker: React.FC<IIconPicker> = ({ onChange, value, label }) => {
  return (
    <div className='input with_label font_icon_picker'>
      <div className='label_input__font_icon_picker'>
        {label && (<label>{label}</label>)}
        <div className='label_input_wrapper'>
          <IconPickerDropdown value={value} onPickEmoji={onChange} />
        </div>
      </div>
    </div>
  );
};

export default IconPicker;

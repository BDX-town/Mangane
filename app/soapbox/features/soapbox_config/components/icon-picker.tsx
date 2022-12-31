import React from 'react';

import EmojiPicker from 'soapbox/components/emoji_picker';


interface IIconPicker {
  value: string,
  onChange: React.ChangeEventHandler,
}


const IconPicker: React.FC<IIconPicker> = ({ value, onChange }) => {
  return (
    <div className='mt-1 relative rounded-md shadow-sm dark:bg-slate-800 border border-solid border-gray-300 dark:border-gray-600 rounded-md'>
      <EmojiPicker button={<div className='grayscale h-[38px] w-[38px] text-lg flex items-center justify-center cursor-pointer'>{ value }</div>} onPickEmoji={onChange} />
    </div>
  );
};

export default IconPicker;

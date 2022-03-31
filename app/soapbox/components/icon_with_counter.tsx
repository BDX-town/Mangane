import React from 'react';

import Icon from 'soapbox/components/icon';
import { shortNumberFormat } from 'soapbox/utils/numbers';

interface IIconWithCounter extends React.HTMLAttributes<HTMLDivElement> {
  count: number,
  icon?: string;
  src?: string;
}

const IconWithCounter: React.FC<IIconWithCounter> = ({ icon, count, ...rest }) => {
  return (
    <div className='relative'>
      <Icon id={icon} {...rest} />

      {count > 0 && <i className='absolute -top-2 -right-2 block px-1.5 py-0.5 bg-accent-500 text-xs text-white rounded-full ring-2 ring-white'>
        {shortNumberFormat(count)}
      </i>}
    </div>
  );
};

export default IconWithCounter;

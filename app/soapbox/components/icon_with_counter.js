import PropTypes from 'prop-types';
import React from 'react';

import Icon from 'soapbox/components/icon';
import { shortNumberFormat } from 'soapbox/utils/numbers';

const IconWithCounter = ({ icon, count, ...rest }) => {
  return (
    <div className='relative'>
      <Icon id={icon} {...rest} />

      {count > 0 && <i className='absolute -top-2 -right-2 block px-1.5 py-0.5 bg-accent-500 text-xs text-white rounded-full ring-2 ring-white'>
        {shortNumberFormat(count)}
      </i>}
    </div>
  );
};

IconWithCounter.propTypes = {
  icon: PropTypes.string,
  count: PropTypes.number.isRequired,
};

export default IconWithCounter;

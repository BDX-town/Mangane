import PropTypes from 'prop-types';
import React from 'react';

import Icon from 'soapbox/components/icon';
import { shortNumberFormat } from 'soapbox/utils/numbers';

const IconWithCounter = ({ icon, count, ...rest }) => {
  return (
    <div className='icon-with-counter'>
      <Icon id={icon} {...rest} />
      {count > 0 && <i className='icon-with-counter__counter'>
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

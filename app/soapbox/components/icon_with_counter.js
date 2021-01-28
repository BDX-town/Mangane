import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'soapbox/components/icon';
import { shortNumberFormat } from 'soapbox/utils/numbers';

const IconWithCounter = ({ icon, count, fixedWidth }) => {
  return (
    <div className='icon-with-counter'>
      <Icon id={icon} fixedWidth={fixedWidth} />
      {count > 0 && <i className='icon-with-counter__counter'>
        {shortNumberFormat(count)}
      </i>}
    </div>
  );
};

IconWithCounter.propTypes = {
  icon: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  fixedWidth: PropTypes.bool,
};

export default IconWithCounter;

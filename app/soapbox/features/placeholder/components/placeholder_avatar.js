import PropTypes from 'prop-types';
import * as React from 'react';

const PlaceholderAvatar = ({ size }) => {
  const style = React.useMemo(() => {
    if (!size) {
      return {};
    }

    return {
      width: `${size}px`,
      height: `${size}px`,
    };
  }, [size]);

  return (
    <div
      className='rounded-full bg-slate-200 dark:bg-slate-700'
      style={style}
      alt=''
    />
  );
};

PlaceholderAvatar.propTypes = {
  size: PropTypes.number.isRequired,
};

export default PlaceholderAvatar;

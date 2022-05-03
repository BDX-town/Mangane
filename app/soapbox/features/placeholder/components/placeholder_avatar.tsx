import * as React from 'react';

interface IPlaceholderAvatar {
  size: number,
}

/** Fake avatar to display while data is loading. */
const PlaceholderAvatar: React.FC<IPlaceholderAvatar> = ({ size }) => {
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
    />
  );
};

export default PlaceholderAvatar;

import * as React from 'react';

import { Stack } from 'soapbox/components/ui';

interface IPlaceholderAvatar {
  size: number
  withText?: boolean
}

/** Fake avatar to display while data is loading. */
const PlaceholderAvatar: React.FC<IPlaceholderAvatar> = ({ size, withText = false }) => {
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
    <Stack space={3} className='animate-pulse text-center'>
      <div
        className='block mx-auto rounded-full bg-primary-50 dark:bg-primary-800'
        style={style}
      />

      {withText && (
        <div style={{ width: size, height: 20 }} className='rounded-full bg-primary-50 dark:bg-primary-800' />
      )}
    </Stack>
  );
};

export default PlaceholderAvatar;

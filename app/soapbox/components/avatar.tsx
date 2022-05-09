import classNames from 'classnames';
import React from 'react';

import StillImage from 'soapbox/components/still_image';

import type { Account } from 'soapbox/types/entities';

interface IAvatar {
  account?: Account | null,
  size?: number,
  className?: string,
}

/**
 * Legacy avatar component.
 * @see soapbox/components/ui/avatar/avatar.tsx
 * @deprecated
 */
const Avatar: React.FC<IAvatar> = ({ account, size, className }) => {
  if (!account) return null;

  // : TODO : remove inline and change all avatars to be sized using css
  const style: React.CSSProperties = !size ? {} : {
    width: `${size}px`,
    height: `${size}px`,
  };

  return (
    <StillImage
      className={classNames('rounded-full overflow-hidden', className)}
      style={style}
      src={account.avatar}
      alt=''
    />
  );
};

export default Avatar;

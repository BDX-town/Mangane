import classNames from 'classnames';
import * as React from 'react';

import StillImage from 'soapbox/components/still_image';

const AVATAR_SIZE = 42;

interface IAvatar {
  /** Accessible name; use an empty string when adjacent text names the account. */
  alt?: string,
  /** URL to the avatar image. */
  src: string,
  /** Width and height of the avatar in pixels. */
  size?: number,
  /** Extra class names for the div surrounding the avatar image. */
  className?: string,
}

/** Round profile avatar for accounts. */
const Avatar = (props: IAvatar) => {
  const { alt = 'Avatar', src, size = AVATAR_SIZE, className } = props;
  const normalizedSize = Number.isFinite(size) && size >= 16 && size <= 512 ? size : AVATAR_SIZE;

  const style: React.CSSProperties = React.useMemo(() => ({
    width: normalizedSize,
    height: normalizedSize,
  }), [normalizedSize]);

  return (
    <StillImage
      className={classNames('rounded-full overflow-hidden', className)}
      style={style}
      src={src}
      alt={alt}
    />
  );
};

export { Avatar as default, AVATAR_SIZE };

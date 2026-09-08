import classNames from 'classnames';
import * as React from 'react';

import StillImage from 'soapbox/components/still_image';
import PlaceholderAvatar from 'soapbox/features/placeholder/components/placeholder_avatar';

const AVATAR_SIZE = 42;

interface IAvatar {
  /** URL to the avatar image. */
  src: string,
  /** Width and height of the avatar in pixels. */
  size?: number,
  /** Extra class names for the div surrounding the avatar image. */
  className?: string,
}

/** Round profile avatar for accounts. */
const Avatar = (props: IAvatar) => {
  const { src, size = AVATAR_SIZE, className } = props;
  const [loaded, setLoaded] = React.useState(false);

  const style: React.CSSProperties = React.useMemo(() => ({
    width: size,
    height: size,
  }), [size]);

  return (
    <>
      <StillImage
        className={classNames('rounded-full overflow-hidden', className, { 'invisible absolute': !loaded })}
        style={style}
        src={src}
        aria-hidden
        onLoad={() => setLoaded(true)}
      />
      {
        !loaded && <PlaceholderAvatar size={size} />
      }
    </>
  );
};

export { Avatar as default, AVATAR_SIZE };

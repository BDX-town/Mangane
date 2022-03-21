import classNames from 'classnames';
import * as React from 'react';

import StillImage from 'soapbox/components/still_image';

const AVATAR_SIZE = 42;

interface IAvatar {
  src: string,
  size?: number,
  className?: string,
}

const Avatar = (props: IAvatar) => {
  const { src, size = AVATAR_SIZE, className } = props;

  const style: React.CSSProperties = React.useMemo(() => ({
    width: size,
    height: size,
  }), [size]);

  return (
    <StillImage
      className={classNames('rounded-full', {
        [className]: typeof className !== 'undefined',
      })}
      style={style}
      src={src}
      alt='Avatar'
    />
  );
};

export { Avatar as default, AVATAR_SIZE };

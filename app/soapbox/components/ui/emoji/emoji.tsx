import React from 'react';

import { removeVS16s, toCodePoints } from 'soapbox/utils/emoji';
import { joinPublicPath } from 'soapbox/utils/static';

interface IEmoji extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Unicode emoji character. */
  emoji: string,
}

/** A single emoji image. */
const Emoji: React.FC<IEmoji> = (props): JSX.Element | null => {
  const { emoji, alt, ...rest } = props;
  const codepoints = toCodePoints(removeVS16s(emoji));
  const filename = codepoints.join('-');

  if (!filename) return null;

  return (
    <img
      draggable='false'
      alt={alt || emoji}
      src={joinPublicPath(`packs/emoji/${filename}.svg`)}
      {...rest}
    />
  );
};

export default Emoji;

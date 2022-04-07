import React from 'react';

import { joinPublicPath } from 'soapbox/utils/static';

// Taken from twemoji-parser
// https://github.com/twitter/twemoji-parser/blob/a97ef3994e4b88316812926844d51c296e889f76/src/index.js
const removeVS16s = (rawEmoji: string): string => {
  const vs16RegExp = /\uFE0F/g;
  const zeroWidthJoiner = String.fromCharCode(0x200d);
  return rawEmoji.indexOf(zeroWidthJoiner) < 0 ? rawEmoji.replace(vs16RegExp, '') : rawEmoji;
};

const toCodePoints = (unicodeSurrogates: string): string[] => {
  const points = [];
  let char = 0;
  let previous = 0;
  let i = 0;
  while (i < unicodeSurrogates.length) {
    char = unicodeSurrogates.charCodeAt(i++);
    if (previous) {
      points.push((0x10000 + ((previous - 0xd800) << 10) + (char - 0xdc00)).toString(16));
      previous = 0;
    } else if (char > 0xd800 && char <= 0xdbff) {
      previous = char;
    } else {
      points.push(char.toString(16));
    }
  }
  return points;
};

interface IEmoji extends React.ImgHTMLAttributes<HTMLImageElement> {
  emoji: string,
}

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

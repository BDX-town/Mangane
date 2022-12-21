import React from 'react';

import { EmojiReact as EmojiReactType } from 'soapbox/utils/emoji_reacts';
import Emoji from '../emoji/emoji';

interface IEmojiReact extends React.ImgHTMLAttributes<HTMLImageElement> {
  emoji: EmojiReactType,
  alt?: string,
}

/** A single emoji reaction. Support custom emojis. */
const EmojiReact: React.FC<IEmojiReact> = (props): JSX.Element | null => {
  const { emoji, alt, ...rest } = props;

  if(emoji.get("url")) {
    return (
        <img
          draggable='false'
          alt={alt || emoji.get("name")}
          src={emoji.get("url")}
          {...rest}
        />
      );
  }

  return <Emoji emoji={emoji.get("name")} alt={alt} {...rest} />
};

export default EmojiReact;

import React from 'react';

import unicodeMapping from 'soapbox/features/emoji/emoji_unicode_mapping_light';
import { joinPublicPath } from 'soapbox/utils/static';

export type Emoji = {
  id: string,
  custom: boolean,
  imageUrl: string,
  native: string,
  colons: string,
}

type UnicodeMapping = {
  filename: string,
}

interface IAutosuggestEmoji {
  emoji: Emoji,
}

const AutosuggestEmoji: React.FC<IAutosuggestEmoji> = ({ emoji }) => {
  let url;

  if (emoji.custom) {
    url = emoji.imageUrl;
  } else {
    // @ts-ignore
    const mapping: UnicodeMapping = unicodeMapping[emoji.native] || unicodeMapping[emoji.native.replace(/\uFE0F$/, '')];

    if (!mapping) {
      return null;
    }

    url = joinPublicPath(`packs/emoji/${mapping.filename}.svg`);
  }

  return (
    <div className='autosuggest-emoji' data-testid='emoji'>
      <img
        className='emojione'
        src={url}
        alt={emoji.native || emoji.colons}
      />

      {emoji.colons}
    </div>
  );
};

export default AutosuggestEmoji;

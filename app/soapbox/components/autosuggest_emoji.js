import PropTypes from 'prop-types';
import React from 'react';

import { joinPublicPath } from 'soapbox/utils/static';

import unicodeMapping from '../features/emoji/emoji_unicode_mapping_light';

export default class AutosuggestEmoji extends React.PureComponent {

  static propTypes = {
    emoji: PropTypes.object.isRequired,
  };

  render() {
    const { emoji } = this.props;
    let url;

    if (emoji.custom) {
      url = emoji.imageUrl;
    } else {
      const mapping = unicodeMapping[emoji.native] || unicodeMapping[emoji.native.replace(/\uFE0F$/, '')];

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
  }

}

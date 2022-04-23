import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, defineMessages } from 'react-intl';

import Card from './card';

export const REGEX = /https?:\/\/omg\.phie\.ovh\/.+\.(webm|gif)/g;
export const DESCRIPTION = '<a.*href="?\'?{url}"?\'?.*>(.+)<\/a>';

const messages = defineMessages({
  proposed: { id: 'card_gif.proposed', defaultMessage: 'GIF proposé par Oh My GIF' },
});

export default @injectIntl
class CardGIF extends React.PureComponent {

    static propTypes = {
      content: PropTypes.string.isRequired,
      maxDescription: PropTypes.number,
      onOpenMedia: PropTypes.func.isRequired,
      compact: PropTypes.bool,
      defaultWidth: PropTypes.number,
      cacheWidth: PropTypes.func,
      intl: PropTypes.object.isRequired,
    }

    render() {
      const { intl } = this.props;

      const gif = this.props.content.match(REGEX);
      if(gif.length <= 0) return null;
      const descriptionReg = new RegExp(DESCRIPTION.replace('{url}', gif[0]), 'g');
      const descriptionMatch = Array.from(this.props.content.matchAll(descriptionReg));
      const description = descriptionMatch.length > 0 ? descriptionMatch[0][1] : null;
      const card = new ImmutableMap({
        url: gif[0],
        title: description || gif[0],
        description: description || intl.formatMessage(messages.proposed),
        type: 'video',
        provider_name: 'Oh My GIF',
        html: `<video src=${gif[0]} muted autoplay loop style="width: 100%; height: 100%; object-fit: contain;" />`,
      });
      return (
        <Card
          card={card}
          defaultEmbedded
          {...this.props}
        />
      );
    }

}
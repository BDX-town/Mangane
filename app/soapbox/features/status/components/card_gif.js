import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';

import Card from './card';

export const REGEX = /https?:\/\/omg\.phie\.ovh\/.+\.(webm|gif)/g;

export default class CardGIF extends React.PureComponent {

    static propTypes = {
      content: PropTypes.string.isRequired,
      maxDescription: PropTypes.number,
      onOpenMedia: PropTypes.func.isRequired,
      compact: PropTypes.bool,
      defaultWidth: PropTypes.number,
      cacheWidth: PropTypes.func,
    }

    render() {
        const gif = this.props.content.match(REGEX);
        return null;
        if(gif.length <= 0) return null;
      const card = new ImmutableMap({
        url: gif[0],
        title: gif[0],
      });
      /*

       "url": "https://www.theguardian.com/money/2019/dec/07/i-lost-my-193000-inheritance-with-one-wrong-digit-on-my-sort-code",
  "title": "‘I lost my £193,000 inheritance – with one wrong digit on my sort code’",
  "description": "When Peter Teich’s money went to another Barclays customer, the bank offered £25 as a token gesture",
  "type": "link",

  */
        return null;
      return (
        <Card
          card={card}
          {...this.props}
        />
      );
    }

}
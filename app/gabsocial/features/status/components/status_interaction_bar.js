import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import emojify from 'gabsocial/features/emoji/emoji';
import { reduceEmoji } from 'gabsocial/utils/emoji_reacts';

export class StatusInteractionBar extends React.Component {

  propTypes = {
    status: ImmutablePropTypes.map,
  }

  render() {
    const { status } = this.props;
    const emojiReacts = status.getIn(['pleroma', 'emoji_reactions']);
    const favouritesCount = status.get('favourites_count');

    return (
      <div className='emoji-reacts'>
        {reduceEmoji(emojiReacts, favouritesCount).map((e, i) => (
          <span className='emoji-react' key={i}>
            <span
              className='emoji-react--emoji'
              dangerouslySetInnerHTML={{ __html: emojify(e.get('name')) }}
            />
            <span className='emoji-react--count'>{e.get('count')}</span>
          </span>
        ))}
      </div>
    );
  }

}

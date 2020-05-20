import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import emojify from 'gabsocial/features/emoji/emoji';
import { reduceEmoji } from 'gabsocial/utils/emoji_reacts';

export class StatusInteractionBar extends React.Component {

  propTypes = {
    status: ImmutablePropTypes.map,
  }

  getNormalizedReacts = () => {
    const { status } = this.props;
    const emojiReacts = status.getIn(['pleroma', 'emoji_reactions']);
    const favouritesCount = status.get('favourites_count');
    return reduceEmoji(emojiReacts, favouritesCount).reverse();
  }

  render() {
    const emojiReacts = this.getNormalizedReacts();
    const count = emojiReacts.reduce((acc, cur) => (
      acc + cur.get('count')
    ), 0);

    if (count < 1) return null;

    return (
      <div className='emoji-reacts-container'>
        <div className='emoji-reacts'>
          {emojiReacts.map((e, i) => (
            <span className='emoji-react' key={i}>
              <span
                className='emoji-react__emoji'
                dangerouslySetInnerHTML={{ __html: emojify(e.get('name')) }}
              />
              <span className='emoji-react__count'>{e.get('count')}</span>
            </span>
          ))}
        </div>
        <div className='emoji-reacts__count'>
          {count}
        </div>
      </div>
    );
  }

}

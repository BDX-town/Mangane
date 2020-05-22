import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import emojify from 'gabsocial/features/emoji/emoji';
import { reduceEmoji } from 'gabsocial/utils/emoji_reacts';

export class StatusInteractionBar extends React.Component {

  static propTypes = {
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

    const EmojiReactsContainer = () => (
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

    return (
      <div className='status-interaction-bar'>
        {count > 0 && <EmojiReactsContainer />}
      </div>
    );
  }

}

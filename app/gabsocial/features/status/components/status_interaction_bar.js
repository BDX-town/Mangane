import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import emojify from 'gabsocial/features/emoji/emoji';

// https://emojipedia.org/facebook/
const ALLOWED_EMOJI = [
  '👍',
  '❤️',
  '😂',
  '😯',
  '😢',
  '😡',
];

export class StatusInteractionBar extends React.Component {

  propTypes = {
    status: ImmutablePropTypes.map,
  }

  sortEmoji = emojiReacts => (
    emojiReacts // TODO: Sort by count
  );

  mergeEmoji = emojiReacts => (
    emojiReacts // TODO: Merge similar emoji
  );

  filterEmoji = emojiReacts => (
    emojiReacts.filter(emojiReact => (
      ALLOWED_EMOJI.includes(emojiReact.get('name'))
    )))

  render() {
    const { status } = this.props;
    const emojiReacts = status.getIn(['pleroma', 'emoji_reactions']);
    const likeCount = status.get('favourites_count');

    return (
      <>
        {likeCount > 0 && <span className='emoji-react'>
          <span
            className='emoji-react--emoji'
            dangerouslySetInnerHTML={{ __html: emojify('👍') }}
          />
          <span className='emoji-react--count'>{likeCount}</span>
        </span>}
        {this.filterEmoji(emojiReacts).map(e => (
          <span className='emoji-react'>
            <span
              className='emoji-react--emoji'
              dangerouslySetInnerHTML={{ __html: emojify(e.get('name')) }}
            />
            <span className='emoji-react--count'>{e.get('count')}</span>
          </span>
        ))}
      </>
    );
  }

}

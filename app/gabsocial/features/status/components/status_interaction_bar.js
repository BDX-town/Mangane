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
    emojiReacts // TODO: Sort
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

    return (
      <>
        {this.filterEmoji(emojiReacts).map(e =>
          <span dangerouslySetInnerHTML={{ __html: emojify(e.get('name')) }} />
        )}
      </>
    );
  }

}

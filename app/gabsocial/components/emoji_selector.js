import React from 'react';
import PropTypes from 'prop-types';
import { ALLOWED_EMOJI } from 'gabsocial/utils/emoji_reacts';
import emojify from 'gabsocial/features/emoji/emoji';

export default class EmojiSelector extends React.Component {

  propTypes = {
    onReact: PropTypes.func.isRequired,
  }

  render() {
    const { onReact } = this.props;

    return (
      <div className='emoji-react-selector'>
        {ALLOWED_EMOJI.map(emoji => (
          <button
            className='emoji-react-selector__emoji'
            dangerouslySetInnerHTML={{ __html: emojify(emoji) }}
            onClick={onReact(emoji)}
          />
        ))}
      </div>
    );
  }

}

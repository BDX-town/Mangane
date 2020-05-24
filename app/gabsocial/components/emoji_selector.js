import React from 'react';
import PropTypes from 'prop-types';
import { ALLOWED_EMOJI } from 'gabsocial/utils/emoji_reacts';
import emojify from 'gabsocial/features/emoji/emoji';
import classNames from 'classnames';

export default class EmojiSelector extends React.Component {

  static propTypes = {
    onReact: PropTypes.func.isRequired,
    visible: PropTypes.bool,
  }

  static defaultProps = {
    onReact: () => {},
    visible: false,
  }

  render() {
    const { onReact, visible } = this.props;

    return (
      <div className={classNames('emoji-react-selector', { 'emoji-react-selector--visible': visible })}>
        {ALLOWED_EMOJI.map((emoji, i) => (
          <button
            key={i}
            className='emoji-react-selector__emoji'
            dangerouslySetInnerHTML={{ __html: emojify(emoji) }}
            onClick={onReact(emoji)}
          />
        ))}
      </div>
    );
  }

}

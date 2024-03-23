import { connect } from 'react-redux';

import { useEmoji } from '../actions/emojis';
import EmojiPicker, { getCustomEmojis } from '../components/emoji_picker';

const mapStateToProps = state => ({
  custom_emojis: getCustomEmojis(state),
});

const mapDispatchToProps = (dispatch, props) => ({
  onPickEmoji: emoji => {
    dispatch(useEmoji(emoji)); // eslint-disable-line react-hooks/rules-of-hooks

    if (props.onPickEmoji) {
      props.onPickEmoji(emoji);
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EmojiPicker);

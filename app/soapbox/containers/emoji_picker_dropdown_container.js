import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { useEmoji } from '../actions/emojis';
import EmojiPicker from '../components/emoji_picker';


const getCustomEmojis = createSelector([
  state => state.get('custom_emojis'),
], emojis => emojis.filter(e => e.get('visible_in_picker')).sort((a, b) => {
  const aShort = a.get('shortcode').toLowerCase();
  const bShort = b.get('shortcode').toLowerCase();

  if (aShort < bShort) {
    return -1;
  } else if (aShort > bShort) {
    return 1;
  } else {
    return 0;
  }
}));

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

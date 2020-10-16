import { connect } from 'react-redux';
import IconPickerDropdown from '../components/icon_picker_dropdown';
import { useEmoji } from '../../../actions/emojis';

const mapStateToProps = state => ({
  frequentlyUsedEmojis: '',
});

const mapDispatchToProps = (dispatch, { onPickEmoji }) => ({

  onPickEmoji: emoji => {
    dispatch(useEmoji(emoji)); // eslint-disable-line react-hooks/rules-of-hooks

    if (onPickEmoji) {
      onPickEmoji(emoji);
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(IconPickerDropdown);

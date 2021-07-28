import { connect } from 'react-redux';
import GIFPickerDropdown from '../components/gif_picker_dropdown';
import { useGIF } from './../../../actions/Gifs';

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch, { handleGIFPick }) => ({
  handleGIFPick: (url) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    dispatch(useGIF(url));
    handleGIFPick(url);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(GIFPickerDropdown);

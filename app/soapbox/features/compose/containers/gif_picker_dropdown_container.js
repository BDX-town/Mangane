import { connect } from 'react-redux';
import GIFPickerDropdown from '../components/gif_picker_dropdown';
import { List as ImmutableList } from 'immutable';
import { favGIF, unfavGIF } from '../../../actions/gifs';
import { changeComposeContentType } from '../../../actions/compose';

const getFavGIFs = state => state.getIn(['settings', 'favGIFs'], ImmutableList()).toJS();

const mapStateToProps = state => ({
  favGIFs: getFavGIFs(state),
});

const mapDispatchToProps = (dispatch, { handleGIFPick }) => ({
  handleGIFPick: (gif) => {
    dispatch(changeComposeContentType('text/markdown'));
    handleGIFPick(gif);
  },
  handleGIFfav: (gif) => dispatch(favGIF(gif)),
  handleGIFunfav: (gif) => dispatch(unfavGIF(gif)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GIFPickerDropdown);

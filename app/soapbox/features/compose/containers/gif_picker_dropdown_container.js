import { connect } from 'react-redux';
import GIFPickerDropdown from '../components/gif_picker_dropdown';
import { List as ImmutableList } from 'immutable';
import { favGIF, unfavGIF } from '../../../actions/gifs';

const getFavGIFs = state => state.getIn(['settings', 'favGIFs'], ImmutableList()).toArray();;

const mapStateToProps = state => ({
  favGIFs: getFavGIFs(state),
});

const mapDispatchToProps = (dispatch, { handleGIFPick }) => ({
  handleGIFPick,
  handleGIFfav: (gif) => dispatch(favGIF(gif)),
  handleGIFunfav: (gif) => dispatch(unfavGIF(gif)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GIFPickerDropdown);

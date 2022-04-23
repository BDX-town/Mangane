import { List as ImmutableList } from 'immutable';
import { connect } from 'react-redux';

import { changeComposeContentType } from '../../../actions/compose';
import { favGIF, unfavGIF } from '../../../actions/gifs';
import GIFPickerDropdown from '../components/gif_picker_dropdown';

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

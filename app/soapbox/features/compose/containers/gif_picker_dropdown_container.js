import { connect } from 'react-redux';
import GIFPickerDropdown from '../components/gif_picker_dropdown';
import { getSettings, changeSetting } from '../../../actions/settings';


const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch, { onPickEmoji }) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(GIFPickerDropdown);

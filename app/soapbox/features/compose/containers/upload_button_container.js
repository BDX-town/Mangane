import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { uploadCompose } from '../../../actions/compose';
import UploadButton from '../components/upload_button';

const mapStateToProps = state => ({
  disabled: state.getIn(['compose', 'is_uploading']),
  resetFileKey: state.getIn(['compose', 'resetFileKey']),
});

const mapDispatchToProps = (dispatch, { intl }) => ({

  onSelectFile(files) {
    dispatch(uploadCompose(files, intl));
  },

});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(UploadButton));

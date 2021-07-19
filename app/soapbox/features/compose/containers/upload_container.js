import { connect } from 'react-redux';
import Upload from '../components/upload';
import { undoUploadCompose, changeUploadCompose } from '../../../actions/compose';
import { openModal } from '../../../actions/modal';
import { submitCompose } from '../../../actions/compose';
import { List as ImmutableList } from 'immutable';

const mapStateToProps = (state, { id }) => ({
  media: state.getIn(['compose', 'media_attachments']).find(item => item.get('id') === id),
  descriptionLimit: state.getIn(['instance', 'description_limit']),
});

const mapDispatchToProps = dispatch => ({

  onUndo: id => {
    dispatch(undoUploadCompose(id));
  },

  onDescriptionChange: (id, description) => {
    dispatch(changeUploadCompose(id, { description }));
  },

  onOpenFocalPoint: id => {
    dispatch(openModal('FOCAL_POINT', { id }));
  },

  onOpenModal: media => {
    dispatch(openModal('MEDIA', { media: ImmutableList.of(media), index: 0 }));
  },

  onSubmit(router) {
    dispatch(submitCompose(router));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(Upload);

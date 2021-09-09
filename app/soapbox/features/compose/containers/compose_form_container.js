import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import ComposeForm from '../components/compose_form';
import {
  changeCompose,
  submitCompose,
  clearComposeSuggestions,
  fetchComposeSuggestions,
  selectComposeSuggestion,
  changeComposeSpoilerText,
  insertEmojiCompose,
  uploadCompose,
} from '../../../actions/compose';

const mapStateToProps = state => ({
  text: state.getIn(['compose', 'text']),
  suggestions: state.getIn(['compose', 'suggestions']),
  spoiler: state.getIn(['compose', 'spoiler']),
  spoilerText: state.getIn(['compose', 'spoiler_text']),
  privacy: state.getIn(['compose', 'privacy']),
  focusDate: state.getIn(['compose', 'focusDate']),
  caretPosition: state.getIn(['compose', 'caretPosition']),
  isSubmitting: state.getIn(['compose', 'is_submitting']),
  isChangingUpload: state.getIn(['compose', 'is_changing_upload']),
  isUploading: state.getIn(['compose', 'is_uploading']),
  showSearch: state.getIn(['search', 'submitted']) && !state.getIn(['search', 'hidden']),
  anyMedia: state.getIn(['compose', 'media_attachments']).size > 0,
  isModalOpen: state.get('modal').modalType === 'COMPOSE',
  maxTootChars: state.getIn(['instance', 'max_toot_chars']),
  scheduledAt: state.getIn(['compose', 'schedule']),
  scheduledStatusCount: state.get('scheduled_statuses').size,
});

const mapDispatchToProps = (dispatch) => ({

  onChange(text) {
    dispatch(changeCompose(text));
  },

  onSubmit(router, group) {
    dispatch(submitCompose(router, group));
  },

  onClearSuggestions() {
    dispatch(clearComposeSuggestions());
  },

  onFetchSuggestions(token) {
    dispatch(fetchComposeSuggestions(token));
  },

  onSuggestionSelected(position, token, suggestion, path) {
    dispatch(selectComposeSuggestion(position, token, suggestion, path));
  },

  onChangeSpoilerText(checked) {
    dispatch(changeComposeSpoilerText(checked));
  },

  onPaste(files) {
    dispatch(uploadCompose(files));
  },

  onPickEmoji(position, data, needsSpace) {
    dispatch(insertEmojiCompose(position, data, needsSpace));
  },

});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, {
    ...stateProps,
    ...dispatchProps,
  });
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps, mergeProps)(ComposeForm));
